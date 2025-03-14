import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import morgan from 'morgan';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for demo purposes
// Replace with database in production
const contentStore = [
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

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date()
  });
});

// Content API endpoints
app.get('/api/content', (req, res) => {
  res.json({
    success: true,
    data: contentStore[0] // Return the most recent content by default
  });
});

// Admin API endpoints for content management
app.get('/api/admin/content', (req, res) => {
  res.json({
    success: true,
    data: contentStore
  });
});

app.post('/api/admin/content', (req, res) => {
  const { title, content, summary } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: 'Title and content are required'
    });
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
  
  res.status(201).json({
    success: true,
    message: 'Content created successfully',
    data: newContent
  });
});

app.put('/api/admin/content/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, summary } = req.body;
  
  const contentIndex = contentStore.findIndex(item => item.id === id);
  
  if (contentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Content not found'
    });
  }
  
  // Update content
  contentStore[contentIndex] = {
    ...contentStore[contentIndex],
    title: title || contentStore[contentIndex].title,
    content: content || contentStore[contentIndex].content,
    summary: summary || contentStore[contentIndex].summary,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Content updated successfully',
    data: contentStore[contentIndex]
  });
});

app.delete('/api/admin/content/:id', (req, res) => {
  const { id } = req.params;
  
  const contentIndex = contentStore.findIndex(item => item.id === id);
  
  if (contentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Content not found'
    });
  }
  
  // Remove content
  contentStore.splice(contentIndex, 1);
  
  res.json({
    success: true,
    message: 'Content deleted successfully'
  });
});

// Stripe webhook endpoint
app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const payload = req.body;
  
  // In production, verify the webhook signature
  // const signature = req.headers['stripe-signature'];
  
  try {
    // Process the webhook event
    console.log('Received webhook event');
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// Create checkout session endpoint
app.post('/api/create-checkout-session', async (req, res) => {
  const { priceId, customerEmail } = req.body;
  
  // In production, this would create a real Stripe checkout session
  console.log(`Creating checkout session for price: ${priceId}, email: ${customerEmail}`);
  
  // Return a mock session for now
  res.json({
    sessionId: 'mock_session_' + Date.now(),
    url: 'https://checkout.stripe.com/mock-checkout'
  });
});

// Serve SPA for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 