#!/usr/bin/env python3
"""
MongoDB Connection Test Script

This script helps verify that your MongoDB Atlas connection is properly configured.
"""

import os
import sys
from dotenv import load_dotenv
import pymongo

# Load environment variables
load_dotenv()

def test_mongodb_connection():
    """Test MongoDB connection with current configuration"""
    mongodb_uri = os.getenv("MONGODB_URI")
    
    if not mongodb_uri or mongodb_uri == "your_mongodb_atlas_uri_here":
        print("❌ MongoDB URI not configured!")
        print("Please update the .env file with your actual MongoDB Atlas URI")
        print("\nInstructions:")
        print("1. Go to https://www.mongodb.com/cloud/atlas")
        print("2. Create a free account and cluster")
        print("3. Get your connection string")
        print("4. Update the MONGODB_URI in the .env file")
        return False
    
    try:
        print(f"🔗 Attempting to connect to MongoDB...")
        print(f"URI: {mongodb_uri.replace(os.getenv('MONGODB_URI', '').split('@')[0].split('//')[1], '***:***')}")
        
        # Create MongoDB client
        client = pymongo.MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
        
        # Test the connection
        client.admin.command('ping')
        print("✅ Successfully connected to MongoDB!")
        
        # Test database and collection access
        db = client["rail_vista_journey"]
        print(f"📚 Database 'rail_vista_journey' is accessible")
        
        # Test collections
        collections = db.list_collection_names()
        print(f"📂 Existing collections: {collections if collections else 'None'}")
        
        # Test write operation with a dummy collection
        test_collection = db["connection_test"]
        test_doc = {"test": "connection", "status": "success"}
        result = test_collection.insert_one(test_doc)
        print(f"📝 Write test successful. Inserted document ID: {result.inserted_id}")
        
        # Clean up test document
        test_collection.delete_one({"_id": result.inserted_id})
        print("🧹 Cleaned up test document")
        
        # Close connection
        client.close()
        print("🔒 Connection closed")
        
        return True
        
    except pymongo.errors.ServerSelectionTimeoutError as e:
        print("❌ Connection timeout!")
        print("Possible causes:")
        print("  - Incorrect URI")
        print("  - Network connectivity issues")
        print("  - IP address not whitelisted in MongoDB Atlas")
        print("  - Incorrect username/password")
        print(f"Error details: {e}")
        return False
        
    except pymongo.errors.ConfigurationError as e:
        print("❌ Configuration error!")
        print("Possible causes:")
        print("  - Malformed URI")
        print("  - Non-existent cluster")
        print(f"Error details: {e}")
        return False
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def show_current_config():
    """Display current configuration"""
    print("=== Current Configuration ===")
    mongodb_uri = os.getenv("MONGODB_URI", "Not set")
    secret_key = os.getenv("SECRET_KEY", "Not set")
    algorithm = os.getenv("ALGORITHM", "Not set")
    expire_minutes = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "Not set")
    
    # Mask sensitive information
    if mongodb_uri != "Not set" and mongodb_uri != "your_mongodb_atlas_uri_here":
        try:
            # Mask password in URI
            parts = mongodb_uri.split('@')
            if len(parts) > 1:
                user_pass = parts[0].split('//')[1]
                masked_uri = mongodb_uri.replace(user_pass, "***:***")
                print(f"MongoDB URI: {masked_uri}")
            else:
                print(f"MongoDB URI: {mongodb_uri}")
        except:
            print(f"MongoDB URI: {mongodb_uri}")
    else:
        print(f"MongoDB URI: {mongodb_uri}")
    
    print(f"Secret Key: {'Set' if secret_key != 'Not set' and secret_key != 'your_secret_key_here' else 'Not set'}")
    print(f"Algorithm: {algorithm}")
    print(f"Token Expire Minutes: {expire_minutes}")
    print()

if __name__ == "__main__":
    print("MongoDB Connection Test for RailTrack")
    print("=" * 50)
    
    show_current_config()
    
    print("Running MongoDB connection test...")
    print("-" * 30)
    
    success = test_mongodb_connection()
    
    print("-" * 30)
    if success:
        print("🎉 All tests passed! Your MongoDB configuration is correct.")
        print("\nNext steps:")
        print("1. Run the main application: python main.py")
        print("2. Or start with uvicorn: uvicorn main:app --reload")
    else:
        print("🔧 Please fix the configuration issues and try again.")
        print("Refer to MONGODB_SETUP.md for detailed instructions.")
        sys.exit(1)