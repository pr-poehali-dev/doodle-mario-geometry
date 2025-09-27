import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для работы со статистикой игроков
    Args: event с httpMethod, body, queryStringParameters
          context с request_id
    Returns: HTTP response с данными статистики
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
            # Получение статистики
            params = event.get('queryStringParameters', {}) or {}
            stats_type = params.get('type', 'leaderboard')
            
            if stats_type == 'leaderboard':
                # Топ игроков по лучшему счету
                cur.execute("""
                    SELECT player_name, game_name, best_score, games_played, play_time
                    FROM player_stats 
                    ORDER BY best_score DESC 
                    LIMIT 20
                """)
                
                leaderboard = []
                for row in cur.fetchall():
                    leaderboard.append({
                        'player_name': row[0],
                        'game_name': row[1],
                        'best_score': row[2],
                        'games_played': row[3],
                        'play_time': row[4]
                    })
                
                result = {'leaderboard': leaderboard}
            
            elif stats_type == 'overview':
                # Общая статистика по играм
                cur.execute("""
                    SELECT 
                        game_name,
                        COUNT(*) as total_players,
                        SUM(games_played) as total_games,
                        SUM(play_time) as total_time,
                        AVG(best_score) as avg_score,
                        MAX(best_score) as max_score
                    FROM player_stats 
                    GROUP BY game_name
                """)
                
                overview = []
                for row in cur.fetchall():
                    overview.append({
                        'game_name': row[0],
                        'total_players': row[1],
                        'total_games': row[2],
                        'total_time': row[3],
                        'avg_score': round(float(row[4]), 2) if row[4] else 0,
                        'max_score': row[5]
                    })
                
                result = {'overview': overview}
            
            else:
                result = {'error': 'Unknown stats type'}
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps(result)
            }
        
        elif method == 'POST':
            # Сохранение игровой сессии
            body_data = json.loads(event.get('body', '{}'))
            
            player_name = body_data.get('player_name', '').strip()
            game_name = body_data.get('game_name', '').strip()
            score = body_data.get('score', 0)
            duration = body_data.get('duration', 0)
            
            if not all([player_name, game_name]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'player_name и game_name обязательны'})
                }
            
            # Сохраняем сессию
            cur.execute("""
                INSERT INTO game_sessions (player_name, game_name, score, duration) 
                VALUES (%s, %s, %s, %s)
            """, (player_name, game_name, score, duration))
            
            # Обновляем или создаем статистику игрока
            cur.execute("""
                SELECT id, games_played, play_time, best_score 
                FROM player_stats 
                WHERE player_name = %s AND game_name = %s
            """, (player_name, game_name))
            
            existing = cur.fetchone()
            
            if existing:
                # Обновляем существующую запись
                new_games_played = existing[1] + 1
                new_play_time = existing[2] + duration
                new_best_score = max(existing[3], score)
                
                cur.execute("""
                    UPDATE player_stats 
                    SET games_played = %s, play_time = %s, best_score = %s, 
                        score = %s, updated_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                """, (new_games_played, new_play_time, new_best_score, score, existing[0]))
            else:
                # Создаем новую запись
                cur.execute("""
                    INSERT INTO player_stats (player_name, game_name, score, play_time, games_played, best_score) 
                    VALUES (%s, %s, %s, %s, 1, %s)
                """, (player_name, game_name, score, duration, score))
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'message': 'Статистика обновлена!'})
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