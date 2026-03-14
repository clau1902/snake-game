'use client';

import { Position, GRID_SIZE } from '@/lib/game-utils';

interface GameBoardProps {
  snake: Position[];
  food: Position;
}

export function GameBoard({ snake, food }: GameBoardProps) {
  const snakeSet = new Set(snake.map(pos => `${pos.x},${pos.y}`));
  const headKey = `${snake[0].x},${snake[0].y}`;

  return (
    <div
      className="grid gap-px bg-zinc-800 p-2 rounded-lg border border-zinc-700"
      style={{
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        aspectRatio: '1 / 1',
        width: '100%',
        maxWidth: '500px',
      }}
    >
      {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
        const x = index % GRID_SIZE;
        const y = Math.floor(index / GRID_SIZE);
        const key = `${x},${y}`;
        const isSnake = snakeSet.has(key);
        const isHead = key === headKey;
        const isFood = food.x === x && food.y === y;

        return (
          <div
            key={key}
            className={`
              aspect-square rounded-sm transition-colors duration-75
              ${isHead ? 'bg-green-400' : ''}
              ${isSnake && !isHead ? 'bg-green-500' : ''}
              ${isFood ? 'bg-red-500' : ''}
              ${!isSnake && !isFood ? 'bg-zinc-900' : ''}
            `}
          />
        );
      })}
    </div>
  );
}
