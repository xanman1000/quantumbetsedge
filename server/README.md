# QuantumBets Edge Server

Backend server for the QuantumBets Edge newsletter system, providing API endpoints for managing subscribers, content, and newsletter delivery.

## Features

- **Subscriber Management**: Add, update, delete, and query subscribers
- **Content Management**: Create, update, and publish newsletter content
- **Newsletter Delivery**: Send newsletters via email and SMS
- **Analytics Tracking**: Track opens, clicks, and other engagement metrics
- **n8n Integration**: Webhook endpoints for n8n workflow automation
- **Authentication & Authorization**: JWT-based auth with admin role support

## Tech Stack

- **Node.js & Express**: Server framework
- **TypeScript**: Type-safe JavaScript
- **MongoDB & Mongoose**: Database and ODM
- **JWT**: Authentication
- **Winston**: Logging
- **Nodemailer**: Email delivery
- **Twilio**: SMS delivery

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- n8n (optional, for workflow automation)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/quantum-bets-edge.git
   cd quantum-bets-edge/server
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Build the project
   ```bash
   npm run build
   ```

5. Start the server
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login`: Login with email and password
- `POST /api/auth/register`: Register a new admin user (restricted)

### Subscribers
- `POST /api/subscribers`: Add a new subscriber
- `GET /api/subscribers`: Get all subscribers (admin)
- `GET /api/subscribers/:id`: Get subscriber by ID (admin)
- `PUT /api/subscribers/:id`: Update subscriber (admin)
- `DELETE /api/subscribers/:id`: Delete subscriber (admin)
- `POST /api/subscribers/unsubscribe`: Unsubscribe a subscriber
- `POST /api/subscribers/verify-email`: Verify subscriber email
- `PUT /api/subscribers/:id/upgrade`: Upgrade subscription tier (admin)

### Content
- `POST /api/content`: Add new content (admin)
- `GET /api/content`: Get all content with filtering (admin)
- `GET /api/content/:id`: Get content by ID
- `PUT /api/content/:id`: Update content (admin)
- `DELETE /api/content/:id`: Delete content (admin)
- `POST /api/content/:id/analytics`: Update content analytics (admin)

### Delivery
- `GET /api/delivery`: Get all deliveries (admin)
- `GET /api/delivery/:id`: Get delivery by ID (admin)
- `POST /api/delivery/:id/retry`: Retry failed delivery (admin)
- `GET /api/delivery/stats`: Get delivery statistics (admin)

### n8n Webhooks
- `POST /api/n8n/webhook/content`: Receive content from n8n workflow

## n8n Integration

This server is designed to work with n8n for workflow automation. See the [N8N_SETUP.md](../N8N_SETUP.md) file for detailed instructions on setting up n8n workflows.

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

## Deployment

For production deployment, we recommend:

1. Set `NODE_ENV=production` in your .env file
2. Ensure all sensitive variables are properly set
3. Use a process manager like PM2
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name quantum-bets-server
   ```

## License

MIT 