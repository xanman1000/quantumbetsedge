# n8n Setup Guide for QuantumBets Newsletter System

This guide will help you set up and configure the n8n workflows needed for the QuantumBets newsletter system.

## Installation & Setup

1. **Install n8n**
   
   ```bash
   # Using npm
   npm install n8n -g
   
   # Or using Docker
   docker run -it --rm \
     --name n8n \
     -p 5678:5678 \
     -v ~/.n8n:/home/node/.n8n \
     n8nio/n8n
   ```

2. **Set Environment Variables**

   Create a `.env` file in your n8n installation directory:

   ```
   N8N_ENCRYPTION_KEY=your-secure-encryption-key
   N8N_PORT=5678
   N8N_PROTOCOL=https
   N8N_HOST=your-n8n-domain.com
   ```

3. **Start n8n**

   ```bash
   n8n start
   ```

## Required Workflows

You'll need to create three main workflows:

### 1. Content Creation Workflow

This workflow processes and formats newsletter content, then sends it to your API.

**Trigger Node**: 
- Manual trigger or Schedule trigger (e.g., every weekday at 9 AM)

**Nodes to Add**:
1. **HTTP Request** (to fetch raw content from a CMS or other source)
2. **Function** (to format content)
   ```javascript
   return {
     json: {
       title: `Betting Picks for ${new Date().toLocaleDateString()}`,
       htmlContent: items[0].json.content,
       contentDate: new Date().toISOString(),
       sports: ["NFL", "NBA", "MLB", "NHL"],
       tierAvailability: ["FREE", "DAILY", "WEEKLY", "MONTHLY"],
       isPublished: false
     }
   };
   ```
3. **HTTP Request** (to send to your API)
   - Method: POST
   - URL: `https://yourdomain.com/api/n8n/webhook/content`
   - Headers: 
     ```
     Content-Type: application/json
     x-webhook-secret: {{$env.N8N_WEBHOOK_SECRET}}
     ```

### 2. Newsletter Distribution Workflow

This workflow handles sending the newsletter to subscribers.

**Trigger Node**:
- **Webhook** (to receive distribution requests from your API)
  - Method: POST
  - Path: `/newsletter-distribution`
  - Authentication: Header `x-webhook-secret`

**Nodes to Add**:
1. **HTTP Request** (to fetch content by ID)
   - URL: `https://yourdomain.com/api/content/{{$json.body.contentId}}`
   - Headers: `Authorization: Bearer {{$env.API_TOKEN}}`

2. **HTTP Request** (to fetch subscribers)
   - URL: `https://yourdomain.com/api/subscribers?isActive=true`
   - Headers: `Authorization: Bearer {{$env.API_TOKEN}}`

3. **Split In Batches** (to process subscribers in batches of 50)

4. **Function** (to filter subscribers by tier)
   ```javascript
   return {
     json: {
       subscribers: $input.item.json.filter(sub => 
         sub.subscriptionTier === 'WEEKLY' || sub.subscriptionTier === 'MONTHLY'
       ),
       content: $node["HTTP Request"].json.data
     }
   };
   ```

5. **Loop** (over each subscriber)

6. **SendGrid** (or your email provider)
   - To: `{{$json.email}}`
   - Subject: `{{$node["HTTP Request"].json.data.title}}`
   - Content: HTML template with newsletter content

7. **Twilio** (for SMS notifications, if applicable)
   - To: `{{$json.phone}}`
   - Body: Short version of newsletter

8. **HTTP Request** (to update analytics)
   - Method: POST
   - URL: `https://yourdomain.com/api/content/analytics`
   - Body: `{ "contentId": "{{$node["HTTP Request"].json.data._id}}", "eventType": "sent" }`

### 3. Test Newsletter Workflow

This workflow sends a test newsletter to a specific email address.

**Trigger Node**:
- **Webhook** (to receive test requests)
  - Method: POST
  - Path: `/send-test-newsletter`
  - Authentication: Header `x-webhook-secret`

**Nodes to Add**:
1. **HTTP Request** (to fetch content by ID)
   - URL: `https://yourdomain.com/api/content/{{$json.body.contentId}}`
   - Headers: `Authorization: Bearer {{$env.API_TOKEN}}`

2. **SendGrid** (or your email provider)
   - To: `{{$json.body.email}}`
   - Subject: `[TEST] {{$node["HTTP Request"].json.data.title}}`
   - Content: HTML template with newsletter content

## Credentials Setup

You'll need to configure the following credential sets in n8n:

1. **HTTP Basic Auth** for your API
2. **SendGrid API** for email delivery
3. **Twilio API** for SMS (if applicable)

## Webhook Configuration

The API endpoints from your application that should be configured:

1. **Content Reception Endpoint**:
   - URL: `https://yourdomain.com/api/n8n/webhook/content`
   - Method: POST
   - Headers: `x-webhook-secret: your-secret-here`

2. **Distribution Webhook**:
   - n8n URL: `https://your-n8n-domain.com/webhook/newsletter-distribution`
   - Add to your API at `triggerNewsletterDistribution` function

3. **Test Newsletter Webhook**:
   - n8n URL: `https://your-n8n-domain.com/webhook/send-test-newsletter`
   - Add to your API at `sendTestNewsletter` function

## Production Best Practices

1. **Enable Encryption**:
   Set a strong `N8N_ENCRYPTION_KEY` to protect credentials

2. **Use HTTPS**:
   Configure SSL for your n8n instance

3. **Set Up Authentication**:
   Configure n8n user authentication

4. **Regular Backups**:
   Export your workflows regularly

5. **Error Handling**:
   Add error nodes to each workflow to handle failures

6. **Monitoring**:
   Set up monitoring for your n8n instance

7. **Rate Limiting**:
   Add delays between email sends to avoid rate limits

## Testing Your Workflows

1. Test the content creation workflow by manually triggering it
2. Test the test newsletter workflow by sending to your own email
3. Test the distribution workflow with a small subset of subscribers

## Troubleshooting

- Check execution logs in n8n UI
- Verify credentials are valid
- Ensure webhook secrets match between n8n and your API
- Check API responses in the execution data

---

For more help, refer to the official [n8n documentation](https://docs.n8n.io/). 