import os
import sys
from dotenv import load_dotenv
import pymongo

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def debug_users():
    """Debug users in the database"""
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
        count = users_collection.count_documents({})
        print(f"✅ Users collection has {count} documents")
        
        # Retrieve users
        users = list(users_collection.find())
        print(f"✅ Retrieved {len(users)} users from database")
        
        for user in users:
            print(f"  - User: {user.get('full_name', 'Unknown')} ({user.get('email', 'Unknown')})")
            print(f"    ID: {user.get('_id')}")
            print(f"    Created: {user.get('created_at')}")
            # Don't print password hashes for security
            print()
            
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("Debugging Users in MongoDB...")
    print("=" * 40)
    debug_users()