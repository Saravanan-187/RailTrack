import requests
import json

# Test login with our new user
login_data = {
    "username": "testuser@example.com",
    "password": "testpassword123"
}

try:
    response = requests.post(
        "http://localhost:8001/api/auth/login",
        data=login_data
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        token_data = response.json()
        print(f"Access Token: {token_data.get('access_token')}")
        
        # Test getting user info with token
        headers = {
            "Authorization": f"Bearer {token_data.get('access_token')}"
        }
        
        user_response = requests.get(
            "http://localhost:8001/api/auth/me",
            headers=headers
        )
        
        print(f"User Info Status Code: {user_response.status_code}")
        print(f"User Info: {user_response.text}")
        
except Exception as e:
    print(f"Error: {e}")