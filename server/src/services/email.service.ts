import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter
const transporter = nodemailer.createTransport({
  // For development, use a test service like Mailtrap
  // For production, use SendGrid, Mailgun, or similar
  host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
  port: Number(process.env.EMAIL_PORT) || 2525,
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASSWORD || '',
  },
});

/**
 * Send a welcome email to a new subscriber
 */
export const sendWelcomeEmail = async (email: string, tier: string) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@quantumbets.com',
      to: email,
      subject: 'Welcome to QuantumBets!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #F97316;">Welcome to QuantumBets!</h1>
          <p>Thank you for subscribing to our ${tier} plan. We're excited to have you on board!</p>
          <p>You'll start receiving our AI-powered sports betting picks right away.</p>
          ${tier !== 'free' ? '<p>Your SMS notifications are also activated!</p>' : ''}
          <p>If you have any questions, feel free to reply to this email.</p>
          <p>Best regards,<br>The QuantumBets Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

/**
 * Send a subscription confirmation email
 */
export const sendSubscriptionConfirmationEmail = async (email: string, tier: string) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@quantumbets.com',
      to: email,
      subject: 'QuantumBets Subscription Confirmed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #F97316;">Subscription Confirmed</h1>
          <p>Your subscription to the ${tier} plan has been confirmed.</p>
          <p>You'll continue to receive our AI-powered sports betting picks.</p>
          <p>If you have any questions, feel free to reply to this email.</p>
          <p>Best regards,<br>The QuantumBets Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending subscription confirmation email:', error);
    throw error;
  }
};

/**
 * Send betting picks to a subscriber
 */
export const sendPicksEmail = async (email: string, picksHtml: string, title: string = 'Your Daily QuantumBets Picks') => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@quantumbets.com',
      to: email,
      subject: title,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #F97316;">${title}</h1>
          <div>${picksHtml}</div>
          <p>Best of luck with your bets!</p>
          <p>Best regards,<br>The QuantumBets Team</p>
          <p style="font-size: 12px; color: #666;">
            If you wish to unsubscribe or update your preferences, visit your <a href="${process.env.SITE_URL || 'https://quantumbets.com'}/account">account settings</a>.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending picks email:', error);
    throw error;
  }
};

/**
 * Send a cancellation confirmation email
 */
export const sendCancellationEmail = async (email: string) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@quantumbets.com',
      to: email,
      subject: 'QuantumBets Subscription Cancelled',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #F97316;">Subscription Cancelled</h1>
          <p>Your subscription has been cancelled. We're sorry to see you go!</p>
          <p>If you change your mind, you can always sign up again on our website.</p>
          <p>Best regards,<br>The QuantumBets Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    throw error;
  }
};

export default {
  sendWelcomeEmail,
  sendSubscriptionConfirmationEmail,
  sendPicksEmail,
  sendCancellationEmail,
}; 