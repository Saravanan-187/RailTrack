import pymongo
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection with additional options
MONGODB_URI = os.getenv("MONGODB_URI")

if not MONGODB_URI or not MONGODB_URI.strip():
    raise RuntimeError("MONGODB_URI environment variable is required")

# Create client with connection options
client = pymongo.MongoClient(
    MONGODB_URI,
    serverSelectionTimeoutMS=5000,  # 5 second timeout
    connectTimeoutMS=5000,
    socketTimeoutMS=5000,
    maxPoolSize=50,
    retryWrites=True
)

# Database
db = client["rail_vista_journey"]

# Collections
users_collection = db["users"]
trains_collection = db["trains"]
bookings_collection = db["bookings"]

def get_database():
    return db

def get_users_collection():
    return users_collection

def get_trains_collection():
    return trains_collection

def get_bookings_collection():
    return bookings_collection
