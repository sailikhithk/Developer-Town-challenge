import json
import os
import boto3
import bcrypt
import uuid
from boto3.dynamodb.conditions import Key
import requests
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

def lambda_handler(event, context):
    http_method = event['httpMethod']
    path = event['path']
    
    if http_method == 'POST':
        if path == '/signup':
            return signup(json.loads(event['body']))
        elif path == '/login':
            return login(json.loads(event['body']))
    elif http_method == 'GET':
        token = event['headers'].get('Authorization', '').split()[-1]
        if not is_valid_token(token):
            return {
                'statusCode': 401,
                'body': json.dumps({'error': 'Unauthorized'})
            }
        if path == '/starships':
            return get_starships(event['queryStringParameters'])
        elif path == '/manufacturers':
            return get_manufacturers()
    
    return {
        'statusCode': 404,
        'body': json.dumps({'error': 'Not Found'})
    }

def signup(data):
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Username and password are required'})
        }
    
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    try:
        table.put_item(
            Item={
                'PK': f'USER#{username}',
                'SK': 'PROFILE',
                'username': username,
                'password': hashed_password
            },
            ConditionExpression='attribute_not_exists(PK)'
        )
        return {
            'statusCode': 201,
            'body': json.dumps({'message': 'User created successfully'})
        }
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            return {
                'statusCode': 409,
                'body': json.dumps({'error': 'Username already exists'})
            }
        else:
            return {
                'statusCode': 500,
                'body': json.dumps({'error': 'An error occurred during signup'})
            }

def login(data):
    username = data.get('username')
    password = data.get('password')
    
    try:
        response = table.get_item(Key={'PK': f'USER#{username}', 'SK': 'PROFILE'})
        user = response.get('Item')
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            token = str(uuid.uuid4())
            table.put_item(Item={
                'PK': f'TOKEN#{token}',
                'SK': 'AUTH',
                'username': username
            })
            return {
                'statusCode': 200,
                'body': json.dumps({'access_token': token, 'token_type': 'bearer'})
            }
        else:
            return {
                'statusCode': 401,
                'body': json.dumps({'error': 'Invalid credentials'})
            }
    except ClientError:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'An error occurred during login'})
        }

def is_valid_token(token):
    try:
        response = table.get_item(Key={'PK': f'TOKEN#{token}', 'SK': 'AUTH'})
        return 'Item' in response
    except ClientError:
        return False

def get_starships(query_params):
    manufacturer = query_params.get('manufacturer') if query_params else None
    
    try:
        response = requests.get("https://swapi.dev/api/starships/")
        all_starships = response.json()["results"]
        
        if manufacturer:
            filtered_starships = [ship for ship in all_starships if ship['manufacturer'] == manufacturer]
        else:
            filtered_starships = all_starships

        return {
            'statusCode': 200,
            'body': json.dumps(filtered_starships)
        }
    except requests.RequestException:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'An error occurred while fetching starship data'})
        }

def get_manufacturers():
    try:
        response = requests.get("https://swapi.dev/api/starships/")
        all_starships = response.json()["results"]
        manufacturers = list(set(ship['manufacturer'] for ship in all_starships))
        return {
            'statusCode': 200,
            'body': json.dumps(manufacturers)
        }
    except requests.RequestException:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'An error occurred while fetching manufacturer data'})
        }