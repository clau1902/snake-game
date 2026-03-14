import {
  getInitialSnake,
  generateFood,
  moveSnake,
  growSnake,
  checkWallCollision,
  checkSelfCollision,
  checkFoodCollision,
  isOppositeDirection,
  GRID_SIZE,
  INITIAL_SNAKE_LENGTH,
  Position,
  Direction,
} from '@/lib/game-utils';

describe('Game Utils', () => {
  describe('getInitialSnake', () => {
    it('returns snake with correct initial length', () => {
      const snake = getInitialSnake();
      expect(snake).toHaveLength(INITIAL_SNAKE_LENGTH);
    });

    it('returns snake positioned in center of grid', () => {
      const snake = getInitialSnake();
      const centerX = Math.floor(GRID_SIZE / 2);
      const centerY = Math.floor(GRID_SIZE / 2);
      expect(snake[0].x).toBe(centerX);
      expect(snake[0].y).toBe(centerY);
    });

    it('returns snake segments in a horizontal line', () => {
      const snake = getInitialSnake();
      const headY = snake[0].y;
      expect(snake.every(segment => segment.y === headY)).toBe(true);
    });
  });

  describe('generateFood', () => {
    it('returns food position within grid bounds', () => {
      const snake = getInitialSnake();
      const food = generateFood(snake);
      expect(food.x).toBeGreaterThanOrEqual(0);
      expect(food.x).toBeLessThan(GRID_SIZE);
      expect(food.y).toBeGreaterThanOrEqual(0);
      expect(food.y).toBeLessThan(GRID_SIZE);
    });

    it('returns food position not overlapping with snake', () => {
      const snake = getInitialSnake();
      const food = generateFood(snake);
      const overlaps = snake.some(
        segment => segment.x === food.x && segment.y === food.y
      );
      expect(overlaps).toBe(false);
    });
  });

  describe('moveSnake', () => {
    const createSnake = (): Position[] => [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ];

    it('moves snake up', () => {
      const snake = createSnake();
      const moved = moveSnake(snake, 'UP');
      expect(moved[0]).toEqual({ x: 5, y: 4 });
      expect(moved).toHaveLength(snake.length);
    });

    it('moves snake down', () => {
      const snake = createSnake();
      const moved = moveSnake(snake, 'DOWN');
      expect(moved[0]).toEqual({ x: 5, y: 6 });
    });

    it('moves snake left', () => {
      const snake = createSnake();
      const moved = moveSnake(snake, 'LEFT');
      expect(moved[0]).toEqual({ x: 4, y: 5 });
    });

    it('moves snake right', () => {
      const snake = createSnake();
      const moved = moveSnake(snake, 'RIGHT');
      expect(moved[0]).toEqual({ x: 6, y: 5 });
    });

    it('maintains snake length after move', () => {
      const snake = createSnake();
      const moved = moveSnake(snake, 'RIGHT');
      expect(moved).toHaveLength(snake.length);
    });
  });

  describe('growSnake', () => {
    it('increases snake length by 1', () => {
      const snake: Position[] = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
      ];
      const grown = growSnake(snake, 'RIGHT');
      expect(grown).toHaveLength(snake.length + 1);
    });

    it('adds new head in correct direction', () => {
      const snake: Position[] = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
      ];
      const grown = growSnake(snake, 'RIGHT');
      expect(grown[0]).toEqual({ x: 6, y: 5 });
    });

    it('preserves all original segments', () => {
      const snake: Position[] = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
      ];
      const grown = growSnake(snake, 'RIGHT');
      expect(grown.slice(1)).toEqual(snake);
    });
  });

  describe('checkWallCollision', () => {
    it('returns true when head is past left wall', () => {
      expect(checkWallCollision({ x: -1, y: 5 })).toBe(true);
    });

    it('returns true when head is past right wall', () => {
      expect(checkWallCollision({ x: GRID_SIZE, y: 5 })).toBe(true);
    });

    it('returns true when head is past top wall', () => {
      expect(checkWallCollision({ x: 5, y: -1 })).toBe(true);
    });

    it('returns true when head is past bottom wall', () => {
      expect(checkWallCollision({ x: 5, y: GRID_SIZE })).toBe(true);
    });

    it('returns false when head is within bounds', () => {
      expect(checkWallCollision({ x: 5, y: 5 })).toBe(false);
    });

    it('returns false at grid edges', () => {
      expect(checkWallCollision({ x: 0, y: 0 })).toBe(false);
      expect(checkWallCollision({ x: GRID_SIZE - 1, y: GRID_SIZE - 1 })).toBe(false);
    });
  });

  describe('checkSelfCollision', () => {
    it('returns true when head collides with body', () => {
      const snake: Position[] = [
        { x: 5, y: 5 },
        { x: 6, y: 5 },
        { x: 6, y: 6 },
        { x: 5, y: 6 },
        { x: 5, y: 5 }, // Collision
      ];
      expect(checkSelfCollision(snake)).toBe(true);
    });

    it('returns false when no collision', () => {
      const snake: Position[] = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 },
      ];
      expect(checkSelfCollision(snake)).toBe(false);
    });
  });

  describe('checkFoodCollision', () => {
    it('returns true when head is at food position', () => {
      const head: Position = { x: 5, y: 5 };
      const food: Position = { x: 5, y: 5 };
      expect(checkFoodCollision(head, food)).toBe(true);
    });

    it('returns false when head is not at food position', () => {
      const head: Position = { x: 5, y: 5 };
      const food: Position = { x: 6, y: 5 };
      expect(checkFoodCollision(head, food)).toBe(false);
    });
  });

  describe('isOppositeDirection', () => {
    it('UP and DOWN are opposites', () => {
      expect(isOppositeDirection('UP', 'DOWN')).toBe(true);
      expect(isOppositeDirection('DOWN', 'UP')).toBe(true);
    });

    it('LEFT and RIGHT are opposites', () => {
      expect(isOppositeDirection('LEFT', 'RIGHT')).toBe(true);
      expect(isOppositeDirection('RIGHT', 'LEFT')).toBe(true);
    });

    it('perpendicular directions are not opposites', () => {
      expect(isOppositeDirection('UP', 'LEFT')).toBe(false);
      expect(isOppositeDirection('UP', 'RIGHT')).toBe(false);
      expect(isOppositeDirection('DOWN', 'LEFT')).toBe(false);
      expect(isOppositeDirection('DOWN', 'RIGHT')).toBe(false);
    });

    it('same direction is not opposite', () => {
      const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
      directions.forEach(dir => {
        expect(isOppositeDirection(dir, dir)).toBe(false);
      });
    });
  });
});
