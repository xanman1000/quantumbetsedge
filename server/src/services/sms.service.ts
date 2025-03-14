import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Format a betting pick for SMS
 * Takes a long pick and formats it into a concise SMS message
 */
export const formatPickForSms = (pick: any): string => {
  if (!pick) return '';
  
  // Extract the essential information from the pick
  const { sport, team, bet, odds, units, analysis } = pick;
  
  // Create a concise message
  let message = `${sport} PICK: ${team} ${bet} (${odds})`;
  
  // Add units if available
  if (units) {
    message += ` ${units}u`;
  }
  
  // Add a brief reason if available (limited to 50 chars)
  if (analysis) {
    const briefReason = analysis.length > 50 
      ? `${analysis.substring(0, 47)}...` 
      : analysis;
    message += ` - ${briefReason}`;
  }
  
  return message;
};

/**
 * Format multiple picks for SMS
 */
export const formatPicksForSms = (picks: any[]): string => {
  if (!picks || picks.length === 0) return 'No picks available today.';
  
  // Limit to top 3 picks for SMS
  const topPicks = picks.slice(0, 3);
  
  // Format each pick and join them
  const formattedPicks = topPicks.map((pick, index) => {
    return `${index + 1}. ${formatPickForSms(pick)}`;
  }).join('\n\n');
  
  return `QUANTUM PICKS:\n\n${formattedPicks}\n\nFor more details, check your email or visit our website. Reply STOP to unsubscribe.`;
};

/**
 * Send a welcome SMS to a new subscriber
 */
export const sendWelcomeSms = async (phoneNumber: string, tier: string = 'paid') => {
  try {
    if (!phoneNumber) {
      return { success: false, message: 'Phone number is required' };
    }
    
    // Check if it's during quiet hours (9PM-9AM)
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 21 || hour < 9) {
      return { 
        success: false, 
        message: 'SMS not sent during quiet hours (9PM-9AM local time)'
      };
    }
    
    const message = await client.messages.create({
      body: `Welcome to QuantumBets ${tier} plan! You will now receive SMS alerts for our best sports picks. Visit quantumbets.com/account to manage preferences. Reply STOP to unsubscribe.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('Error sending welcome SMS:', error);
    throw error;
  }
};

/**
 * Send a pick via SMS
 */
export const sendPickSms = async (phoneNumber: string, pick: any) => {
  try {
    if (!phoneNumber) {
      return { success: false, message: 'Phone number is required' };
    }
    
    // Check if it's during quiet hours (9PM-9AM)
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 21 || hour < 9) {
      return { 
        success: false, 
        message: 'SMS not sent during quiet hours (9PM-9AM local time)'
      };
    }
    
    // Format pick for SMS
    const formattedPick = typeof pick === 'string' 
      ? pick 
      : formatPickForSms(pick);
    
    const message = await client.messages.create({
      body: `QuantumBets Pick: ${formattedPick} For more info: quantumbets.com/picks Reply STOP to unsubscribe.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('Error sending pick SMS:', error);
    throw error;
  }
};

/**
 * Send multiple picks via SMS
 */
export const sendPicksSms = async (phoneNumber: string, picks: any[] | string) => {
  try {
    if (!phoneNumber) {
      return { success: false, message: 'Phone number is required' };
    }
    
    // Check if it's during quiet hours (9PM-9AM)
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 21 || hour < 9) {
      return { 
        success: false, 
        message: 'SMS not sent during quiet hours (9PM-9AM local time)'
      };
    }
    
    // Format picks for SMS if it's an array, otherwise use the string directly
    const formattedPicks = typeof picks === 'string' ? picks : formatPicksForSms(picks);
    
    const message = await client.messages.create({
      body: formattedPicks,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('Error sending picks SMS:', error);
    throw error;
  }
};

/**
 * Send a subscription confirmation SMS
 */
export const sendSubscriptionConfirmationSms = async (phoneNumber: string, tier: string) => {
  try {
    if (!phoneNumber) {
      return { success: false, message: 'Phone number is required' };
    }
    
    // Check if it's during quiet hours (9PM-9AM)
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 21 || hour < 9) {
      return { 
        success: false, 
        message: 'SMS not sent during quiet hours (9PM-9AM local time)'
      };
    }
    
    const message = await client.messages.create({
      body: `Your QuantumBets ${tier} subscription is confirmed! You'll receive SMS alerts for our top picks. Visit quantumbets.com/account to manage preferences. Reply STOP to unsubscribe.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('Error sending subscription confirmation SMS:', error);
    throw error;
  }
};

/**
 * Send a cancellation confirmation SMS
 */
export const sendCancellationSms = async (phoneNumber: string) => {
  try {
    if (!phoneNumber) {
      return { success: false, message: 'Phone number is required' };
    }
    
    // Check if it's during quiet hours (9PM-9AM)
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 21 || hour < 9) {
      return { 
        success: false, 
        message: 'SMS not sent during quiet hours (9PM-9AM local time)'
      };
    }
    
    const message = await client.messages.create({
      body: 'Your QuantumBets subscription has been cancelled. We hope to see you again soon! Visit quantumbets.com to resubscribe anytime.',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('Error sending cancellation SMS:', error);
    throw error;
  }
};

/**
 * Validate a US phone number
 */
export const validateUSPhoneNumber = (phoneNumber: string): boolean => {
  if (!phoneNumber) return false;
  
  // Remove any non-numeric characters
  const cleanedNumber = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a valid US number (10 digits, optionally with country code 1)
  if (cleanedNumber.length === 10) {
    return true;
  } else if (cleanedNumber.length === 11 && cleanedNumber.charAt(0) === '1') {
    return true;
  }
  
  return false;
};

/**
 * Format a phone number to E.164 format for Twilio
 */
export const formatPhoneNumberForTwilio = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Remove any non-numeric characters
  const cleanedNumber = phoneNumber.replace(/\D/g, '');
  
  // Add US country code if needed
  if (cleanedNumber.length === 10) {
    return `+1${cleanedNumber}`;
  } else if (cleanedNumber.length === 11 && cleanedNumber.charAt(0) === '1') {
    return `+${cleanedNumber}`;
  }
  
  return phoneNumber; // Return original if not recognized
};

export default {
  sendWelcomeSms,
  sendPickSms,
  sendPicksSms,
  sendSubscriptionConfirmationSms,
  sendCancellationSms,
  formatPickForSms,
  formatPicksForSms,
  validateUSPhoneNumber,
  formatPhoneNumberForTwilio,
}; 