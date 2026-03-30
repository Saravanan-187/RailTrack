import os
import sys
from dotenv import load_dotenv
import pymongo
from datetime import datetime
from utils.security import get_password_hash

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def create_test_user():
    """Create a test user with known credentials"""
    try:
        # Load environment variables
        load_dotenv()
        mongodb_uri = os.getenv("MONGODB_URI")
        print(f"MongoDB URI: {mongodb_uri}")
        
        # Connect to MongoDB
        client = pymongo.MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        print("✅ MongoDB connection successful")
        
        # Access database
        db = client["rail_vista_journey"]
        print(f"✅ Database 'rail_vista_journey' accessible")
        
        # Access users collection
        users_collection = db["users"]
        
        # Check if user already exists
        existing_user = users_collection.find_one({"email": "testuser@example.com"})
        if existing_user:
            print("User already exists, deleting...")
            users_collection.delete_one({"email": "testuser@example.com"})
        
        # Hash password
        password = "testpassword123"
        hashed_password = get_password_hash(password)
        print(f"Password hashed: {password} -> {hashed_password[:20]}...")
        
        # Create user document
        user_doc = {
            "email": "testuser@example.com",
            "full_name": "Test User",
            "hashed_password": hashed_password,
            "created_at": datetime.utcnow()
        }
        
        # Insert user into database
        result = users_collection.insert_one(user_doc)
        print(f"✅ User created with ID: {result.inserted_id}")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("Creating Test User...")
    print("=" * 40)
    create_test_user()