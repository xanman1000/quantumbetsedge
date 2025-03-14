# Setting Up Twilio for SMS Messaging

This guide will help you set up Twilio for SMS messaging in the QuantumBets application.

## Prerequisites

- A Twilio account (you can sign up for a free trial at [twilio.com](https://www.twilio.com/))
- A Twilio phone number capable of sending SMS messages

## Step 1: Create a Twilio Account

1. Go to [twilio.com](https://www.twilio.com/) and sign up for an account
2. Verify your email address and phone number
3. Complete the account setup process

## Step 2: Get a Twilio Phone Number

1. In your Twilio dashboard, navigate to "Phone Numbers" > "Manage" > "Active Numbers"
2. Click "Buy a Number" or use the trial number provided by Twilio
3. Ensure the number has SMS capabilities enabled

## Step 3: Get Your Twilio Credentials

1. In your Twilio dashboard, find your Account SID and Auth Token
2. These are located on the main dashboard page or under "Account" > "API Keys & Tokens"

## Step 4: Configure Environment Variables

1. Copy the `.env.example` file to `.env` if you haven't already
2. Update the following variables in your `.env` file:

```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

Replace the placeholder values with your actual Twilio credentials.

## Step 5: Test SMS Functionality

1. Start your server
2. Use the API endpoint to send a test SMS message
3. Verify that the message is received on your phone

## Important Notes

- Twilio trial accounts have limitations on which numbers you can send SMS to
- For production, you'll need to upgrade to a paid Twilio account
- Ensure you comply with SMS regulations (TCPA, etc.) when sending messages
- The application enforces quiet hours (no SMS between 9PM-9AM local time)
- Only US phone numbers are supported in the current implementation

## Troubleshooting

- If SMS messages aren't being sent, check your Twilio dashboard for error logs
- Verify that your phone number is in the correct format (+1XXXXXXXXXX for US numbers)
- Ensure your Twilio account has sufficient credits for sending SMS messages

## Additional Resources

- [Twilio SMS Documentation](https://www.twilio.com/docs/sms)
- [Twilio Node.js SDK Documentation](https://www.twilio.com/docs/libraries/node)
- [SMS Compliance Guidelines](https://www.twilio.com/docs/sms/industry-regulations) 