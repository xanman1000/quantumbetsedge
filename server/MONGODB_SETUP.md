# MongoDB Production Setup for QuantumBets

## Connection Information

Your MongoDB Atlas cluster is already set up with the following connection details:

- **Cluster Name**: QuantumBets
- **Connection String**: `mongodb+srv://xmevans10:<password>@quantumbets.d9aaf.mongodb.net/?retryWrites=true&w=majority&appName=QuantumBets`
- **Username**: xmevans10

## Setup Steps

### 1. Set a Secure Password

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to your QuantumBets cluster
3. Go to "Database Access" in the left sidebar
4. Find the xmevans10 user and click "Edit"
5. Set a strong password and save it securely
6. Update your `.env` file with this password in both the `MONGODB_URI` and `MONGO_PASSWORD` variables

### 2. Configure Network Access

1. In MongoDB Atlas, go to "Network Access" in the left sidebar
2. Add your production server's IP address to the whitelist
   - If your server has a dynamic IP, you can temporarily allow access from anywhere (`0.0.0.0/0`) but this is less secure
   - For better security, use a fixed IP or VPC peering if available

### 3. Create Required Indexes

For optimal performance, create the following indexes in your database:

```javascript
// Subscriber collection indexes
db.subscribers.createIndex({ email: 1 }, { unique: true });
db.subscribers.createIndex({ subscriptionTier: 1 });
db.subscribers.createIndex({ isActive: 1 });

// Content collection indexes
db.content.createIndex({ contentDate: -1 });
db.content.createIndex({ sports: 1 });
db.content.createIndex({ tierAvailability: 1 });
db.content.createIndex({ isPublished: 1 });
```

### 4. Set Up Backups

1. In MongoDB Atlas, go to "Backup" in the left sidebar
2. Configure continuous backups or scheduled snapshots based on your needs
3. Set a retention policy that meets your business requirements

### 5. Security Best Practices

1. Rotate the database password regularly
2. Use MongoDB Atlas's encryption at rest feature
3. Consider setting up VPC peering for improved security
4. Monitor database access logs regularly
5. Set up database alerts for unusual activity

### 6. Performance Monitoring

1. Enable MongoDB Atlas monitoring
2. Set up alerts for high CPU/memory usage
3. Configure slow query logging to identify performance bottlenecks

## Database Schema

Your database has the following main collections:

1. `subscribers` - User subscription information
2. `content` - Newsletter content data
3. `users` - Admin user accounts

## Troubleshooting

If you encounter connection issues:

1. Verify the connection string and password are correct
2. Check that your server's IP is in the whitelist
3. Ensure you're using the correct MongoDB driver version
4. Check Atlas status for any service disruptions 