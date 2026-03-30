import sys
import os
from datetime import datetime
# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.booking import BookingCreate

async def test_bookings_functionality():
    """Test the bookings functionality"""
    try:
        # Import the function directly
        from routes.bookings import create_booking, get_current_user
        
        # Create a test booking
        booking = BookingCreate(
            train_id="68cec8d4e120572f11fd4615",
            user_id="test_user_id",
            class_type="2A",
            passenger_details={},
            total_amount=2500.0,
            booking_date=datetime.utcnow()
        )
        
        print("Testing bookings creation...")
        # Get current user (placeholder)
        current_user = get_current_user()
        result = await create_booking(booking, current_user)
        print(f"✅ Bookings creation successful")
        print(f"Booking ID: {result.id}")
        print(f"Booking Reference: {result.booking_reference}")
        print(f"Status: {result.status}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    import asyncio
    print("Testing Bookings Route...")
    print("=" * 40)
    asyncio.run(test_bookings_functionality())