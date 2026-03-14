'use client';

import { Button } from '@/components/ui/button';
import { GameStatus } from '@/lib/game-utils';
import { Play, Pause, RotateCcw, Repeat } from 'lucide-react';

interface GameControlsProps {
  status: GameStatus;
  wrapAround: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  onToggleWrap: () => void;
}

export function GameControls({
  status,
  wrapAround,
  onStart,
  onPause,
  onResume,
  onRestart,
  onToggleWrap,
}: GameControlsProps) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-[500px]">
      <div className="flex gap-3">
        {status === 'countdown' && (
          <div className="flex-1 h-11" />
        )}
        {status === 'idle' && (
          <Button onClick={onStart} className="flex-1" size="lg">
            <Play className="mr-2 h-4 w-4" />
            Start Game
          </Button>
        )}
        {status === 'playing' && (
          <Button onClick={onPause} className="flex-1" size="lg" variant="secondary">
            <Pause className="mr-2 h-4 w-4" />
            Pause
          </Button>
        )}
        {status === 'paused' && (
          <>
            <Button onClick={onResume} className="flex-1" size="lg">
              <Play className="mr-2 h-4 w-4" />
              Resume
            </Button>
            <Button onClick={onRestart} variant="outline" size="lg">
              <RotateCcw className="mr-2 h-4 w-4" />
              Restart
            </Button>
          </>
        )}
        {status === 'gameover' && (
          <Button onClick={onRestart} className="flex-1" size="lg">
            <RotateCcw className="mr-2 h-4 w-4" />
            Play Again
          </Button>
        )}
      </div>

      <Button
        onClick={onToggleWrap}
        disabled={status === 'playing' || status === 'countdown'}
        variant={wrapAround ? 'default' : 'outline'}
        size="sm"
        className="w-full"
      >
        <Repeat className="mr-2 h-3 w-3" />
        Wrap-around walls: {wrapAround ? 'ON' : 'OFF'}
      </Button>
    </div>
  );
}
