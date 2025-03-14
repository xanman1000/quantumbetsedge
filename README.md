# QuantumBets Newsletter System with n8n Integration

A modern newsletter system for QuantumBets, featuring n8n workflow integration for automated content management and distribution.

## Features

- **Content Management**: Create, edit, publish, and archive newsletter content
- **Subscriber Management**: Manage subscribers, tiers, and preferences
- **Automated Workflows**: n8n integration for workflow automation
- **Multi-channel Distribution**: Email and SMS delivery
- **Analytics**: Track opens, clicks, and engagement

## Tech Stack

- **Frontend**: React.js with TypeScript
- **Backend**: Node.js with Express and TypeScript
- **Database**: MongoDB
- **Automation**: n8n workflows
- **Authentication**: JWT-based auth
- **Email Delivery**: Configurable email service
- **SMS Delivery**: Twilio integration

## Prerequisites

- Node.js 16.x or higher
- MongoDB
- n8n instance (self-hosted or cloud)

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/quantum-bets-newsletter.git
   cd quantum-bets-newsletter
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` in both the root and server directories
   - Update the variables with your specific configuration

### Development

1. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend in a new terminal
   cd ../
   npm run dev
   ```

2. Access the application:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:5000

## n8n Integration

The system includes pre-built n8n workflows to automate:

- Newsletter content distribution
- Subscriber management
- Analytics tracking
- Content scheduling

See the [n8n Workflow Guide](./docs/n8n-workflow-guide.md) for detailed setup instructions.

## API Documentation

The API documentation is available at `/api-docs` when running the server locally. It includes all endpoints, expected request formats, and response schemas.

### Key API Endpoints

- **Authentication**: `/api/auth/*`
- **Content Management**: `/api/content/*`
- **Subscriber Management**: `/api/subscribers/*`
- **User Management**: `/api/users/*`

## Deployment

### Backend Deployment

1. Build the production backend:
   ```bash
   cd server
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### Frontend Deployment

1. Build the production frontend:
   ```bash
   npm run build
   ```

2. Deploy the `dist` directory to your web server

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

[MIT License](LICENSE)

## Support

For support, contact support@quantumbets.com
