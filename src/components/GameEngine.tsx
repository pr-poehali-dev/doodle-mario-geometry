import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface GameState {
  isPlaying: boolean;
  score: number;
  gameOver: boolean;
  isPaused: boolean;
}

interface Player {
  x: number;
  y: number;
  velocityY: number;
  onGround: boolean;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const DoodleJumpGame = ({ onGameEnd }: { onGameEnd: (score: number) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    score: 0,
    gameOver: false,
    isPaused: false
  });
  
  const [player, setPlayer] = useState<Player>({
    x: 200,
    y: 400,
    velocityY: 0,
    onGround: false
  });

  const [platforms, setPlatforms] = useState<Platform[]>([
    { x: 150, y: 450, width: 100, height: 20 },
    { x: 50, y: 350, width: 100, height: 20 },
    { x: 250, y: 250, width: 100, height: 20 },
    { x: 100, y: 150, width: 100, height: 20 },
  ]);

  const [keys, setKeys] = useState<{[key: string]: boolean}>({});

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setKeys(prev => ({ ...prev, [e.code]: true }));
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setKeys(prev => ({ ...prev, [e.code]: false }));
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const startGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: true, gameOver: false, score: 0 }));
    setPlayer({ x: 200, y: 400, velocityY: 0, onGround: false });
  };

  const gameLoop = useCallback(() => {
    if (!gameState.isPlaying || gameState.gameOver || gameState.isPaused) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update player position
    setPlayer(prev => {
      const newPlayer = { ...prev };
      
      // Horizontal movement
      if (keys['ArrowLeft'] || keys['KeyA']) {
        newPlayer.x = Math.max(0, newPlayer.x - 5);
      }
      if (keys['ArrowRight'] || keys['KeyD']) {
        newPlayer.x = Math.min(canvas.width - 20, newPlayer.x + 5);
      }

      // Gravity
      newPlayer.velocityY += 0.8;
      newPlayer.y += newPlayer.velocityY;

      // Platform collision
      newPlayer.onGround = false;
      platforms.forEach(platform => {
        if (newPlayer.x < platform.x + platform.width &&
            newPlayer.x + 20 > platform.x &&
            newPlayer.y + 20 > platform.y &&
            newPlayer.y + 20 < platform.y + platform.height + 10 &&
            newPlayer.velocityY > 0) {
          newPlayer.y = platform.y - 20;
          newPlayer.velocityY = -15;
          newPlayer.onGround = true;
          
          setGameState(prev => ({ ...prev, score: prev.score + 10 }));
        }
      });

      // Game over condition
      if (newPlayer.y > canvas.height) {
        setGameState(prev => ({ ...prev, gameOver: true, isPlaying: false }));
        onGameEnd(gameState.score);
      }

      return newPlayer;
    });

    // Draw platforms
    ctx.fillStyle = '#00D9FF';
    platforms.forEach(platform => {
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw player
    ctx.fillStyle = '#FF6B35';
    ctx.fillRect(player.x, player.y, 20, 20);

    // Draw score
    ctx.fillStyle = '#00D9FF';
    ctx.font = '20px Orbitron';
    ctx.fillText(`Score: ${gameState.score}`, 10, 30);

  }, [gameState, player, platforms, keys, onGameEnd]);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.gameOver && !gameState.isPaused) {
      const interval = setInterval(gameLoop, 16);
      return () => clearInterval(interval);
    }
  }, [gameLoop, gameState]);

  return (
    <div className="text-center">
      <canvas
        ref={canvasRef}
        width={400}
        height={500}
        className="border-2 border-retro-electric mx-auto mb-4 bg-black"
      />
      <div className="space-y-2">
        {!gameState.isPlaying && !gameState.gameOver && (
          <Button onClick={startGame} className="bg-retro-orange hover:bg-retro-electric">
            СТАРТ
          </Button>
        )}
        {gameState.gameOver && (
          <div>
            <p className="text-retro-electric mb-2">Игра окончена! Счет: {gameState.score}</p>
            <Button onClick={startGame} className="bg-retro-orange hover:bg-retro-electric">
              ИГРАТЬ СНОВА
            </Button>
          </div>
        )}
        <p className="text-sm text-retro-electric/70">
          Используй ← → или A D для движения
        </p>
      </div>
    </div>
  );
};

export const SuperMarioGame = ({ onGameEnd }: { onGameEnd: (score: number) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    score: 0,
    gameOver: false,
    isPaused: false
  });

  const [player, setPlayer] = useState({ x: 50, y: 400, velocityY: 0, onGround: true });
  const [enemies, setEnemies] = useState([
    { x: 300, y: 420, direction: -1 },
    { x: 500, y: 420, direction: -1 }
  ]);
  const [coins, setCoins] = useState([
    { x: 200, y: 350, collected: false },
    { x: 400, y: 280, collected: false },
    { x: 600, y: 200, collected: false }
  ]);

  const startGame = () => {
    setGameState({ isPlaying: true, gameOver: false, isPaused: false, score: 0 });
    setPlayer({ x: 50, y: 400, velocityY: 0, onGround: true });
  };

  const gameLoop = useCallback(() => {
    if (!gameState.isPlaying || gameState.gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 450, canvas.width, 50);

    // Draw player (Mario)
    ctx.fillStyle = '#FF6B35';
    ctx.fillRect(player.x, player.y, 30, 30);

    // Draw enemies
    ctx.fillStyle = '#8A2BE2';
    enemies.forEach(enemy => {
      ctx.fillRect(enemy.x, enemy.y, 25, 25);
    });

    // Draw coins
    ctx.fillStyle = '#FFD700';
    coins.forEach(coin => {
      if (!coin.collected) {
        ctx.beginPath();
        ctx.arc(coin.x + 10, coin.y + 10, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw score
    ctx.fillStyle = '#00D9FF';
    ctx.font = '20px Orbitron';
    ctx.fillText(`Score: ${gameState.score}`, 10, 30);

  }, [gameState, player, enemies, coins]);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.gameOver) {
      const interval = setInterval(gameLoop, 16);
      return () => clearInterval(interval);
    }
  }, [gameLoop, gameState]);

  return (
    <div className="text-center">
      <canvas
        ref={canvasRef}
        width={400}
        height={500}
        className="border-2 border-retro-electric mx-auto mb-4 bg-black"
      />
      <div className="space-y-2">
        {!gameState.isPlaying && (
          <Button onClick={startGame} className="bg-retro-orange hover:bg-retro-electric">
            СТАРТ
          </Button>
        )}
        <p className="text-sm text-retro-electric/70">
          Собирай монеты и избегай врагов!
        </p>
      </div>
    </div>
  );
};

export const GeometryDashGame = ({ onGameEnd }: { onGameEnd: (score: number) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    score: 0,
    gameOver: false,
    isPaused: false
  });

  const [player, setPlayer] = useState({ x: 50, y: 400, velocityY: 0, rotation: 0 });
  const [obstacles, setObstacles] = useState([
    { x: 200, y: 420, width: 20, height: 80 },
    { x: 350, y: 400, width: 30, height: 100 },
    { x: 500, y: 430, width: 25, height: 70 }
  ]);

  const startGame = () => {
    setGameState({ isPlaying: true, gameOver: false, isPaused: false, score: 0 });
    setPlayer({ x: 50, y: 400, velocityY: 0, rotation: 0 });
  };

  const jump = () => {
    if (gameState.isPlaying && !gameState.gameOver) {
      setPlayer(prev => ({ ...prev, velocityY: -12 }));
    }
  };

  const gameLoop = useCallback(() => {
    if (!gameState.isPlaying || gameState.gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#FF6B35';
    ctx.fillRect(0, 450, canvas.width, 50);

    // Draw obstacles
    ctx.fillStyle = '#8A2BE2';
    obstacles.forEach(obstacle => {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Draw player (geometric shape)
    ctx.save();
    ctx.translate(player.x + 15, player.y + 15);
    ctx.rotate(player.rotation);
    ctx.fillStyle = '#00D9FF';
    ctx.fillRect(-15, -15, 30, 30);
    ctx.restore();

    // Draw score
    ctx.fillStyle = '#00D9FF';
    ctx.font = '20px Orbitron';
    ctx.fillText(`Distance: ${Math.floor(gameState.score)}`, 10, 30);

  }, [gameState, player, obstacles]);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.gameOver) {
      const interval = setInterval(gameLoop, 16);
      return () => clearInterval(interval);
    }
  }, [gameLoop, gameState]);

  return (
    <div className="text-center">
      <canvas
        ref={canvasRef}
        width={400}
        height={500}
        className="border-2 border-retro-electric mx-auto mb-4 bg-black"
        onClick={jump}
      />
      <div className="space-y-2">
        {!gameState.isPlaying && (
          <Button onClick={startGame} className="bg-retro-orange hover:bg-retro-electric">
            СТАРТ
          </Button>
        )}
        <p className="text-sm text-retro-electric/70">
          Кликай для прыжка и избегай препятствий!
        </p>
      </div>
    </div>
  );
};