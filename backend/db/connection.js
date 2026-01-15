const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb://root:rootpassword@mongodb:27017/authdb?authSource=admin';

// Connection options
const options = {
  maxPoolSize: 20,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return mongoose.connection;
  }

  try {
    console.log('Connecting to MongoDB...');
    console.log('URI:', MONGODB_URI);
    
    await mongoose.connect(MONGODB_URI, options);
    
    isConnected = true;
    console.log('✅ MongoDB Connected Successfully');
    console.log('✅ Database:', mongoose.connection.name);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
    });
    
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Full error:', error);
    isConnected = false;
    throw error;
  }
};

// Get database instance
const getDb = () => {
  if (!isConnected) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return mongoose.connection.db;
};

// Graceful shutdown
const closeConnection = async () => {
  if (isConnected) {
    await mongoose.connection.close();
    isConnected = false;
    console.log('MongoDB connection closed');
  }
};

module.exports = {
  connectToDatabase,
  getDb,
  closeConnection,
  mongoose,
};
