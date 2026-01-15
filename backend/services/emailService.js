const nodemailer = require('nodemailer');
const { publishEmailJob } = require('./rabbitmq');

// Verify nodemailer is loaded correctly
if (!nodemailer || typeof nodemailer.createTransport !== 'function') {
  console.error('Nodemailer module not loaded correctly');
  console.error('Nodemailer:', nodemailer);
  throw new Error('Nodemailer module initialization failed');
}

// Email configuration
const createEmailConfig = (env = process.env) => ({
  host: env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(env.SMTP_PORT || '587'),
  secure: parseInt(env.SMTP_PORT || '587') === 465,
  auth: {
    user: env.SMTP_USER || "info@rantechnology.in",
    pass: env.SMTP_PASSWORD || "xrra enyk oeih vyzf",
  },
  from: env.SMTP_FROM || 'noreply@yourapp.com',
});

// Create transporter with error handling
const createTransporter = (config) => {
  try {
    // Use createTransport (not createTransporter)
    return nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });
  } catch (error) {
    console.error('Failed to create transporter:', error);
    throw error;
  }
};

// Email templates remain the same...
const emailTemplates = {
  verification: (verificationUrl, email) => ({
    subject: 'Verify Your Email Address',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Email Verification</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Hello,</p>
            <p style="font-size: 16px;">Thank you for registering! Please verify your email address to complete your registration.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Verify Email</a>
            </div>
            <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
            <p style="font-size: 14px; color: #667eea; word-break: break-all;">${verificationUrl}</p>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">This link will expire in 24 hours.</p>
            <p style="font-size: 14px; color: #666;">If you didn't create an account, please ignore this email.</p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2025 Your Company. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
    text: `
Email Verification

Hello,

Thank you for registering! Please verify your email address by clicking the link below:

${verificationUrl}

This link will expire in 24 hours.

If you didn't create an account, please ignore this email.
    `,
  }),

  passwordReset: (resetUrl, email) => ({
    subject: 'Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Password Reset</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Hello,</p>
            <p style="font-size: 16px;">We received a request to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
            </div>
            <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
            <p style="font-size: 14px; color: #f5576c; word-break: break-all;">${resetUrl}</p>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">This link will expire in 1 hour.</p>
            <p style="font-size: 14px; color: #666;">If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2025 Your Company. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
    text: `
Password Reset

Hello,

We received a request to reset your password. Click the link below to create a new password:

${resetUrl}

This link will expire in 1 hour.

If you didn't request a password reset, please ignore this email.
    `,
  }),

  welcomeEmail: (email) => ({
    subject: 'Welcome to Our Platform!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Welcome!</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Hello,</p>
            <p style="font-size: 16px;">Welcome to our platform! Your email has been successfully verified.</p>
            <p style="font-size: 16px;">We're excited to have you on board. You can now access all features of your account.</p>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">If you have any questions, feel free to contact our support team.</p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2025 Your Company. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
    text: `
Welcome!

Hello,

Welcome to our platform! Your email has been successfully verified.

We're excited to have you on board. You can now access all features of your account.
    `,
  }),
};

// Queue email job
const queueEmail = async (to, template, ...templateArgs) => {
  try {
    const emailContent = emailTemplates[template](...templateArgs);
    const emailJob = {
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
      timestamp: new Date().toISOString(),
    };

    await publishEmailJob(emailJob);
    return { success: true };
  } catch (error) {
    console.error('Failed to queue email:', error);
    return { success: false, error: error.message };
  }
};

// Send email directly - Used by worker
const sendEmail = async (emailJob) => {
  try {
    const config = createEmailConfig();
    const transporter = createTransporter(config);
    
    const mailOptions = {
      from: config.from,
      to: emailJob.to,
      subject: emailJob.subject,
      html: emailJob.html,
      text: emailJob.text,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error; // Let the worker handle retries
  }
};

// Email service functions
const sendVerificationEmail = (to, verificationUrl) => 
  queueEmail(to, 'verification', verificationUrl, to);

const sendPasswordResetEmail = (to, resetUrl) => 
  queueEmail(to, 'passwordReset', resetUrl, to);

const sendWelcomeEmail = (to) => 
  queueEmail(to, 'welcomeEmail', to);

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendEmail,
};