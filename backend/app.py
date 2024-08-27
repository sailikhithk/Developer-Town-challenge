from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv
from functools import wraps
import bcrypt
import uuid
import time
from requests.exceptions import RequestException, Timeout

load_dotenv()

app = Flask(__name__)
CORS(app)

# Determine if we're running locally or in AWS
IS_LOCAL = os.getenv('IS_LOCAL', 'true').lower() == 'true'

if not IS_LOCAL:
    import boto3
    dynamodb = boto3.resource('dynamodb')
    users_table = dynamodb.Table(os.getenv('USERS_TABLE_NAME', 'users'))
    auth_table = dynamodb.Table(os.getenv('AUTH_TABLE_NAME', 'auth-tokens'))
else:
    # Local storage for development
    local_users = {}
    local_tokens = {}

# Caching setup
starships_cache = {"data": None, "timestamp": 0}
CACHE_DURATION = 3600  # Cache duration in seconds (1 hour)

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
            response = auth_table.get_item(Key={'token': token})
            return 'Item' in response
        except:
            return False

def get_cached_data(cache, url):
    current_time = time.time()
    if cache["data"] is None or (current_time - cache["timestamp"]) > CACHE_DURATION:
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            cache["data"] = response.json()["results"]
            cache["timestamp"] = current_time
        except (Timeout, RequestException) as e:
            app.logger.error(f"Error fetching data from SWAPI: {str(e)}")
            if cache["data"] is None:
                raise
    return cache["data"]

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    if IS_LOCAL:
        if username in local_users:
            return jsonify({"error": "Username already exists"}), 409
        local_users[username] = hashed_password
    else:
        try:
            users_table.put_item(
                Item={
                    'username': username,
                    'password': hashed_password.decode('utf-8')
                },
                ConditionExpression='attribute_not_exists(username)'
            )
        except dynamodb.meta.client.exceptions.ConditionalCheckFailedException:
            return jsonify({"error": "Username already exists"}), 409
        except Exception as e:
            app.logger.error(f"Error during signup: {str(e)}")
            return jsonify({"error": "An error occurred during signup"}), 500
    
    return jsonify({"message": "User created successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if IS_LOCAL:
        stored_password = local_users.get(username)
    else:
        try:
            response = users_table.get_item(Key={'username': username})
            stored_password = response.get('Item', {}).get('password')
        except Exception as e:
            app.logger.error(f"Error during login: {str(e)}")
            return jsonify({"error": "An error occurred during login"}), 500
    
    if stored_password and bcrypt.checkpw(password.encode('utf-8'), stored_password):
        token = str(uuid.uuid4())
        if IS_LOCAL:
            local_tokens[token] = username
        else:
            auth_table.put_item(Item={'token': token, 'username': username})
        return jsonify({"access_token": token, "token_type": "bearer"})
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route('/starships', methods=['GET'])
@require_auth
def get_starships():
    manufacturer = request.args.get('manufacturer')
    
    try:
        all_starships = get_cached_data(starships_cache, "https://swapi.dev/api/starships/")
        
        if manufacturer:
            filtered_starships = [ship for ship in all_starships if ship['manufacturer'] == manufacturer]
        else:
            filtered_starships = all_starships

        return jsonify(filtered_starships)

    except Timeout:
        return jsonify({"error": "The request to the Star Wars API timed out. Please try again later."}), 504
    except RequestException as e:
        app.logger.error(f"Error fetching starship data: {str(e)}")
        return jsonify({"error": "An error occurred while fetching starship data. Please try again later."}), 500

@app.route('/manufacturers', methods=['GET'])
@require_auth
def get_manufacturers():
    try:
        all_starships = get_cached_data(starships_cache, "https://swapi.dev/api/starships/")
        manufacturers = list(set(ship['manufacturer'] for ship in all_starships))
        return jsonify(manufacturers)

    except Timeout:
        return jsonify({"error": "The request to the Star Wars API timed out. Please try again later."}), 504
    except RequestException as e:
        app.logger.error(f"Error fetching manufacturer data: {str(e)}")
        return jsonify({"error": "An error occurred while fetching manufacturer data. Please try again later."}), 500

if __name__ == '__main__':
    app.run(debug=True)