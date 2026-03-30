import requests
import json

# Base URL for the API
BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test the health check endpoint"""
    response = requests.get(f"{BASE_URL}/health")
    print(f"Health Check: {response.status_code} - {response.json()}")

def test_get_all_trains():
    """Test getting all trains"""
    response = requests.get(f"{BASE_URL}/api/trains/")
    print(f"Get All Trains: {response.status_code}")
    if response.status_code == 200:
        trains = response.json()
        print(f"Found {len(trains)} trains")
        if trains:
            print(f"First train: {trains[0]['train_name']}")

def test_signup():
    """Test user signup"""
    user_data = {
        "email": "test@example.com",
        "full_name": "Test User",
        "password": "securepassword123"
    }
    response = requests.post(f"{BASE_URL}/api/auth/signup", json=user_data)
    print(f"Signup: {response.status_code}")
    if response.status_code == 200:
        print(f"User created: {response.json()}")
        return response.json()
    else:
        print(f"Error: {response.text}")
    return None

def test_login():
    """Test user login"""
    login_data = {
        "username": "test@example.com",
        "password": "securepassword123"
    }
    response = requests.post(f"{BASE_URL}/api/auth/login", data=login_data)
    print(f"Login: {response.status_code}")
    if response.status_code == 200:
        token_data = response.json()
        print(f"Token received: {token_data['token_type']}")
        return token_data['access_token']
    else:
        print(f"Error: {response.text}")
    return None

if __name__ == "__main__":
    print("Testing RailTrack API")
    print("=" * 40)
    
    # Test health check
    test_health_check()
    
    # Test getting trains
    test_get_all_trains()
    
    # Test signup (uncomment when ready to test)
    # user = test_signup()
    
    # Test login (uncomment when ready to test)
    # if user:
    #     token = test_login()