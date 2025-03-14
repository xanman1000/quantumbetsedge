# QuantumBets n8n Integration Guide

This guide explains how to integrate your n8n workflow with the QuantumBets Content Delivery System.

## Prerequisites

- n8n instance up and running
- QuantumBets API running and accessible
- API key configured in your environment variables

## Integration Steps

### 1. Configure Environment Variables

Make sure your QuantumBets server has the following environment variables set:

```
N8N_API_KEY=your_secure_api_key
API_URL=http://your-api-url
SITE_URL=http://your-frontend-url
```

### 2. Create the Content Reception Workflow

1. In your existing n8n workflow that generates HTML content, add an **HTTP Request** node after your HTML generation step.

2. Configure the HTTP Request node as follows:
   - **Method**: POST
   - **URL**: `{{$env.QUANTUMBETS_API_URL}}/api/content/receive`
   - **Headers**:
     - Key: `x-api-key`
     - Value: `{{$env.QUANTUMBETS_API_KEY}}`
   - **Body Content Type**: JSON
   - **JSON Body**:
     ```json
     {
       "htmlContent": "{{$node['HTML_Generation_Node'].data.html}}",
       "title": "Picks for {{$formatDate($now, 'YYYY-MM-DD')}}",
       "contentDate": "{{$now}}"
     }
     ```
   - Replace `HTML_Generation_Node` with the name of your node that generates the HTML content.

3. Add a **Wait** node after the HTTP Request node to pause for a few seconds before triggering distribution.

### 3. Create the Distribution Trigger

1. Add another **HTTP Request** node after the Wait node.

2. Configure this HTTP Request node as follows:
   - **Method**: POST
   - **URL**: `{{$env.QUANTUMBETS_API_URL}}/api/content/distribute`
   - **Headers**:
     - Key: `x-api-key`
     - Value: `{{$env.QUANTUMBETS_API_KEY}}`
   - **Body Content Type**: JSON
   - **JSON Body**:
     ```json
     {}
     ```
   - This will use the latest content for distribution.

### 4. Add Error Handling

1. Add an **IF** node to check if the content reception was successful.
   - Condition: `{{$node['HTTP Request'].json.success}} == true`

2. Connect the success path to the Wait node and then to the distribution HTTP Request.

3. For the failure path, add a **Send Email** or **Slack** node to notify you of the failure.

## Example Workflow

```
[HTML Generation] → [HTTP Request: Receive Content] → [IF] → [Wait] → [HTTP Request: Distribute]
                                                      ↓
                                                  [Send Error Notification]
```

## Testing the Integration

1. Run your workflow manually first to ensure everything is working correctly.

2. Check the QuantumBets database to verify that content is being stored.

3. Verify that emails and SMS messages are being sent to subscribers.

## Scheduling

Configure your n8n workflow to run automatically at 6:00 AM MST every day:

1. In n8n, go to your workflow settings.

2. Enable the **Active** toggle.

3. Set the **Trigger** to **Schedule**.

4. Configure the schedule using cron syntax: `0 6 * * *` (for 6:00 AM server time).

5. If your server is not in MST, adjust the cron schedule accordingly.

## Troubleshooting

- **Content not being received**: Check the API key and URL in your HTTP Request node.

- **Distribution not working**: Verify that the content was successfully received and stored in the database.

- **Emails/SMS not being sent**: Check the email and SMS service configurations in your QuantumBets server.

## Security Considerations

- Keep your API key secure and never expose it in client-side code.

- Use HTTPS for all API requests in production.

- Regularly rotate your API key for enhanced security.

## Additional Features

### Retry Failed Deliveries

To retry failed deliveries, add another HTTP Request node:

- **Method**: POST
- **URL**: `{{$env.QUANTUMBETS_API_URL}}/api/content/retry`
- **Headers**:
  - Key: `x-api-key`
  - Value: `{{$env.QUANTUMBETS_API_KEY}}`
- **Body Content Type**: JSON
- **JSON Body**:
  ```json
  {
    "maxRetries": 3
  }
  ```

This can be scheduled to run a few hours after the initial distribution to catch any failed deliveries. 