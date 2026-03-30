import sys
import os
# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.user import UserCreate

async def test_auth_functionality():
    """Test the auth functionality"""
    try:
        # Import the function directly
        from routes.auth import signup
        
        # Create a test user with a unique email
        user = UserCreate(
            email="test2@example.com",
            full_name="Test User 2",
            password="testpassword"
        )
        
        print("Testing auth signup...")
        result = await signup(user)
        print(f"✅ Auth signup successful")
        print(f"User ID: {result.id}")
        print(f"Email: {result.email}")
        print(f"Full Name: {result.full_name}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    import asyncio
    print("Testing Auth Route...")
    print("=" * 40)
    asyncio.run(test_auth_functionality())