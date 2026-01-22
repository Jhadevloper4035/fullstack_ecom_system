require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const { apiLimiter } = require('./middleware/rateLimitMiddleware');
const { connectToDatabase, closeConnection } = require('./db/connection');
const { closeRedisClient , getRedisClient } = require('./db/redis');
const { closeRabbitConnection } = require('./services/rabbitmq');

//

const authRoutes = require('./routes/authRoutes');
const addressRoutes = require('./routes/addressRoute');
const categoryRoute = require("./routes/categoryRoute")
const subCategoryRoute = require("./routes/subCategoryRoute")


// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Trust proxy - Required when behind nginx
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration - Allow requests from nginx
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost',
  'http://localhost:80',
  'https://localhost',
  'https://localhost:443',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);

    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // In development, allow any localhost origin
      if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// Debug endpoint to test connectivity
app.post('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  console.log('Body:', req.body);
  res.json({
    success: true,
    message: 'Backend is working',
    receivedData: req.body
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/category', categoryRoute);
app.use('/api/subcategory', subCategoryRoute);


// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);

  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

// Connect to MongoDB BEFORE starting server
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectToDatabase();
    await getRedisClient();

    // Then start the server
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} & Environment: ${process.env.NODE_ENV || 'development'} `);
    });

    // Graceful shutdown
    const gracefulShutdown = async () => {
      console.log('Starting graceful shutdown...');

      server.close(async () => {
        console.log('HTTP server closed');

        try {
          await closeConnection();
          await closeRedisClient();
          await closeRabbitConnection();
          console.log('All connections closed');
          process.exit(0);
        } catch (error) {
          console.error('Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('Forcing shutdown');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown();
});

module.exports = app;
