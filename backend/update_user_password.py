import os
import sys
from dotenv import load_dotenv
import pymongo
from datetime import datetime
from utils.security import get_password_hash

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def update_user_password():
    """Update user password to a known value"""
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
        
        # Find the user
        user = users_collection.find_one({"email": "abc@test.com"})
        if not user:
            print("❌ User not found")
            return False
            
        print(f"✅ User found: {user.get('full_name', 'Unknown')} ({user.get('email', 'Unknown')})")
        
        # Hash new password
        new_password = "abc123"
        hashed_password = get_password_hash(new_password)
        print(f"Password hashed: {new_password} -> {hashed_password[:20]}...")
        
        # Update user document
        result = users_collection.update_one(
            {"email": "abc@test.com"},
            {
                "$set": {
                    "hashed_password": hashed_password,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count > 0:
            print("✅ User password updated successfully")
        else:
            print("❌ No changes made to user document")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("Updating User Password...")
    print("=" * 40)
    update_user_password()