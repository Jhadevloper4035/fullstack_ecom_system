const amqp = require('amqplib');

// RabbitMQ Configuration
const createRabbitConfig = (env = process.env) => ({
  url: env.RABBITMQ_URL || 'amqp://admin:adminpassword@localhost:5672',
});

// Queue names
const QUEUES = {
  EMAIL: 'email_queue',
};

// Create connection with retry logic
const createConnection = async (config, retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await amqp.connect(config.url);
      console.log('RabbitMQ Connected');
      
      connection.on('error', (err) => {
        console.error('RabbitMQ Connection Error:', err);
      });
      
      connection.on('close', () => {
        console.log('RabbitMQ Connection Closed');
      });
      
      return connection;
    } catch (error) {
      console.error(`RabbitMQ connection attempt ${i + 1} failed:`, error.message);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};

// Initialize connection and channel
let connection;
let channel;

const getRabbitChannel = async () => {
  if (!connection) {
    connection = await createConnection(createRabbitConfig());
  }
  if (!channel) {
    channel = await connection.createChannel();
    // Assert queues
    await channel.assertQueue(QUEUES.EMAIL, { durable: true });
  }
  return channel;
};

// Publisher - Send message to queue
const publishToQueue = (queueName) => async (message) => {
  try {
    const ch = await getRabbitChannel();
    const messageBuffer = Buffer.from(JSON.stringify(message));
    return ch.sendToQueue(queueName, messageBuffer, { persistent: true });
  } catch (error) {
    console.error('Failed to publish message:', error);
    throw error;
  }
};

// Consumer - Process messages from queue
const consumeFromQueue = (queueName) => async (handler) => {
  try {
    const ch = await getRabbitChannel();
    await ch.prefetch(1); // Process one message at a time
    
    await ch.consume(queueName, async (msg) => {
      if (msg !== null) {
        try {
          const content = JSON.parse(msg.content.toString());
          await handler(content);
          ch.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          // Reject and requeue if processing fails
          ch.nack(msg, false, true);
        }
      }
    });
    
    console.log(`Waiting for messages in ${queueName}`);
  } catch (error) {
    console.error('Failed to consume messages:', error);
    throw error;
  }
};

// Email queue specific functions
const publishEmailJob = publishToQueue(QUEUES.EMAIL);
const consumeEmailJobs = consumeFromQueue(QUEUES.EMAIL);

// Graceful shutdown
const closeRabbitConnection = async () => {
  if (channel) {
    await channel.close();
  }
  if (connection) {
    await connection.close();
  }
  console.log('RabbitMQ connection closed');
};

module.exports = {
  QUEUES,
  getRabbitChannel,
  publishEmailJob,
  consumeEmailJobs,
  closeRabbitConnection,
};
