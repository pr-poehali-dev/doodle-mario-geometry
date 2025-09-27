import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface GameControlsProps {
  onControlPress: (control: string) => void;
  onControlRelease: (control: string) => void;
  gameType: 'doodle' | 'mario' | 'geometry';
}

export const GameControls: React.FC<GameControlsProps> = ({ 
  onControlPress, 
  onControlRelease, 
  gameType 
}) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const handlePress = (control: string) => {
    if (!pressedKeys.has(control)) {
      setPressedKeys(prev => new Set([...prev, control]));
      onControlPress(control);
    }
  };

  const handleRelease = (control: string) => {
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(control);
      return newSet;
    });
    onControlRelease(control);
  };

  const ControlButton = ({ 
    control, 
    icon, 
    label, 
    className = "" 
  }: { 
    control: string; 
    icon: string; 
    label: string; 
    className?: string;
  }) => (
    <Button
      className={`
        w-16 h-16 rounded-full border-2 transition-all duration-150
        ${pressedKeys.has(control) 
          ? 'bg-retro-orange border-retro-orange scale-95 shadow-lg' 
          : 'bg-black/60 border-retro-electric hover:border-retro-orange hover:bg-retro-electric/20'
        }
        ${className}
      `}
      onMouseDown={() => handlePress(control)}
      onMouseUp={() => handleRelease(control)}
      onMouseLeave={() => handleRelease(control)}
      onTouchStart={() => handlePress(control)}
      onTouchEnd={() => handleRelease(control)}
    >
      <div className="flex flex-col items-center">
        <Icon name={icon as any} size={20} className="text-white" />
        <span className="text-xs text-white font-orbitron">{label}</span>
      </div>
    </Button>
  );

  if (gameType === 'doodle') {
    return (
      <div className="flex flex-col items-center gap-4 mt-4">
        <div className="text-retro-electric font-orbitron text-sm mb-2">УПРАВЛЕНИЕ</div>
        <div className="flex gap-4">
          <ControlButton control="left" icon="ArrowLeft" label="LEFT" />
          <ControlButton control="right" icon="ArrowRight" label="RIGHT" />
        </div>
        <div className="text-xs text-retro-electric/70 text-center">
          Или используй клавиши ← → A D
        </div>
      </div>
    );
  }

  if (gameType === 'mario') {
    return (
      <div className="flex flex-col items-center gap-4 mt-4">
        <div className="text-retro-electric font-orbitron text-sm mb-2">УПРАВЛЕНИЕ</div>
        <div className="flex flex-col gap-3">
          <div className="flex justify-center">
            <ControlButton control="up" icon="ArrowUp" label="JUMP" />
          </div>
          <div className="flex gap-4">
            <ControlButton control="left" icon="ArrowLeft" label="LEFT" />
            <ControlButton control="right" icon="ArrowRight" label="RIGHT" />
          </div>
        </div>
        <div className="text-xs text-retro-electric/70 text-center">
          Или используй ← → ↑ SPACE W A D
        </div>
      </div>
    );
  }

  if (gameType === 'geometry') {
    return (
      <div className="flex flex-col items-center gap-4 mt-4">
        <div className="text-retro-electric font-orbitron text-sm mb-2">УПРАВЛЕНИЕ</div>
        <div className="flex justify-center">
          <ControlButton 
            control="jump" 
            icon="ArrowUp" 
            label="JUMP" 
            className="w-20 h-20"
          />
        </div>
        <div className="text-xs text-retro-electric/70 text-center">
          Кликай по кнопке, экрану или SPACE ↑
        </div>
      </div>
    );
  }

  return null;
};

interface MusicPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  isPlaying,
  onToggle,
  volume,
  onVolumeChange
}) => {
  return (
    <div className="flex items-center gap-3 bg-black/60 border border-retro-electric/30 rounded-lg p-3">
      <div className="flex flex-col">
        <span className="text-retro-electric font-orbitron text-xs">NOW PLAYING</span>
        <span className="text-retro-orange text-sm font-bold">At The Speed of Light</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className={`border-retro-electric ${isPlaying ? 'bg-retro-orange' : 'hover:bg-retro-electric/20'}`}
          onClick={onToggle}
        >
          <Icon name={isPlaying ? "Pause" : "Play"} size={16} />
        </Button>
        
        <div className="flex items-center gap-2">
          <Icon name="Volume2" size={14} className="text-retro-electric" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-16 h-1 bg-retro-electric/30 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #00D9FF 0%, #00D9FF ${volume}%, #333 ${volume}%, #333 100%)`
            }}
          />
        </div>
      </div>
    </div>
  );
};