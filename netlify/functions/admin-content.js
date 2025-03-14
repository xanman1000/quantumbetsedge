// Netlify Function for Admin Content Management
// In-memory store for demo purposes
// In production, use a proper database
let contentStore = [
  {
    id: 'nl-2023-11-10',
    title: 'QuantumBets Edge: Week 10 NFL Insights',
    date: '2023-11-10T08:00:00Z',
    summary: 'Our proprietary algorithm has identified high-value opportunities in this week\'s NFL matchups.',
    content: `
      <h2>Week 10 NFL Analysis</h2>
      <p>Welcome to your QuantumBets Edge newsletter. Our AI has analyzed thousands of data points to identify the highest probability outcomes for this weekend's games.</p>
      <h3>Top Picks This Week:</h3>
      <ul>
        <li>Kansas City Chiefs -7.5 (85% confidence)</li>
        <li>Dallas Cowboys ML (72% confidence)</li>
        <li>Buffalo Bills/Denver Broncos Under 49.5 (78% confidence)</li>
      </ul>
      <p>For full analysis and additional picks, check your premium dashboard.</p>
    `
  }
];

exports.handler = async function(event, context) {
  // Simple auth check - in production use proper JWT validation
  const token = event.headers.authorization;
  if (!token || !token.startsWith("Bearer demo-token-")) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" })
    };
  }

  // GET request to list all content
  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: contentStore
      })
    };
  }

  // POST request to create new content
  if (event.httpMethod === "POST") {
    try {
      const { title, content, summary } = JSON.parse(event.body);
      
      if (!title || !content) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            message: "Title and content are required"
          })
        };
      }
      
      const newContent = {
        id: `nl-${new Date().toISOString().split('T')[0]}`,
        title,
        content,
        summary: summary || '',
        date: new Date().toISOString()
      };
      
      // Add to the beginning of the array (most recent first)
      contentStore.unshift(newContent);
      
      return {
        statusCode: 201,
        body: JSON.stringify({
          success: true,
          message: "Content created successfully",
          data: newContent
        })
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server Error", message: error.message })
      };
    }
  }

  // Default response for unsupported methods
  return {
    statusCode: 405,
    body: JSON.stringify({ error: "Method Not Allowed" })
  };
}; 