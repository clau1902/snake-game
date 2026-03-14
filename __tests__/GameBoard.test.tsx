import { render, screen } from '@testing-library/react';
import { GameBoard } from '@/components/GameBoard';
import { Position, GRID_SIZE } from '@/lib/game-utils';

describe('GameBoard', () => {
  const defaultSnake: Position[] = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ];

  const defaultFood: Position = { x: 10, y: 10 };

  it('renders the correct number of cells', () => {
    const { container } = render(
      <GameBoard snake={defaultSnake} food={defaultFood} />
    );

    const cells = container.querySelectorAll('.aspect-square');
    expect(cells).toHaveLength(GRID_SIZE * GRID_SIZE);
  });

  it('renders snake cells with green color', () => {
    const { container } = render(
      <GameBoard snake={defaultSnake} food={defaultFood} />
    );

    const greenCells = container.querySelectorAll('.bg-green-500, .bg-green-400');
    expect(greenCells.length).toBe(defaultSnake.length);
  });

  it('renders food cell with red color', () => {
    const { container } = render(
      <GameBoard snake={defaultSnake} food={defaultFood} />
    );

    const redCells = container.querySelectorAll('.bg-red-500');
    expect(redCells).toHaveLength(1);
  });

  it('renders head with different color than body', () => {
    const { container } = render(
      <GameBoard snake={defaultSnake} food={defaultFood} />
    );

    const headCells = container.querySelectorAll('.bg-green-400');
    expect(headCells).toHaveLength(1);
  });

  it('renders empty cells for non-snake, non-food positions', () => {
    const { container } = render(
      <GameBoard snake={defaultSnake} food={defaultFood} />
    );

    const emptyCells = container.querySelectorAll('.bg-zinc-900');
    const expectedEmpty = GRID_SIZE * GRID_SIZE - defaultSnake.length - 1;
    expect(emptyCells).toHaveLength(expectedEmpty);
  });
});
