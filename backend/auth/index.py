import json
import hashlib
import os
import secrets
import psycopg2
from datetime import datetime, timedelta
from typing import Dict, Any
from pydantic import BaseModel, Field, ValidationError

class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, pattern=r'^[a-zA-Z0-9_]+$')
    password: str = Field(..., min_length=6, max_length=100)
    action: str = Field(default="register")

class LoginRequest(BaseModel):
    username: str = Field(..., min_length=1, max_length=50)
    password: str = Field(..., min_length=1, max_length=100)
    action: str = Field(default="login")

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Handle user registration and login authentication
    Args: event - dict with httpMethod, body containing username, password, action
          context - object with request_id attribute
    Returns: HTTP response dict with success/error status and session token
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    # Handle profile GET request
    if method == 'GET':
        return get_profile(event)
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        # Parse request
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action', 'login')
        
        if action == 'register':
            return handle_register(body_data)
        elif action == 'login':
            return handle_login(body_data)
        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Invalid action. Use register or login'})
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Internal server error'})
        }

def handle_register(body_data: Dict[str, Any]) -> Dict[str, Any]:
    try:
        register_req = RegisterRequest(**body_data)
        password_hash = hashlib.sha256(register_req.password.encode()).hexdigest()
        
        database_url = os.environ.get('DATABASE_URL')
        if not database_url:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Database not configured'})
            }
        
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        try:
            # Check if username exists using simple query
            safe_username = register_req.username.replace("'", "''")
            cursor.execute(f"SELECT id FROM users WHERE username = '{safe_username}'")
            if cursor.fetchone():
                conn.close()
                return {
                    'statusCode': 409,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Username already exists'})
                }
            
            # Insert new user using simple query
            cursor.execute(
                f"INSERT INTO users (username, password_hash) VALUES ('{safe_username}', '{password_hash}') RETURNING id"
            )
            user_id = cursor.fetchone()[0]
            conn.commit()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'message': 'User registered successfully',
                    'user_id': user_id
                })
            }
            
        except:
            conn.close()
            raise
            
    except ValidationError as e:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Invalid input', 'details': e.errors()})
        }

def handle_login(body_data: Dict[str, Any]) -> Dict[str, Any]:
    try:
        login_req = LoginRequest(**body_data)
        password_hash = hashlib.sha256(login_req.password.encode()).hexdigest()
        
        database_url = os.environ.get('DATABASE_URL')
        if not database_url:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Database not configured'})
            }
        
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        try:
            # Check user credentials using simple query
            safe_username = login_req.username.replace("'", "''")
            cursor.execute(
                f"SELECT id, username FROM users WHERE username = '{safe_username}' AND password_hash = '{password_hash}'"
            )
            user = cursor.fetchone()
            
            if not user:
                conn.close()
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Invalid username or password'})
                }
            
            user_id, username = user
            
            # Generate session token
            session_token = secrets.token_urlsafe(32)
            expires_at = datetime.now() + timedelta(days=7)
            
            # Clean up old sessions using simple query
            cursor.execute(f"DELETE FROM user_sessions WHERE user_id = {user_id}")
            
            # Create new session using simple query
            expires_str = expires_at.strftime('%Y-%m-%d %H:%M:%S')
            cursor.execute(
                f"INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES ({user_id}, '{session_token}', '{expires_str}')"
            )
            conn.commit()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'message': 'Login successful',
                    'session_token': session_token,
                    'user': {
                        'id': user_id,
                        'username': username
                    },
                    'expires_at': expires_at.isoformat()
                })
            }
            
        except:
            conn.close()
            raise
            
    except ValidationError as e:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Invalid input', 'details': e.errors()})
        }

def get_profile(event: Dict[str, Any]) -> Dict[str, Any]:
    try:
        # Get session token from headers
        headers = event.get('headers', {})
        session_token = headers.get('X-Session-Token') or headers.get('x-session-token')
        
        if not session_token:
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Session token required'})
            }
        
        database_url = os.environ.get('DATABASE_URL')
        if not database_url:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Database not configured'})
            }
        
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        try:
            # Validate session token using simple query
            safe_token = session_token.replace("'", "''")
            cursor.execute(f"""
                SELECT u.id, u.username, u.created_at, s.expires_at
                FROM users u
                JOIN user_sessions s ON u.id = s.user_id
                WHERE s.session_token = '{safe_token}' AND s.expires_at > NOW()
            """)
            
            result = cursor.fetchone()
            conn.close()
            
            if not result:
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Invalid or expired session'})
                }
            
            user_id, username, created_at, expires_at = result
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'user': {
                        'id': user_id,
                        'username': username,
                        'created_at': created_at.isoformat() if created_at else None,
                        'session_expires_at': expires_at.isoformat() if expires_at else None
                    }
                })
            }
            
        except:
            conn.close()
            raise
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Internal server error'})
        }