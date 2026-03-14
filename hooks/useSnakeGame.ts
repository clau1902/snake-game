'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Position,
  Direction,
  GameStatus,
  GRID_SIZE,
  GAME_SPEED,
  getInitialSnake,
  generateFood,
  moveSnake,
  growSnake,
  checkWallCollision,
  checkSelfCollision,
  checkFoodCollision,
  isOppositeDirection,
} from '@/lib/game-utils';

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  score: number;
  status: GameStatus;
  highScore: number;
}

export function useSnakeGame() {
  const [snake, setSnake] = useState<Position[]>(getInitialSnake);
  const [food, setFood] = useState<Position>({ x: GRID_SIZE - 1, y: 0 });

  useEffect(() => {
    setFood(generateFood(getInitialSnake()));
  }, []);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [highScore, setHighScore] = useState(0);

  const directionRef = useRef<Direction>(direction);
  const nextDirectionRef = useRef<Direction | null>(null);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const startGame = useCallback(() => {
    const initialSnake = getInitialSnake();
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    nextDirectionRef.current = null;
    setScore(0);
    setStatus('playing');
  }, []);

  const pauseGame = useCallback(() => {
    setStatus('paused');
  }, []);

  const resumeGame = useCallback(() => {
    setStatus('playing');
  }, []);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const changeDirection = useCallback((newDirection: Direction) => {
    if (status !== 'playing') return;

    const currentDirection = nextDirectionRef.current ?? directionRef.current;

    if (!isOppositeDirection(currentDirection, newDirection)) {
      nextDirectionRef.current = newDirection;
    }
  }, [status]);

  const gameTick = useCallback(() => {
    if (status !== 'playing') return;

    const currentDirection = nextDirectionRef.current ?? directionRef.current;
    if (nextDirectionRef.current) {
      setDirection(nextDirectionRef.current);
      nextDirectionRef.current = null;
    }

    setSnake(prevSnake => {
      const newHead = moveSnake(prevSnake, currentDirection)[0];

      if (checkWallCollision(newHead)) {
        setStatus('gameover');
        setHighScore(prev => Math.max(prev, score));
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake.slice(0, -1)];

      if (checkSelfCollision(newSnake)) {
        setStatus('gameover');
        setHighScore(prev => Math.max(prev, score));
        return prevSnake;
      }

      if (checkFoodCollision(newHead, food)) {
        const grownSnake = growSnake(prevSnake, currentDirection);
        setScore(prev => prev + 10);
        setFood(generateFood(grownSnake));
        return grownSnake;
      }

      return newSnake;
    });
  }, [status, food, score]);

  useEffect(() => {
    if (status !== 'playing') return;

    const interval = setInterval(gameTick, GAME_SPEED);
    return () => clearInterval(interval);
  }, [status, gameTick]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status === 'gameover') return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          changeDirection('UP');
          break;
        case 'ArrowDown':
          e.preventDefault();
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
          e.preventDefault();
          changeDirection('RIGHT');
          break;
        case ' ':
          e.preventDefault();
          if (status === 'idle') {
            startGame();
          } else if (status === 'playing') {
            pauseGame();
          } else if (status === 'paused') {
            resumeGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, changeDirection, startGame, pauseGame, resumeGame]);

  return {
    snake,
    food,
    direction,
    score,
    status,
    highScore,
    gridSize: GRID_SIZE,
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    changeDirection,
  };
}
