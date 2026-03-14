'use client';

import { useRef, useEffect } from 'react';
import { Position, Direction, GRID_SIZE } from '@/lib/game-utils';
import { ScorePopup } from '@/hooks/useSnakeGame';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  scorePopups: ScorePopup[];
  onSwipe: (direction: Direction) => void;
}

function getSnakeColor(index: number, total: number): string {
  if (index === 0) return '#4ade80'; // head — green-400
  const t = index / Math.max(total - 1, 1);
  const lightness = Math.round(45 - t * 20); // 45% → 25%
  return `hsl(142, 71%, ${lightness}%)`;
}

export function GameBoard({ snake, food, scorePopups, onSwipe }: GameBoardProps) {
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
      className="relative bg-zinc-900 p-2 rounded-lg border border-zinc-700"
      style={{ aspectRatio: '1 / 1', width: '100%', maxWidth: '500px' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="grid w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gap: '1px',
          backgroundImage:
            'linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)',
          backgroundSize: `calc(100% / ${GRID_SIZE}) calc(100% / ${GRID_SIZE})`,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          const key = `${x},${y}`;
          const snakeIndex = snakeMap.get(key);
          const isSnake = snakeIndex !== undefined;
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={key}
              className="aspect-square rounded-sm"
              style={
                isSnake
                  ? { backgroundColor: getSnakeColor(snakeIndex!, snake.length) }
                  : isFood
                  ? { backgroundColor: '#ef4444' }
                  : undefined
              }
            />
          );
        })}
      </div>

      {/* Score popups */}
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
