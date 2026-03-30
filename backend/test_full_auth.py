import requests

# Test full authentication flow
def test_auth():
    # Login
    login_data = {
        "username": "abc@test.com",
        "password": "abc123"
    }
    
    try:
        # Login request
        login_response = requests.post(
            "http://localhost:8001/api/auth/login",
            data=login_data
        )
        
        print(f"Login Status: {login_response.status_code}")
        if login_response.status_code != 200:
            print(f"Login Failed: {login_response.text}")
            return
            
        token_data = login_response.json()
        access_token = token_data.get('access_token')
        print(f"Access Token: {access_token[:30]}...")
        
        # Get user info
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        
        user_response = requests.get(
            "http://localhost:8001/api/auth/me",
            headers=headers
        )
        
        print(f"User Info Status: {user_response.status_code}")
        if user_response.status_code == 200:
            user_data = user_response.json()
            print(f"User Data: {user_data}")
        else:
            print(f"User Info Failed: {user_response.text}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_auth()