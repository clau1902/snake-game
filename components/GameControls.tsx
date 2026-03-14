'use client';

import { Button } from '@/components/ui/button';
import { GameStatus } from '@/lib/game-utils';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  status: GameStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
}

export function GameControls({
  status,
  onStart,
  onPause,
  onResume,
  onRestart,
}: GameControlsProps) {
  return (
    <div className="flex gap-3 w-full max-w-[500px]">
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
  );
}
