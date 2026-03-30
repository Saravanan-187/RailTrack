import sys
import os
# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database.database import get_trains_collection
from models.train import TrainCreate, StationInfo, TrainClass
from bson import ObjectId

def test_route_functionality():
    """Test the functionality used in the routes"""
    try:
        # Get collection
        trains_collection = get_trains_collection()
        print("✅ Database collection access successful")
        
        # Test find operation
        trains = list(trains_collection.find().limit(1))
        print(f"✅ Find operation successful, found {len(trains)} trains")
        
        if trains:
            train = trains[0]
            print(f"Sample train ID: {train.get('_id')}")
            print(f"Train name: {train.get('train_name', 'Unknown')}")
            
            # Test ObjectId conversion
            train_id = str(train['_id'])
            print(f"✅ ObjectId conversion successful: {train_id}")
            
            # Test finding by ID
            found_train = trains_collection.find_one({"_id": ObjectId(train_id)})
            if found_train:
                print("✅ Find by ID successful")
            else:
                print("❌ Find by ID failed")
                
        # Test model creation and insertion
        from_station = StationInfo(
            station="Test Station",
            code="TST",
            time="10:00"
        )
        
        to_station = StationInfo(
            station="Destination",
            code="DST",
            time="12:00"
        )
        
        classes = [TrainClass(
            type="3A", 
            price="₹1,000", 
            availability="Available", 
            seats=50
        )]
        
        train = TrainCreate(
            train_number="99999",
            train_name="Test Train",
            from_station=from_station,
            to_station=to_station,
            duration="2h 0m",
            classes=classes,
            amenities=["Wifi"],
            rating=4.0,
            on_time=90
        )
        
        # Convert to dict
        train_dict = train.model_dump()
        print("✅ Model to dict conversion successful")
        
        # Test insertion (but don't actually insert)
        print("✅ Route functionality test completed successfully")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("Testing Route Functionality...")
    print("=" * 40)
    test_route_functionality()