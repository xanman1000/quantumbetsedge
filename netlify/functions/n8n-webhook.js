// Netlify Function for n8n webhook integration
// This allows n8n to receive notifications about new subscribers

// API key for n8n integration - in production use environment variables
const API_KEY = "quantum-n8n-api-key-2024";

// Import subscribers list from subscribe.js (in production, use a database)
const { subscribers } = require('./subscribe');

exports.handler = async function(event, context) {
  // Support for both GET and POST requests
  if (event.httpMethod !== "GET" && event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  // Check API key authentication (from header)
  const apiKey = event.headers['x-api-key'] || event.headers['X-Api-Key'];
  if (!apiKey || apiKey !== API_KEY) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized: Invalid API key" })
    };
  }

  try {
    // GET request to retrieve all subscribers
    if (event.httpMethod === "GET") {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          count: subscribers.length,
          data: subscribers
        })
      };
    }
    
    // POST request for actions
    if (event.httpMethod === "POST") {
      const { action, email } = JSON.parse(event.body);
      
      // Handle different actions
      switch (action) {
        case 'check_subscription':
          // Check if a specific email is subscribed
          if (!email) {
            return {
              statusCode: 400,
              body: JSON.stringify({
                success: false,
                message: "Email is required for this action"
              })
            };
          }
          
          return {
            statusCode: 200,
            body: JSON.stringify({
              success: true,
              isSubscribed: subscribers.includes(email)
            })
          };
          
        case 'get_count':
          // Just get the count of subscribers
          return {
            statusCode: 200,
            body: JSON.stringify({
              success: true,
              count: subscribers.length
            })
          };
        
        default:
          return {
            statusCode: 400,
            body: JSON.stringify({
              success: false,
              message: "Unknown action"
            })
          };
      }
    }
  } catch (error) {
    console.error("Error processing n8n webhook request:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Server Error", 
        message: error.message 
      })
    };
  }
}; 