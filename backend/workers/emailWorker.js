require('dotenv').config();
const { consumeEmailJobs, closeRabbitConnection } = require('../services/rabbitmq');
const { sendEmail } = require('../services/emailService');

// Process email jobs
const processEmailJob = async (emailJob) => {
  console.log('Processing email job:', emailJob.to);
  
  try {
    // sendEmail throws errors, it doesn't return { success: false }
    const result = await sendEmail(emailJob);
    console.log(`✓ Email sent successfully to ${emailJob.to}`, result.messageId);
    return result;
  } catch (error) {
    console.error(`✗ Email processing error for ${emailJob.to}:`, error.message);
    throw error; // Re-throw to let RabbitMQ handle retry
  }
};

// Start email worker
const startWorker = async () => {
  console.log('🚀 Email worker starting...');
  
  try {
    await consumeEmailJobs(processEmailJob);
    console.log('✓ Email worker started successfully and listening for jobs');
  } catch (error) {
    console.error('✗ Failed to start email worker:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async () => {
  console.log('📪 Shutting down email worker gracefully...');
  try {
    await closeRabbitConnection();
    console.log('✓ Email worker shut down successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  shutdown();
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown();
});

// Start the worker
startWorker();