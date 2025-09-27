import json
import os
import psycopg2
from typing import Dict, Any, List
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для работы с отзывами игроков
    Args: event с httpMethod, body, queryStringParameters
          context с request_id
    Returns: HTTP response с данными отзывов
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    # Подключение к базе данных
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Database connection not configured'})
        }
    
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        if method == 'GET':
            # Получение отзывов
            params = event.get('queryStringParameters', {}) or {}
            game_name = params.get('game_name')
            
            if game_name:
                cur.execute("""
                    SELECT player_name, game_name, rating, comment, created_at 
                    FROM reviews 
                    WHERE game_name = %s 
                    ORDER BY created_at DESC
                """, (game_name,))
            else:
                cur.execute("""
                    SELECT player_name, game_name, rating, comment, created_at 
                    FROM reviews 
                    ORDER BY created_at DESC
                """)
            
            reviews = []
            for row in cur.fetchall():
                reviews.append({
                    'player_name': row[0],
                    'game_name': row[1],
                    'rating': row[2],
                    'comment': row[3],
                    'created_at': row[4].isoformat() if row[4] else None
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'reviews': reviews})
            }
        
        elif method == 'POST':
            # Добавление нового отзыва
            body_data = json.loads(event.get('body', '{}'))
            
            player_name = body_data.get('player_name', '').strip()
            game_name = body_data.get('game_name', '').strip()
            rating = body_data.get('rating')
            comment = body_data.get('comment', '').strip()
            
            if not all([player_name, game_name, rating, comment]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Все поля обязательны для заполнения'})
                }
            
            if not (1 <= rating <= 5):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Рейтинг должен быть от 1 до 5'})
                }
            
            cur.execute("""
                INSERT INTO reviews (player_name, game_name, rating, comment) 
                VALUES (%s, %s, %s, %s)
            """, (player_name, game_name, rating, comment))
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'message': 'Отзыв успешно добавлен!'})
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'Database error: {str(e)}'})
        }