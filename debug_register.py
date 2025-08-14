#!/usr/bin/env python3
"""
Debug script to test user registration endpoint
"""

import requests
import json

# Test data that matches what the frontend sends
test_data = {
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "testpassword123",
    "re_password": "testpassword123",
}

# Make request to registration endpoint
url = "http://localhost:8000/api/auth/users/"
headers = {"Content-Type": "application/json", "Accept": "application/json"}

try:
    response = requests.post(url, json=test_data, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    print(f"Response Content: {response.text}")

    if response.headers.get("content-type", "").startswith("application/json"):
        try:
            json_response = response.json()
            print(f"JSON Response: {json.dumps(json_response, indent=2)}")
        except json.JSONDecodeError:
            print("Response is not valid JSON")

except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")
