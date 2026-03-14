export const GRID_SIZE = 20;
export const INITIAL_SNAKE_LENGTH = 3;
export const GAME_SPEED = 150;

export type Position = {
  x: number;
  y: number;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameStatus = 'idle' | 'countdown' | 'playing' | 'paused' | 'gameover';

export function getInitialSnake(): Position[] {
  const startX = Math.floor(GRID_SIZE / 2);
  const startY = Math.floor(GRID_SIZE / 2);

  return Array.from({ length: INITIAL_SNAKE_LENGTH }, (_, i) => ({
    x: startX - i,
    y: startY,
  }));
}

export function generateFood(snake: Position[]): Position {
  const snakeSet = new Set(snake.map(pos => `${pos.x},${pos.y}`));

  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snakeSet.has(`${food.x},${food.y}`));

  return food;
}

export function moveSnake(snake: Position[], direction: Direction): Position[] {
  const head = snake[0];
  let newHead: Position;

  switch (direction) {
    case 'UP':
      newHead = { x: head.x, y: head.y - 1 };
      break;
    case 'DOWN':
      newHead = { x: head.x, y: head.y + 1 };
      break;
    case 'LEFT':
      newHead = { x: head.x - 1, y: head.y };
      break;
    case 'RIGHT':
      newHead = { x: head.x + 1, y: head.y };
      break;
  }

  return [newHead, ...snake.slice(0, -1)];
}

export function checkWallCollision(head: Position): boolean {
  return head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE;
}

export function checkSelfCollision(snake: Position[]): boolean {
  const head = snake[0];
  return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

export function checkFoodCollision(head: Position, food: Position): boolean {
  return head.x === food.x && head.y === food.y;
}

export function growSnake(snake: Position[], direction: Direction): Position[] {
  const head = snake[0];
  let newHead: Position;

  switch (direction) {
    case 'UP':
      newHead = { x: head.x, y: head.y - 1 };
      break;
    case 'DOWN':
      newHead = { x: head.x, y: head.y + 1 };
      break;
    case 'LEFT':
      newHead = { x: head.x - 1, y: head.y };
      break;
    case 'RIGHT':
      newHead = { x: head.x + 1, y: head.y };
      break;
  }

  return [newHead, ...snake];
}

export function isOppositeDirection(current: Direction, next: Direction): boolean {
  const opposites: Record<Direction, Direction> = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT',
  };
  return opposites[current] === next;
}

export function getLevel(score: number): number {
  return Math.floor(score / 50) + 1;
}

export function getGameSpeed(score: number): number {
  const level = getLevel(score);
  return Math.max(60, GAME_SPEED - (level - 1) * 15);
}

export function wrapPosition(pos: Position): Position {
  return {
    x: ((pos.x % GRID_SIZE) + GRID_SIZE) % GRID_SIZE,
    y: ((pos.y % GRID_SIZE) + GRID_SIZE) % GRID_SIZE,
  };
}
