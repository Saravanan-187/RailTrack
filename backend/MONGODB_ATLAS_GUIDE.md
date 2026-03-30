# Complete MongoDB Atlas Setup Guide

This guide will walk you through setting up MongoDB Atlas for the RailTrack application.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create a Free Cluster

1. After logging in, click "Build a Database"
2. Select the **FREE** tier (M0 Sandbox)
3. Choose a cloud provider and region closest to you
4. Give your cluster a name (e.g., "RailTrack")
5. Click "Create Cluster"

## Step 3: Configure Database Access

1. In the left sidebar, click "Database Access" under the Security section
2. Click "Add New Database User"
3. Fill in the form:
   - Username: `railuser` (or any username you prefer)
   - Password: Create a strong password
   - Database User Privileges: Select "Atlas admin" or "Read and write to any database"
4. Click "Add User"

## Step 4: Configure Network Access

1. In the left sidebar, click "Network Access" under the Security section
2. Click "Add IP Address"
3. For development, you can:
   - Click "Add Current IP Address" to add your current IP
   - Or click "Allow Access from Anywhere" (0.0.0.0/0) - NOT recommended for production
4. Click "Confirm"

## Step 5: Get Connection String

1. Click "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Copy the connection string

The connection string will look like this:
```
mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/?retryWrites=true&w=majority
```

## Step 6: Update Your .env File

Replace the placeholder values in `backend/.env`:

```env
# Replace with your actual MongoDB connection string
MONGODB_URI=mongodb+srv://<db_username>:<db_password>@<cluster-host>/rail_vista_journey?retryWrites=true&w=majority

# Create a strong secret key for JWT tokens
SECRET_KEY=<generate-a-long-random-secret>

ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Template Configuration:

Your `backend/.env` file should look like:

```env
MONGODB_URI=mongodb+srv://<db_username>:<db_password>@<cluster-host>/rail_vista_journey?retryWrites=true&w=majority
SECRET_KEY=<generate-a-long-random-secret>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Step 7: Test the Connection

Run the test script to verify your configuration:

```bash
cd backend
python test_mongodb.py
```

## Common Issues and Solutions

### 1. "The DNS query name does not exist"
- Make sure you've replaced `cluster0.example.mongodb.net` with your actual cluster URL
- Check that you've created the cluster in MongoDB Atlas

### 2. "Authentication failed"
- Verify your username and password are correct
- Make sure the database user has proper permissions

### 3. "IP address not whitelisted"
- Add your current IP address to the Network Access list in MongoDB Atlas
- For development, you can temporarily allow access from anywhere (0.0.0.0/0)

### 4. "Server selection timeout"
- Check your internet connection
- Ensure no firewall is blocking the connection

## Security Best Practices

1. **Never commit credentials to version control**
   - The `backend/.env` file is in `.gitignore` to prevent accidental commits

2. **Use strong passwords**
   - Generate complex passwords for your database users

3. **Limit IP access**
   - Only whitelist necessary IP addresses in production

4. **Regularly rotate credentials**
   - Change passwords periodically

## Next Steps

After successfully configuring MongoDB Atlas:

1. Run the backend server:
   ```bash
   cd backend
   python main.py
   ```

2. Or start with uvicorn:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

3. Test the API endpoints:
   - POST `/api/auth/signup` to create a new user
   - POST `/api/auth/login` to authenticate
   - POST `/api/trains/` to add train data
   - GET `/api/trains/` to retrieve train data
