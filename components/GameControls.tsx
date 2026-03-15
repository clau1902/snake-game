'use client';

import { Button } from '@/components/ui/button';
import { Difficulty, GameStatus } from '@/lib/game-utils';
import { Play, Pause, RotateCcw, Repeat } from 'lucide-react';

interface GameControlsProps {
  status: GameStatus;
  wrapAround: boolean;
  difficulty: Difficulty;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  onToggleWrap: () => void;
  onSetDifficulty: (d: Difficulty) => void;
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy:   'Easy',
  normal: 'Normal',
  hard:   'Hard',
};

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="ml-2 text-xs px-1.5 py-0.5 rounded border border-zinc-600 bg-black/30 font-mono text-zinc-400 hidden sm:inline">
      {children}
    </kbd>
  );
}

export function GameControls({
  status, wrapAround, difficulty,
  onStart, onPause, onResume, onRestart, onToggleWrap, onSetDifficulty,
}: GameControlsProps) {
  const isActive = status === 'playing' || status === 'countdown';

  return (
    <div className="flex flex-col gap-2 w-full max-w-[500px]">
      <div className="flex gap-3">
        {status === 'countdown' && <div className="flex-1 h-11" />}

        {status === 'idle' && (
          <Button onClick={onStart} className="flex-1" size="lg">
            <Play className="mr-2 h-4 w-4" />
            Start Game
            <Kbd>Space</Kbd>
          </Button>
        )}
        {status === 'playing' && (
          <Button onClick={onPause} className="flex-1" size="lg" variant="secondary">
            <Pause className="mr-2 h-4 w-4" />
            Pause
            <Kbd>Space</Kbd>
          </Button>
        )}
        {status === 'paused' && (
          <>
            <Button onClick={onResume} className="flex-1" size="lg">
              <Play className="mr-2 h-4 w-4" />
              Resume
              <Kbd>Space</Kbd>
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
            <Kbd>Space</Kbd>
          </Button>
        )}
      </div>

      {/* Wrap-around toggle */}
      <Button
        onClick={onToggleWrap}
        disabled={isActive}
        variant={wrapAround ? 'default' : 'outline'}
        size="sm"
        className="w-full"
      >
        <Repeat className="mr-2 h-3 w-3" />
        Wrap-around walls: {wrapAround ? 'ON' : 'OFF'}
      </Button>

      {/* Difficulty selector */}
      <div className="flex gap-2 items-center">
        <span className="text-zinc-500 text-xs shrink-0">Difficulty:</span>
        {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map(d => (
          <Button
            key={d}
            onClick={() => onSetDifficulty(d)}
            disabled={isActive}
            variant={difficulty === d ? 'default' : 'outline'}
            size="sm"
            className="flex-1 text-xs"
          >
            {DIFFICULTY_LABELS[d]}
          </Button>
        ))}
      </div>
    </div>
  );
}
