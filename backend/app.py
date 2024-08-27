from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv
from functools import wraps
import json
import boto3

load_dotenv()

app = Flask(__name__)
CORS(app)

# Determine if we're running locally or in AWS
IS_LOCAL = os.getenv('IS_LOCAL', 'true').lower() == 'true'

if not IS_LOCAL:
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(os.getenv('AUTH_TABLE_NAME', 'auth-tokens'))

# Local storage for development
local_tokens = set()

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or not is_valid_token(token.split()[-1]):
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated

def is_valid_token(token):
    if IS_LOCAL:
        return token in local_tokens
    else:
        try:
            response = table.get_item(Key={'token': token})
            return 'Item' in response
        except:
            return False

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if username == 'demo' and password == 'password':  # Replace with actual auth logic
        token = f"{username}-token"
        if IS_LOCAL:
            local_tokens.add(token)
        else:
            table.put_item(Item={'token': token})
        return jsonify({"access_token": token, "token_type": "bearer"})
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route('/starships', methods=['GET'])
@require_auth
def get_starships():
    manufacturer = request.args.get('manufacturer')
    
    all_starships = []
    url = "https://swapi.dev/api/starships/"
    
    while url:
        response = requests.get(url)
        data = response.json()
        all_starships.extend(data['results'])
        url = data['next']

    if manufacturer:
        filtered_starships = [ship for ship in all_starships if ship['manufacturer'] == manufacturer]
    else:
        filtered_starships = all_starships

    return jsonify(filtered_starships)

@app.route('/manufacturers', methods=['GET'])
@require_auth
def get_manufacturers():
    all_starships = []
    url = "https://swapi.dev/api/starships/"
    
    while url:
        response = requests.get(url)
        data = response.json()
        all_starships.extend(data['results'])
        url = data['next']

    manufacturers = list(set(ship['manufacturer'] for ship in all_starships))
    return jsonify(manufacturers)

if __name__ == '__main__':
    app.run(debug=True)