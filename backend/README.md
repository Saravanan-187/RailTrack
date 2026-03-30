# RailTrack Backend

This is the backend API for the RailTrack application, built with Python, FastAPI, and MongoDB Atlas.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)

## Features

- User authentication (signup, login)
- Train management (CRUD operations)
- Booking system
- Search functionality

## Tech Stack

- Python
- FastAPI
- MongoDB Atlas
- Pydantic
- JWT

## Project Structure

```text
backend/
|-- database/           # Database connection
|-- models/             # Data models
|-- routes/             # API routes
|-- utils/              # Utility functions
|-- main.py             # Application entry point
|-- requirements.txt    # Dependencies
|-- .env.example        # Environment variable template
`-- .env                # Local environment variables (not committed)
```

## Setup Instructions

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Configure environment variables:
   Copy `backend/.env.example` to `backend/.env` and update it with your MongoDB Atlas URI and other configuration:
   ```env
   MONGODB_URI=your_mongodb_atlas_uri_here
   SECRET_KEY=your_secret_key_here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   CORS_ORIGINS=http://localhost:5173
   ```

3. Run the application:
   ```bash
   uvicorn main:app --reload
   ```

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

## Database Schema

### Users
```json
{
  "email": "string",
  "full_name": "string",
  "hashed_password": "string"
}
```

### Trains
```json
{
  "train_number": "string",
  "train_name": "string",
  "from_station": {
    "station": "string",
    "code": "string",
    "time": "string"
  },
  "to_station": {
    "station": "string",
    "code": "string",
    "time": "string"
  },
  "duration": "string",
  "classes": [
    {
      "type": "string",
      "price": "string",
      "availability": "string",
      "seats": "integer"
    }
  ],
  "amenities": ["string"],
  "rating": "number",
  "on_time": "integer"
}
```

### Bookings
```json
{
  "train_id": "string",
  "user_id": "string",
  "class_type": "string",
  "passenger_details": "object",
  "total_amount": "number",
  "booking_date": "datetime",
  "booking_reference": "string",
  "status": "string"
}
```
