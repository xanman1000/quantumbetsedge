# N8n Workflow Guide for QuantumBets Newsletter System

This guide explains how to set up n8n workflows to integrate with the QuantumBets API for newsletter management, subscriber management, and content distribution.

## Prerequisites

1. n8n installed and running (via Docker, npm, or hosted service)
2. QuantumBets API running and accessible
3. API access credentials

## Authentication

All protected API endpoints require JWT authentication. In n8n, you'll need to set up an HTTP Request node to authenticate and then use the token in subsequent requests:

1. Add an HTTP Request node
2. Configure it with:
   - Method: POST
   - URL: `https://your-api-url.com/api/auth/login`
   - Body type: JSON
   - Body: 
     ```json
     {
       "email": "your-admin@example.com",
       "password": "your-password"
     }
     ```
3. Add a Set node to extract and store the token:
   - Add a field named `token`
   - Set value to: `{{ $json.data.token }}`

## Workflow Examples

### 1. Scheduled Newsletter Dispatch

This workflow will check for published newsletters and send them to subscribers based on their tier.

#### Trigger: Schedule (e.g., daily at 9 AM)

1. **HTTP Request**: Get Authentication Token
2. **HTTP Request**: Get Published Content
   - Method: GET
   - URL: `https://your-api-url.com/api/content`
   - Query Parameters:
     - type: newsletter
     - status: published
   - Headers:
     - Authorization: Bearer {{ $node["Auth Request"].json.data.token }}

3. **IF** node: Check if there's new content
   - Condition: `{{ $node["Get Published Content"].json.data.length > 0 }}`

4. **HTTP Request**: Get Subscribers
   - Method: GET
   - URL: `https://your-api-url.com/api/subscribers`
   - Headers:
     - Authorization: Bearer {{ $node["Auth Request"].json.data.token }}

5. **Loop** over each newsletter content:
   - **Loop** over each subscriber:
     - **IF** node: Check if subscriber tier matches content tier
     - **Send Email** node: Send email to subscriber
     - **Send SMS** node (optional): Send SMS notification if subscriber has opted in

### 2. New Subscriber Workflow

This workflow handles new subscriber registration, welcome emails, and email verification.

#### Trigger: Webhook (receives new subscriber data)

1. **HTTP Request**: Add Subscriber
   - Method: POST
   - URL: `https://your-api-url.com/api/subscribers`
   - Body: Data from webhook
   - Headers:
     - Authorization: Bearer {{ $node["Auth Request"].json.data.token }}

2. **Send Email** node: Send Welcome Email with verification link

3. **Wait** node: Wait for verification (e.g., 7 days)

4. **HTTP Request**: Check if subscriber verified
   - Method: GET
   - URL: `https://your-api-url.com/api/subscribers/{{ $node["Add Subscriber"].json.data._id }}`

5. **IF** node: If not verified
   - **Send Email** node: Send reminder email

### 3. Content Creation Workflow

This workflow can help with automating content creation and scheduling.

#### Trigger: Manual, Form Trigger, or External System

1. **HTTP Request**: Create Content Draft
   - Method: POST
   - URL: `https://your-api-url.com/api/content`
   - Body: Content data
   - Headers:
     - Authorization: Bearer {{ $node["Auth Request"].json.data.token }}

2. **Set** node: Store content ID

3. **Wait** node: Wait until scheduled publish date

4. **HTTP Request**: Publish Content
   - Method: PUT
   - URL: `https://your-api-url.com/api/content/{{ $node["Create Content"].json.data._id }}/publish`
   - Headers:
     - Authorization: Bearer {{ $node["Auth Request"].json.data.token }}

## Integration with External Services

### Twitter/X Integration

1. Use the Twitter node to post when new content is published
2. Extract a summary from your newsletter content
3. Include a link back to your site

### SMS Delivery via Twilio

1. Use the Twilio node to send SMS notifications
2. Filter subscribers who have opted in for SMS
3. Format your message to fit SMS length constraints

### Analytics Integration

1. After sending emails, collect open and click data
2. Use HTTP Request nodes to update content analytics
3. Generate reports using n8n's Google Sheets integration

## Best Practices

1. Use error handling in your workflows
2. Implement rate limiting for API requests
3. Store sensitive data (API keys, tokens) in n8n credentials
4. Use the n8n built-in error workflow to get notified of failures
5. Test workflows with a small subset of users before full deployment

## Troubleshooting

- **Authentication Issues**: Check that your credentials are correct and the token is being passed correctly
- **API Connection Errors**: Verify API URL and ensure the server is running
- **Data Format Problems**: Check that your JSON structure matches what the API expects
- **Workflow Execution Issues**: Enable workflow execution logs in n8n for detailed debugging

## Additional Resources

- [n8n Documentation](https://docs.n8n.io/)
- QuantumBets API Documentation
- Contact support@quantumbets.com for API assistance 