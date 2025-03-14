# QuantumBets - Standard Operating Procedure & Project Rules

## Project Overview

QuantumBets is an AI-powered sports betting analytics platform that provides users with betting picks and insights via email and SMS. The system operates on a subscription-based model with tiered pricing, offering SMS notifications exclusively to paid tiers.

## Technology Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Shadcn UI components

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- Stripe for payment processing
- Nodemailer for email delivery
- Twilio for SMS messaging

## Project Structure

```
quantum-bets-edge/
├── src/                  # Frontend source code
│   ├── components/       # React components
│   ├── lib/              # Utility functions
│   ├── hooks/            # Custom React hooks
│   └── pages/            # Page components
│
├── server/               # Backend source code
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Database schemas
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utility functions
│   └── dist/             # Compiled JavaScript output
│
├── public/               # Static assets
└── node_modules/         # Dependencies
```

## Standard Operating Procedure (SOP)

### Phase 1: Email Subscription & Stripe Integration

#### 1.1 Backend Setup
- Create Express server with TypeScript configuration
- Set up MongoDB connection
- Implement environment variables with dotenv

#### 1.2 Database Models
- Create Subscriber model with fields for:
  - Contact info (email, phone)
  - Subscription tier
  - Stripe IDs
  - Communication preferences
  - Subscription dates

#### 1.3 Service Layer
- Implement Stripe service for payment processing
- Create email service for notifications
- Develop SMS service for text messaging

#### 1.4 API Controllers
- Create subscription controllers for:
  - Free subscriptions
  - Paid subscriptions via Stripe
  - Subscription management
  - Communication preferences

#### 1.5 Webhook Handling
- Implement Stripe webhook controller
- Handle subscription lifecycle events
- Process payment successes and failures

### Phase 2: SMS Infrastructure Setup

#### 2.1 Frontend Integration
- Update subscription forms to collect phone numbers
- Add SMS consent checkbox for compliance
- Implement redirect to Stripe Checkout
- Create success and failure pages

#### 2.2 SMS Infrastructure
- Configure Twilio integration
- Implement phone number validation
- Develop SMS templates for different tier levels
- Set up SMS sending logic based on tier

#### 2.3 User Preference Management
- Create preference center for communication options
- Implement opt-in/out management
- Add unsubscribe functionality for both channels

### Phase 3: Content Delivery System

#### 3.1 HTML Picks Integration
- Connect to existing HTML pick generation system
- Create templating for email and SMS formats
- Implement scheduling system for delivery

#### 3.2 Automated Distribution
- Set up scheduled jobs for pick distribution
- Implement tier-based content filtering
- Create delivery tracking system

### Phase 4: Admin & Analytics

#### 4.1 Admin Dashboard
- Create subscriber management interface
- Implement content preview and testing
- Add manual distribution controls

#### 4.2 Analytics System
- Implement open/click tracking
- Create conversion analytics
- Set up performance reporting

## Project Rules

### 1. Code Standards

#### 1.1 TypeScript
- Use TypeScript for all new code
- Define proper interfaces for all data structures
- Use enums for predefined values
- Avoid using `any` type except when absolutely necessary

#### 1.2 Naming Conventions
- Use camelCase for variables and functions
- Use PascalCase for classes, interfaces, and React components
- Use ALL_CAPS for constants
- Use kebab-case for file names

#### 1.3 File Organization
- One component per file
- Group related functionality in directories
- Create index files for clean exports

### 2. Development Workflow

#### 2.1 Version Control
- Make atomic commits with clear messages
- Follow conventional commit format
- Create feature branches for new work
- Use pull requests for code review

#### 2.2 Error Handling
- Implement try/catch blocks in all async functions
- Log errors with appropriate context
- Return consistent error responses from API
- Handle frontend errors gracefully with user feedback

#### 2.3 Documentation
- Document all functions with JSDoc comments
- Update README files when adding features
- Document API endpoints with expected request/response formats

### 3. Data & Security Rules

#### 3.1 Database
- Never store sensitive data in plaintext
- Use indexes for frequently queried fields
- Implement schema validation
- Use transactions for multi-document operations

#### 3.2 API Security
- Validate all user inputs
- Implement proper CORS configuration
- Rate-limit API endpoints
- Secure Stripe webhook endpoints with signatures

#### 3.3 Authentication
- Implement proper JWT handling
- Use secure HTTP-only cookies for sessions
- Create middleware for protected routes

### 4. Communication Rules

#### 4.1 Email
- Include unsubscribe link in all emails
- Follow email deliverability best practices
- Use responsive email templates
- Test emails in multiple clients

#### 4.2 SMS
- Include opt-out instructions in all SMS
- Respect quiet hours (no messages between 9PM-9AM local time)
- Keep messages concise and valuable
- Comply with all SMS regulations (TCPA, etc.)

### 5. Stripe Integration Rules

#### 5.1 Subscription Management
- Handle subscription events idempotently
- Implement proper error handling for payment failures
- Store subscription IDs securely
- Validate webhook signatures

#### 5.2 Payment Processing
- Use Stripe Checkout for payments
- Implement trial periods as defined by tier
- Handle cancellations and refunds properly
- Test with Stripe test mode before going live

### 6. Testing Standards

#### 6.1 Backend Testing
- Unit test all services and utilities
- Integration test API endpoints
- Test webhook handling with mock events
- Verify database operations

#### 6.2 Frontend Testing
- Test form validation and submission
- Verify responsive layouts
- Test integration with backend APIs
- Ensure accessibility compliance

### 7. Deployment

#### 7.1 Environment Setup
- Use environment variables for all configuration
- Create separate environments for development, staging, and production
- Configure proper CORS settings for each environment
- Set up proper logging for production

#### 7.2 Monitoring
- Implement health checks for all services
- Set up error monitoring and alerting
- Monitor API performance and response times
- Track usage metrics and analytics

## Communication Channels

- **Email**: Used for detailed picks and comprehensive analysis
- **SMS**: Used for time-sensitive alerts and simplified picks (paid tiers only)

## Integration Points

### Frontend to Backend
- API calls to subscription endpoints
- Stripe Checkout integration
- Success/cancel URL handling

### Backend to External Services
- Stripe API for payment processing
- Twilio API for SMS delivery
- Email service (Nodemailer) for email delivery
- MongoDB for data storage

## Implementation Checklist

### Phase 1 (Completed)
- [x] Backend server structure
- [x] Database models
- [x] Stripe integration
- [x] Email service
- [x] SMS service
- [x] Subscription controllers
- [x] Webhook handling

### Phase 2 (Next Steps)
- [ ] Frontend integration with API
- [ ] Phone number collection and validation
- [ ] SMS infrastructure configuration
- [ ] User preference management
- [ ] Content delivery system

## Appendix

### API Endpoint Documentation

#### Subscription Endpoints
- `POST /api/subscriptions/free` - Create a free subscription
  - Request: `{ email: string }`
  - Response: `{ message: string, data: { email: string, tier: string } }`

- `POST /api/subscriptions/checkout` - Create a checkout session
  - Request: `{ email: string, tier: string, phone?: string }`
  - Response: `{ message: string, data: { sessionId: string, url: string } }`

- `POST /api/subscriptions/cancel` - Cancel a subscription
  - Request: `{ email: string }`
  - Response: `{ message: string }`

- `POST /api/subscriptions/preferences` - Update communication preferences
  - Request: `{ email: string, preferences: { email: boolean, sms: boolean } }`
  - Response: `{ message: string, data: { preferences: { email: boolean, sms: boolean } } }`

#### Webhook Endpoints
- `POST /api/webhook` - Handle Stripe webhook events
  - Header: `stripe-signature: string`
  - Body: Raw Stripe event payload
  - Response: `{ received: boolean }`

### Stripe Products Configuration

| Tier Name | Price ID Env Variable | Description |
|-----------|------------------------|-------------|
| Free      | N/A                    | Limited picks, email only |
| Daily     | STRIPE_DAILY_PRICE_ID  | One-time payment for all picks for one day |
| Weekly    | STRIPE_WEEKLY_PRICE_ID | Weekly subscription with SMS + email |
| Monthly   | STRIPE_MONTHLY_PRICE_ID | Monthly subscription with premium SMS + email | 