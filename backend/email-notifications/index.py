"""
Business: Send email notifications for payment orders
Args: event with httpMethod, body containing order details
Returns: HTTP response with email sending status
"""

import json
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any
from pydantic import BaseModel, Field, ValidationError
from datetime import datetime


class OrderNotification(BaseModel):
    customer_email: str = Field(..., pattern=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    customer_phone: str = Field(..., min_length=10, max_length=20)
    customer_name: str = Field(default="", max_length=100)
    order_amount: float = Field(..., gt=0)
    order_id: str = Field(..., min_length=1)
    items: list = Field(default=[])
    payment_method: str = Field(default="")


def send_email_notification(order_data: OrderNotification) -> bool:
    """Send email notification about new order"""
    try:
        # Get SMTP configuration
        smtp_host = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
        smtp_port = int(os.environ.get('SMTP_PORT', '587'))
        smtp_user = os.environ.get('SMTP_USER')
        smtp_password = os.environ.get('SMTP_PASSWORD')
        
        if not smtp_user or not smtp_password:
            raise Exception('SMTP credentials not configured')
        
        # Create email content
        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = 'rxtxshop@gmail.com'
        msg['Subject'] = f'Новый заказ #{order_data.order_id} на сумму {order_data.order_amount} ₽'
        
        # Email body
        body = f"""
Получен новый заказ на сайте!

Детали заказа:
• Номер заказа: {order_data.order_id}
• Сумма: {order_data.order_amount} ₽
• Дата: {datetime.now().strftime('%d.%m.%Y %H:%M')}
• Способ оплаты: {order_data.payment_method or 'Не указан'}

Контактные данные клиента:
• Email: {order_data.customer_email}
• Телефон: {order_data.customer_phone}
• Имя: {order_data.customer_name or 'Не указано'}

Состав заказа:
"""
        
        if order_data.items:
            for item in order_data.items:
                if isinstance(item, dict):
                    name = item.get('name', 'Товар')
                    quantity = item.get('quantity', 1)
                    price = item.get('price', 0)
                    body += f"• {name} - {quantity} шт. по {price} ₽\n"
        else:
            body += "• Состав заказа не указан\n"
        
        body += f"\n---\nПисьмо отправлено автоматически с сайта RXTX"
        
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        # Send email
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        text = msg.as_string()
        server.sendmail(smtp_user, 'rxtxshop@gmail.com', text)
        server.quit()
        
        return True
        
    except Exception as e:
        print(f"Email sending error: {str(e)}")
        return False


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
            'body': '',
            'isBase64Encoded': False
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
        order_data = OrderNotification(**body_data)
        
        # Send email notification
        email_sent = send_email_notification(order_data)
        
        if email_sent:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'message': 'Email notification sent successfully'
                }),
                'isBase64Encoded': False
            }
        else:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': False,
                    'error': 'Failed to send email notification'
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