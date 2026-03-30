import os
import sys
from dotenv import load_dotenv
import pymongo

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database.database import get_trains_collection

def test_db_connection():
    """Test database connection and data retrieval"""
    try:
        # Test connection
        load_dotenv()
        mongodb_uri = os.getenv("MONGODB_URI")
        print(f"MongoDB URI: {mongodb_uri}")
        
        # Test direct connection
        client = pymongo.MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        print("✅ Direct MongoDB connection successful")
        
        # Test database access
        db = client["rail_vista_journey"]
        print(f"✅ Database 'rail_vista_journey' accessible")
        
        # Test collection access
        trains_collection = db["trains"]
        count = trains_collection.count_documents({})
        print(f"✅ Trains collection has {count} documents")
        
        # Test data retrieval
        trains = list(trains_collection.find().limit(5))
        print(f"✅ Retrieved {len(trains)} trains from database")
        
        for train in trains:
            print(f"  - Train: {train.get('train_name', 'Unknown')} ({train.get('train_number', 'Unknown')})")
            
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("Debugging MongoDB Connection...")
    print("=" * 40)
    test_db_connection()