-- Создаем таблицы для отзывов и статистики игроков

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    player_name VARCHAR(100) NOT NULL,
    game_name VARCHAR(50) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE player_stats (
    id SERIAL PRIMARY KEY,
    player_name VARCHAR(100) NOT NULL,
    game_name VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    play_time INTEGER NOT NULL DEFAULT 0, -- в секундах
    games_played INTEGER NOT NULL DEFAULT 1,
    best_score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE game_sessions (
    id SERIAL PRIMARY KEY,
    player_name VARCHAR(100) NOT NULL,
    game_name VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL,
    duration INTEGER NOT NULL, -- в секундах
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации запросов
CREATE INDEX idx_reviews_game ON reviews(game_name);
CREATE INDEX idx_player_stats_game ON player_stats(game_name);
CREATE INDEX idx_player_stats_name ON player_stats(player_name);
CREATE INDEX idx_game_sessions_game ON game_sessions(game_name);

-- Вставляем тестовые данные
INSERT INTO reviews (player_name, game_name, rating, comment) VALUES
('КОСМОНАВТ_2024', 'Doodle Jump', 5, 'Отличная игра! Очень затягивает, особенно нравится ретро-стиль и неоновые эффекты.'),
('RETRO_MASTER', 'Geometry Dash', 5, 'Сложная но увлекательная игра. Графика супер, анимации плавные!'),
('MARIO_FAN', 'Super Mario Jump', 4, 'Классная версия Марио! Напоминает детство, но с современным дизайном.'),
('PIXEL_HERO', 'Doodle Jump', 4, 'Хорошая реализация, управление отзывчивое. Можно было бы добавить больше платформ.'),
('NEON_GAMER', 'Geometry Dash', 5, 'Лучшая аркадная игра на сайте! Ритм идеальный, препятствия интересные.');

INSERT INTO player_stats (player_name, game_name, score, play_time, games_played, best_score) VALUES
('КОСМОНАВТ_2024', 'Doodle Jump', 15420, 3600, 24, 15420),
('RETRO_MASTER', 'Geometry Dash', 12850, 2800, 18, 12850),
('MARIO_FAN', 'Super Mario Jump', 11200, 2400, 15, 11200),
('PIXEL_HERO', 'Doodle Jump', 9980, 1800, 12, 9980),
('NEON_GAMER', 'Geometry Dash', 8750, 2200, 16, 8750),
('ARCADE_KING', 'Doodle Jump', 7650, 1200, 8, 7650),
('JUMP_MASTER', 'Super Mario Jump', 6800, 1500, 10, 6800);