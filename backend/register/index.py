"""
Business: User registration API endpoint
Args: event with httpMethod, body; context with request_id
Returns: HTTP response with user registration status
"""

import json
import hashlib
import os
import psycopg2
from psycopg2 import sql
from typing import Dict, Any
from pydantic import BaseModel, Field, ValidationError


class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, pattern='^[a-zA-Z0-9_]+$')
    password: str = Field(..., min_length=6)


def hash_password(password: str) -> str:
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        # Parse and validate request
        body_data = json.loads(event.get('body', '{}'))
        register_req = RegisterRequest(**body_data)
        
        # Connect to database
        database_url = os.environ.get('DATABASE_URL')
        if not database_url:
            raise Exception('DATABASE_URL not configured')
            
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        # Check if username already exists
        cursor.execute('SELECT id FROM users WHERE username = %s', (register_req.username,))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Username already exists'}),
                'isBase64Encoded': False
            }
        
        # Hash password and create user
        password_hash = hash_password(register_req.password)
        cursor.execute(
            'INSERT INTO users (username, password_hash) VALUES (%s, %s) RETURNING id',
            (register_req.username, password_hash)
        )
        
        user_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'message': 'User registered successfully',
                'user_id': user_id,
                'username': register_req.username
            }),
            'isBase64Encoded': False
        }
        
    except ValidationError as e:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Validation error', 'details': e.errors()}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Internal server error: {str(e)}'}),
            'isBase64Encoded': False
        }
    finally:
        if 'conn' in locals() and not conn.closed:
            conn.close()