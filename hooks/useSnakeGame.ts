'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Position,
  Direction,
  GameStatus,
  GRID_SIZE,
  getGameSpeed,
  getLevel,
  getInitialSnake,
  generateFood,
  moveSnake,
  growSnake,
  checkWallCollision,
  checkSelfCollision,
  checkFoodCollision,
  isOppositeDirection,
  wrapPosition,
} from '@/lib/game-utils';

export interface ScorePopup {
  id: number;
  x: number;
  y: number;
}

const HIGH_SCORE_KEY = 'snakeHighScore';

export function useSnakeGame() {
  const [snake, setSnake] = useState<Position[]>(getInitialSnake);
  const [food, setFood] = useState<Position>({ x: GRID_SIZE - 1, y: 0 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [highScore, setHighScore] = useState(0);
  const [wrapAround, setWrapAround] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);

  const directionRef = useRef<Direction>(direction);
  const nextDirectionRef = useRef<Direction | null>(null);
  const scoreRef = useRef(0);
  const wrapAroundRef = useRef(false);
  const popupIdRef = useRef(0);

  const level = getLevel(score);
  const gameSpeed = getGameSpeed(score);

  // Load persisted high score and initial food on mount
  useEffect(() => {
    setFood(generateFood(getInitialSnake()));
    const stored = localStorage.getItem(HIGH_SCORE_KEY);
    if (stored) setHighScore(parseInt(stored, 10));
  }, []);

  // Persist high score whenever it changes
  useEffect(() => {
    localStorage.setItem(HIGH_SCORE_KEY, highScore.toString());
  }, [highScore]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    wrapAroundRef.current = wrapAround;
  }, [wrapAround]);

  // Countdown tick: decrement every second, start game when it hits 0
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      const t = setTimeout(() => {
        setStatus('playing');
        setCountdown(null);
      }, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCountdown(prev => (prev ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const addScorePopup = useCallback((pos: Position) => {
    const id = popupIdRef.current++;
    setScorePopups(prev => [...prev, { id, x: pos.x, y: pos.y }]);
    setTimeout(() => {
      setScorePopups(prev => prev.filter(p => p.id !== id));
    }, 800);
  }, []);

  const toggleWrapAround = useCallback(() => {
    if (status === 'playing' || status === 'countdown') return;
    setWrapAround(prev => !prev);
  }, [status]);

  const startGame = useCallback(() => {
    const initialSnake = getInitialSnake();
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    nextDirectionRef.current = null;
    setScore(0);
    scoreRef.current = 0;
    setScorePopups([]);
    setStatus('countdown');
    setCountdown(3);
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
      let newHead = moveSnake(prevSnake, currentDirection)[0];

      if (wrapAroundRef.current) {
        newHead = wrapPosition(newHead);
      } else if (checkWallCollision(newHead)) {
        setStatus('gameover');
        setHighScore(prev => Math.max(prev, scoreRef.current));
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake.slice(0, -1)];

      if (checkSelfCollision(newSnake)) {
        setStatus('gameover');
        setHighScore(prev => Math.max(prev, scoreRef.current));
        return prevSnake;
      }

      if (checkFoodCollision(newHead, food)) {
        const grownSnake = growSnake(prevSnake, currentDirection);
        setScore(prev => prev + 10);
        addScorePopup(food);
        setFood(generateFood(grownSnake));
        return grownSnake;
      }

      return newSnake;
    });
  }, [status, food, addScorePopup]);

  useEffect(() => {
    if (status !== 'playing') return;
    const interval = setInterval(gameTick, gameSpeed);
    return () => clearInterval(interval);
  }, [status, gameTick, gameSpeed]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status === 'gameover' || status === 'countdown') return;

      switch (e.key) {
        case 'ArrowUp':    e.preventDefault(); changeDirection('UP');    break;
        case 'ArrowDown':  e.preventDefault(); changeDirection('DOWN');  break;
        case 'ArrowLeft':  e.preventDefault(); changeDirection('LEFT');  break;
        case 'ArrowRight': e.preventDefault(); changeDirection('RIGHT'); break;
        case ' ':
          e.preventDefault();
          if (status === 'idle')    startGame();
          else if (status === 'playing') pauseGame();
          else if (status === 'paused')  resumeGame();
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
    level,
    status,
    highScore,
    wrapAround,
    countdown,
    scorePopups,
    gridSize: GRID_SIZE,
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    changeDirection,
    toggleWrapAround,
  };
}
