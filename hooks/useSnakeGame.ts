'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Position,
  Direction,
  GameStatus,
  Difficulty,
  GRID_SIZE,
  DIFFICULTY_BASE_SPEED,
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
  points: number;
}

export interface LeaderboardEntry {
  score: number;
  date: string;
}

const HIGH_SCORE_KEY   = 'snakeHighScore';
const LEADERBOARD_KEY  = 'snakeLeaderboard';
const DIFFICULTY_KEY   = 'snakeDifficulty';
const STREAK_TIMEOUT_MS = 3000;
const MAX_MULTIPLIER    = 5;

function loadLeaderboard(): LeaderboardEntry[] {
  try { return JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]'); }
  catch { return []; }
}

function addToLeaderboard(score: number): LeaderboardEntry[] {
  const entries = loadLeaderboard();
  entries.push({ score, date: new Date().toLocaleDateString() });
  entries.sort((a, b) => b.score - a.score);
  const top5 = entries.slice(0, 5);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(top5));
  return top5;
}

export function useSnakeGame() {
  const [snake,        setSnake]        = useState<Position[]>(getInitialSnake);
  const [food,         setFood]         = useState<Position>({ x: GRID_SIZE - 1, y: 0 });
  const [direction,    setDirection]    = useState<Direction>('RIGHT');
  const [score,        setScore]        = useState(0);
  const [status,       setStatus]       = useState<GameStatus>('idle');
  const [highScore,    setHighScore]    = useState(0);
  const [prevHighScore,setPrevHighScore]= useState(0);
  const [wrapAround,   setWrapAround]   = useState(false);
  const [countdown,    setCountdown]    = useState<number | null>(null);
  const [scorePopups,  setScorePopups]  = useState<ScorePopup[]>([]);
  const [difficulty,   setDifficultyState] = useState<Difficulty>('normal');
  const [streak,       setStreak]       = useState(0);
  const [leaderboard,  setLeaderboard]  = useState<LeaderboardEntry[]>([]);

  const directionRef    = useRef<Direction>('RIGHT');
  const nextDirectionRef= useRef<Direction | null>(null);
  const scoreRef        = useRef(0);
  const wrapAroundRef   = useRef(false);
  const popupIdRef      = useRef(0);
  const streakRef       = useRef(0);
  const streakTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const level     = getLevel(score);
  const baseSpeed = DIFFICULTY_BASE_SPEED[difficulty];
  const gameSpeed = getGameSpeed(score, baseSpeed);

  // Mount: load persisted values
  useEffect(() => {
    setFood(generateFood(getInitialSnake()));

    const storedHS = localStorage.getItem(HIGH_SCORE_KEY);
    if (storedHS) setHighScore(parseInt(storedHS, 10));

    const storedDiff = localStorage.getItem(DIFFICULTY_KEY) as Difficulty | null;
    if (storedDiff && storedDiff in DIFFICULTY_BASE_SPEED) setDifficultyState(storedDiff);

    setLeaderboard(loadLeaderboard());
  }, []);

  useEffect(() => { localStorage.setItem(HIGH_SCORE_KEY, highScore.toString()); }, [highScore]);

  useEffect(() => { directionRef.current  = direction;   }, [direction]);
  useEffect(() => { scoreRef.current      = score;       }, [score]);
  useEffect(() => { wrapAroundRef.current = wrapAround;  }, [wrapAround]);

  // Auto-pause on tab switch
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) setStatus(s => s === 'playing' ? 'paused' : s);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Countdown tick
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      const t = setTimeout(() => { setStatus('playing'); setCountdown(null); }, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCountdown(prev => (prev ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Save to leaderboard on game over
  useEffect(() => {
    if (status !== 'gameover' || scoreRef.current === 0) return;
    const updated = addToLeaderboard(scoreRef.current);
    setLeaderboard(updated);
  }, [status]);

  const addScorePopup = useCallback((pos: Position, points: number) => {
    const id = popupIdRef.current++;
    setScorePopups(prev => [...prev, { id, x: pos.x, y: pos.y, points }]);
    setTimeout(() => setScorePopups(prev => prev.filter(p => p.id !== id)), 800);
  }, []);

  const setDifficulty = useCallback((d: Difficulty) => {
    if (status === 'playing' || status === 'countdown') return;
    setDifficultyState(d);
    localStorage.setItem(DIFFICULTY_KEY, d);
  }, [status]);

  const toggleWrapAround = useCallback(() => {
    if (status === 'playing' || status === 'countdown') return;
    setWrapAround(prev => !prev);
  }, [status]);

  const startGame = useCallback(() => {
    setHighScore(prev => {
      setPrevHighScore(prev);
      return prev;
    });
    const initialSnake = getInitialSnake();
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    nextDirectionRef.current = null;
    setScore(0);
    scoreRef.current = 0;
    setScorePopups([]);
    setStreak(0);
    streakRef.current = 0;
    if (streakTimerRef.current) clearTimeout(streakTimerRef.current);
    setStatus('countdown');
    setCountdown(3);
  }, []);

  const pauseGame  = useCallback(() => setStatus('paused'),   []);
  const resumeGame = useCallback(() => setStatus('playing'),  []);
  const restartGame = useCallback(() => startGame(),          [startGame]);

  // Grace period: check only against actual current direction, not queued one
  const changeDirection = useCallback((newDirection: Direction) => {
    if (status !== 'playing') return;
    if (!isOppositeDirection(directionRef.current, newDirection)) {
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
        // Streak multiplier
        streakRef.current++;
        setStreak(streakRef.current);
        const multiplier = Math.min(streakRef.current, MAX_MULTIPLIER);
        const points = 10 * multiplier;
        scoreRef.current += points;
        setScore(prev => prev + points);
        addScorePopup(food, points);

        if (streakTimerRef.current) clearTimeout(streakTimerRef.current);
        streakTimerRef.current = setTimeout(() => {
          streakRef.current = 0;
          setStreak(0);
        }, STREAK_TIMEOUT_MS);

        const grownSnake = growSnake(prevSnake, currentDirection);
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
        case 'ArrowUp':  case 'w': case 'W': e.preventDefault(); changeDirection('UP');    break;
        case 'ArrowDown':case 's': case 'S': e.preventDefault(); changeDirection('DOWN');  break;
        case 'ArrowLeft':case 'a': case 'A': e.preventDefault(); changeDirection('LEFT');  break;
        case 'ArrowRight':case 'd':case 'D': e.preventDefault(); changeDirection('RIGHT'); break;
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
    snake, food, direction, score, level, status,
    highScore, prevHighScore, wrapAround, countdown,
    scorePopups, difficulty, streak, leaderboard,
    gridSize: GRID_SIZE,
    startGame, pauseGame, resumeGame, restartGame,
    changeDirection, toggleWrapAround, setDifficulty,
  };
}
