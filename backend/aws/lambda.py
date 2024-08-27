import json
import boto3
import hashlib
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.resource('dynamodb')
users_table = dynamodb.Table('StarWarsStarShipsUsers')
starships_table = dynamodb.Table('StarWarsStarships')

def lambda_handler(event, context):
    route_key = event.get('httpMethod') + ' ' + event.get('path')

    if route_key == 'POST /signup':
        return signup_user(event)
    elif route_key == 'POST /login':
        return login_user(event)
    elif route_key == 'GET /dashboard':
        return get_manufacturers_dashboard()
    elif route_key == 'GET /starships':
        return get_starships_by_manufacturer(event)
    elif route_key == 'GET /manufacturers':
        return get_manufacturers()
    else:
        return {
            'statusCode': 404,
            'body': json.dumps({'message': 'Route not found'})
        }

def signup_user(event):
    body = json.loads(event['body'])
    username = body['username']
    password = body['password']

    # Hash the password using hashlib
    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    try:
        # Put item into DynamoDB
        response = users_table.put_item(
            Item={
                'username': username,        # Partition key
                'password': hashed_password  # Non-key attribute
            },
            ConditionExpression='attribute_not_exists(username)'  # Ensure the username is unique
        )
        return {
            'statusCode': 201,
            'body': json.dumps({'message': 'User created successfully!'})
        }
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Username already exists'})
            }
        else:
            return {
                'statusCode': 500,
                'body': json.dumps({'message': 'Internal server error'})
            }

def login_user(event):
    body = json.loads(event['body'])
    username = body['username']
    password = body['password']

    # Hash the incoming password to compare with the stored hash
    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    try:
        # Retrieve the user from DynamoDB
        response = users_table.get_item(
            Key={
                'username': username
            }
        )
        item = response.get('Item')
        if not item:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Invalid username or password'})
            }

        # Verify the password
        if hashed_password == item['password']:
            return {
                'statusCode': 200,
                'body': json.dumps({'message': 'Login successful'})
            }
        else:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Invalid username or password'})
            }
    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal server error'})
        }

def get_manufacturers_dashboard():
    try:
        # Scan the StarWarsStarships table to get all manufacturers and starships
        response = starships_table.scan()

        # Process the items to create a dashboard summary
        items = response.get('Items', [])
        manufacturers = {}
        for item in items:
            manufacturer = item['manufacturer']
            name = item['name']
            if manufacturer not in manufacturers:
                manufacturers[manufacturer] = []
            manufacturers[manufacturer].append(name)

        return {
            'statusCode': 200,
            'body': json.dumps(manufacturers)
        }
    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal server error'})
        }

def get_starships_by_manufacturer(event):
    try:
        # Extract the manufacturer query parameter
        manufacturer = event.get('queryStringParameters', {}).get('manufacturer')

        if not manufacturer:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Manufacturer query parameter is required'})
            }

        # Query the StarWarsStarships table by manufacturer using the GSI
        response = starships_table.query(
            IndexName='ManufacturerIndex',
            KeyConditionExpression=Key('manufacturer').eq(manufacturer)
        )

        starships = response.get('Items', [])

        return {
            'statusCode': 200,
            'body': json.dumps(starships)
        }
    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal server error'})
        }

def get_manufacturers():
    try:
        # Scan the StarWarsStarships table to get all manufacturers
        response = starships_table.scan()

        items = response.get('Items', [])
        manufacturers = set(item['manufacturer'] for item in items)

        return {
            'statusCode': 200,
            'body': json.dumps(list(manufacturers))
        }
    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal server error'})
        }
