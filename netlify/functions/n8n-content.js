// Netlify Function for n8n Content Integration
// This allows n8n workflows to post content via API

// Import content store from admin-content for data consistency
// In production, this would be a database import
const { contentStore } = require('./admin-content');

// API key for n8n integration - in production use environment variables
const API_KEY = "quantum-n8n-api-key-2024";

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
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
    // Parse JSON body
    const { title, content, summary, publishImmediately = true } = JSON.parse(event.body);
    
    // Validate required fields
    if (!title || !content) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Title and content are required"
        })
      };
    }
    
    // Create new content object
    const newContent = {
      id: `nl-${new Date().toISOString().split('T')[0]}`,
      title,
      content,
      summary: summary || '',
      date: new Date().toISOString(),
      source: 'n8n' // Track that this came from n8n
    };
    
    // Add to content store
    if (publishImmediately) {
      // Add to beginning of array (most recent first)
      contentStore.unshift(newContent);
      
      return {
        statusCode: 201,
        body: JSON.stringify({
          success: true,
          message: "Content published successfully",
          data: newContent
        })
      };
    } else {
      // In a real system, you might save as draft here
      return {
        statusCode: 201,
        body: JSON.stringify({
          success: true,
          message: "Content saved as draft",
          data: newContent
        })
      };
    }
  } catch (error) {
    console.error("Error processing n8n content request:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Server Error", 
        message: error.message 
      })
    };
  }
}; 