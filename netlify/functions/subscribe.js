// Netlify Function for email subscriptions
// In production, connect this to a database and email service

// Simple in-memory store for demo purposes
const subscribers = [];

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const { email } = JSON.parse(event.body);
    
    // Validate email
    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Invalid email address"
        })
      };
    }
    
    // Check if email already exists
    if (subscribers.includes(email)) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: "You're already subscribed!",
          alreadySubscribed: true
        })
      };
    }
    
    // Add email to subscribers list
    subscribers.push(email);
    
    // In production, you would:
    // 1. Store the email in a database
    // 2. Send a welcome email
    // 3. Add to your email marketing platform (Mailchimp, ConvertKit, etc.)
    // 4. Trigger a webhook to n8n for automation

    console.log(`New subscriber: ${email}`);
    
    // For n8n integration, you could use webhook URLs like:
    // const n8nWebhookUrl = 'https://your-n8n-instance.com/webhook/quantum-subscribe';
    // await axios.post(n8nWebhookUrl, { email, source: 'website' });
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Subscription successful"
      })
    };
  } catch (error) {
    console.error("Error processing subscription:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Server Error", 
        message: error.message 
      })
    };
  }
};

// Export the subscribers array for use in other functions
exports.subscribers = subscribers; 