'use client';

import { Position, GRID_SIZE } from '@/lib/game-utils';

interface GameBoardProps {
  snake: Position[];
  food: Position;
}

function getSnakeColor(index: number, total: number): string {
  if (index === 0) return '#4ade80'; // head — green-400
  const t = index / Math.max(total - 1, 1);
  const lightness = Math.round(45 - t * 20); // 45% → 25%
  return `hsl(142, 71%, ${lightness}%)`;
}

export function GameBoard({ snake, food }: GameBoardProps) {
  const snakeMap = new Map(snake.map((pos, i) => [`${pos.x},${pos.y}`, i]));

  return (
    <div
      className="grid bg-zinc-900 p-2 rounded-lg border border-zinc-700"
      style={{
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        aspectRatio: '1 / 1',
        width: '100%',
        maxWidth: '500px',
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
  );
}
