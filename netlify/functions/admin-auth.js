// Netlify Function for Admin Authentication
exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const { username, password } = JSON.parse(event.body);

    // Simple authentication for demo
    // In production, use a proper auth system
    if (username === "admin" && password === "quantum2023") {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: "Authentication successful",
          token: "demo-token-" + Date.now(), // Not secure, just for demo
          user: { username: "admin", role: "admin" }
        })
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({
          success: false,
          message: "Invalid username or password"
        })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server Error", message: error.message })
    };
  }
}; 