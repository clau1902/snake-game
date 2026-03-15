'use client';

import { useRef, useEffect } from 'react';
import { Position, Direction, GRID_SIZE } from '@/lib/game-utils';
import { ScorePopup } from '@/hooks/useSnakeGame';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  direction: Direction;
  scorePopups: ScorePopup[];
  themeFilter: string;
  onSwipe: (direction: Direction) => void;
}

function getSnakeColor(index: number, total: number): string {
  if (index === 0) return '#4ade80';
  const t = index / Math.max(total - 1, 1);
  const lightness = Math.round(45 - t * 20);
  return `hsl(142, 71%, ${lightness}%)`;
}

const eyesByDirection: Record<Direction, Array<{ left: string; top: string }>> = {
  RIGHT: [{ left: '62%', top: '18%' }, { left: '62%', top: '58%' }],
  LEFT:  [{ left: '18%', top: '18%' }, { left: '18%', top: '58%' }],
  UP:    [{ left: '18%', top: '18%' }, { left: '58%', top: '18%' }],
  DOWN:  [{ left: '18%', top: '62%' }, { left: '58%', top: '62%' }],
};

export function GameBoard({ snake, food, direction, scorePopups, themeFilter, onSwipe }: GameBoardProps) {
  const snakeMap = new Map(snake.map((pos, i) => [`${pos.x},${pos.y}`, i]));
  const boardRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Prevent page scroll when touching the board
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const prevent = (e: TouchEvent) => e.preventDefault();
    el.addEventListener('touchmove', prevent, { passive: false });
    return () => el.removeEventListener('touchmove', prevent);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (Math.max(absDx, absDy) >= 20) {
      onSwipe(absDx > absDy ? (dx > 0 ? 'RIGHT' : 'LEFT') : (dy > 0 ? 'DOWN' : 'UP'));
    }
    touchStartRef.current = null;
  };

  return (
    <div
      ref={boardRef}
      className="relative rounded-lg border border-zinc-700 overflow-hidden"
      style={{
        aspectRatio: '1 / 1',
        width: '100%',
        maxWidth: '500px',
        background: '#0f0f11',
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.9)',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Game grid */}
      <div
        className="grid w-full h-full p-2"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gap: '1px',
          backgroundImage:
            'linear-gradient(to right, #1f1f23 1px, transparent 1px), linear-gradient(to bottom, #1f1f23 1px, transparent 1px)',
          backgroundSize: `calc(100% / ${GRID_SIZE}) calc(100% / ${GRID_SIZE})`,
          filter: themeFilter,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          const key = `${x},${y}`;
          const snakeIndex = snakeMap.get(key);
          const isSnake = snakeIndex !== undefined;
          const isHead = snakeIndex === 0;
          const isFood = food.x === x && food.y === y;

          if (isHead) {
            const eyes = eyesByDirection[direction];
            return (
              <div
                key={key}
                className="aspect-square rounded-sm relative overflow-hidden"
                style={{ backgroundColor: getSnakeColor(0, snake.length) }}
              >
                {eyes.map((eye, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: '22%',
                      height: '22%',
                      left: eye.left,
                      top: eye.top,
                      backgroundColor: '#052e16',
                    }}
                  />
                ))}
              </div>
            );
          }

          return (
            <div
              key={key}
              className={`aspect-square rounded-sm${isFood ? ' animate-food-pulse' : ''}`}
              style={
                isSnake
                  ? { backgroundColor: getSnakeColor(snakeIndex!, snake.length) }
                  : isFood
                  ? {
                      backgroundColor: '#ef4444',
                      borderRadius: '50%',
                      boxShadow: '0 0 8px 2px rgba(239,68,68,0.65), 0 0 0 2px rgba(255,255,255,0.4)',
                    }
                  : undefined
              }
            />
          );
        })}
      </div>

      {/* CRT scanline overlay */}
      <div className="crt-scanlines absolute inset-0" />

      {/* Score popups — outside the filtered grid so colours stay white/yellow */}
      {scorePopups.map(popup => (
        <div
          key={popup.id}
          className="absolute pointer-events-none text-yellow-300 font-bold text-sm animate-float-up"
          style={{
            left: `${((popup.x + 0.5) / GRID_SIZE) * 100}%`,
            top: `${(popup.y / GRID_SIZE) * 100}%`,
          }}
        >
          +10
        </div>
      ))}
    </div>
  );
}
