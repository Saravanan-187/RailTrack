# Backend Setup Guide

This guide will help you set up and run the RailTrack backend.

## Prerequisites

1. Python 3.8 or higher
2. MongoDB Atlas account (free tier is sufficient)
3. Node.js and npm (for frontend development)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd rail-vista-journey-main
```

### 2. Set up Python Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 4. Configure MongoDB Atlas

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Create a database user with read/write permissions
4. Add your IP address to the IP whitelist (or allow access from anywhere for development)
5. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

### 5. Configure Environment Variables

Edit the `.env` file in the backend directory:

```env
MONGODB_URI=your_mongodb_atlas_connection_string_here
SECRET_KEY=your_random_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Replace `your_mongodb_atlas_connection_string_here` with your actual MongoDB connection string. Update the username and password in the connection string with your database user credentials.

For the `SECRET_KEY`, you can generate a random string or use a tool like:

```bash
# Generate a random secret key
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 6. Initialize Sample Data (Optional)

```bash
python init_db.py
```

### 7. Run the Backend Server

```bash
uvicorn main:app --reload
```

The backend will be available at `http://localhost:8000`

### 8. Test the API

You can test the API using the provided test script:

```bash
python test_api.py
```

Or use tools like Postman or curl to interact with the API endpoints.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Trains
- `POST /api/trains/` - Create a new train
- `GET /api/trains/` - Get all trains
- `GET /api/trains/{id}` - Get a specific train
- `PUT /api/trains/{id}` - Update a train
- `DELETE /api/trains/{id}` - Delete a train
- `POST /api/trains/search` - Search trains

### Bookings
- `POST /api/bookings/` - Create a new booking
- `GET /api/bookings/{id}` - Get a specific booking
- `GET /api/bookings/user/{user_id}` - Get all bookings for a user
- `PUT /api/bookings/{id}` - Update a booking
- `DELETE /api/bookings/{id}` - Cancel a booking

## Frontend Integration

The frontend is already configured to work with the backend. Make sure the backend is running on `http://localhost:8000` and the frontend is configured to make requests to this URL.

## Troubleshooting

### Common Issues

1. **Connection refused**: Make sure the backend server is running
2. **CORS errors**: Check that the frontend URL is in the CORS origins list in `main.py`
3. **MongoDB connection errors**: 
   - Verify your MongoDB Atlas connection string
   - Check that your IP is whitelisted
   - Ensure your database user has proper permissions

### MongoDB Atlas Connection Issues

If you're having trouble connecting to MongoDB Atlas:

1. Double-check your connection string format:
   ```
   mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
   ```

2. Make sure you've replaced `<username>` and `<password>` with your actual database credentials

3. Ensure your IP address is whitelisted in the MongoDB Atlas dashboard

## Development

### Adding New Features

1. Create new models in the `models/` directory
2. Add new routes in the `routes/` directory
3. Update the main application in `main.py` to include new routes
4. Update the README.md documentation

### Code Structure

- `main.py`: Application entry point
- `database/`: Database connection and configuration
- `models/`: Data models and validation schemas
- `routes/`: API route handlers
- `utils/`: Utility functions (security, helpers, etc.)
- `init_db.py`: Script to initialize sample data
- `test_api.py`: Simple API testing script

## Security Considerations

1. Never commit sensitive information like passwords or API keys to version control
2. Use environment variables for configuration
3. Regularly rotate secrets and API keys
4. Implement proper input validation and sanitization
5. Use HTTPS in production
6. Implement rate limiting for API endpoints

## Deployment

For production deployment, consider:

1. Using a production WSGI server like Gunicorn
2. Setting up proper logging
3. Configuring environment-specific settings
4. Using a reverse proxy like Nginx
5. Setting up SSL certificates
6. Implementing monitoring and alerting

## Support

For issues with setup or development, please check the documentation or open an issue in the repository.