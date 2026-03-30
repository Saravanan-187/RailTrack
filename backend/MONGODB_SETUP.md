# MongoDB Setup Instructions

## Prerequisites

1. MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
2. Python 3.8+ installed
3. pip package manager

## Step 1: Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Create a new cluster (M0 Sandbox free tier is sufficient for development)
3. In the cluster dashboard, click "Connect"
4. Choose "Connect your application"
5. Copy the connection string (it will look like):
   ```
   mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your actual database user credentials
7. Replace the database name in the URI with `rail_vista_journey`

## Step 2: Configure Environment Variables

Update the [.env](file:///c:/Users/Saravanan/Desktop/rail-vista-journey-main/backend/.env) file in the backend directory with your actual values:

```env
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.example.mongodb.net/rail_vista_journey?retryWrites=true&w=majority
SECRET_KEY=your_strong_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Step 3: Install Dependencies

Navigate to the backend directory and install the required packages:

```bash
cd backend
pip install -r requirements.txt
```

## Step 4: Test the Connection

Start the backend server to test the MongoDB connection:

```bash
cd backend
python main.py
```

Or using uvicorn directly:

```bash
cd backend
uvicorn main:app --reload
```

## Step 5: Verify Database Operations

You can verify that MongoDB is working correctly by:

1. Making API calls to the endpoints:
   - POST `/api/auth/signup` to create a new user
   - POST `/api/auth/login` to login
   - POST `/api/trains/` to create a new train
   - GET `/api/trains/` to retrieve all trains

2. Checking your MongoDB Atlas cluster to see if collections are being created:
   - `users` collection
   - `trains` collection
   - `bookings` collection

## Troubleshooting

### Common Issues:

1. **Connection failed**: 
   - Ensure your IP address is whitelisted in MongoDB Atlas
   - Check that your username and password are correct
   - Verify the cluster name in the connection string

2. **Authentication failed**:
   - Make sure you've created a database user in MongoDB Atlas
   - Ensure the user has read/write permissions

3. **Network issues**:
   - Check your internet connection
   - Ensure firewall isn't blocking the connection

### Whitelisting IP Address:

1. In MongoDB Atlas, go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development, you can add your current IP or allow access from anywhere (0.0.0.0/0) - NOT recommended for production

### Creating Database User:

1. In MongoDB Atlas, go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" as the authentication method
4. Enter a username and password
5. Select "Read and write to any database" for user privileges
6. Click "Add User"