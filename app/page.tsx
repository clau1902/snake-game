'use client';

import { useState, useEffect, useRef } from 'react';
import { useSnakeGame } from '@/hooks/useSnakeGame';
import { GameBoard } from '@/components/GameBoard';
import { ScoreBoard } from '@/components/ScoreBoard';
import { GameControls } from '@/components/GameControls';
import { MobileControls } from '@/components/MobileControls';

type Theme = 'classic' | 'neon' | 'synthwave';

const THEME_CONFIG: Record<Theme, { bg: string; filter: string; label: string }> = {
  classic:   { bg: '#09090b',        filter: 'none',                              label: 'Classic'   },
  neon:      { bg: '#020617',        filter: 'hue-rotate(60deg) saturate(1.3)',   label: 'Neon'      },
  synthwave: { bg: '#120a1e',        filter: 'hue-rotate(200deg) saturate(1.2)',  label: 'Synthwave' },
};

export default function Home() {
  const [isShaking, setIsShaking] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [theme, setTheme] = useState<Theme>('classic');
  const prevLevelRef = useRef(1);

  const {
    snake,
    food,
    score,
    level,
    status,
    highScore,
    wrapAround,
    countdown,
    scorePopups,
    direction,
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    changeDirection,
    toggleWrapAround,
  } = useSnakeGame();

  // Load persisted theme
  useEffect(() => {
    const stored = localStorage.getItem('snakeTheme') as Theme | null;
    if (stored && stored in THEME_CONFIG) setTheme(stored);
  }, []);

  const handleThemeChange = (t: Theme) => {
    setTheme(t);
    localStorage.setItem('snakeTheme', t);
  };

  // Screen shake on game over
  useEffect(() => {
    if (status !== 'gameover') return;
    setIsShaking(true);
    const t = setTimeout(() => setIsShaking(false), 500);
    return () => clearTimeout(t);
  }, [status]);

  // Level-up flash
  useEffect(() => {
    if (level > prevLevelRef.current && status === 'playing') {
      setShowLevelUp(true);
      const t = setTimeout(() => setShowLevelUp(false), 1200);
      prevLevelRef.current = level;
      return () => clearTimeout(t);
    }
    prevLevelRef.current = level;
  }, [level, status]);

  const { bg, filter } = THEME_CONFIG[theme];

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 gap-6 transition-colors duration-700"
      style={{ backgroundColor: bg }}
    >
      <h1
        className="text-2xl text-white tracking-widest"
        style={{ fontFamily: 'var(--font-press-start)', textShadow: '0 0 20px rgba(74,222,128,0.5)' }}
      >
        SNAKE
      </h1>

      <ScoreBoard
        score={score}
        highScore={highScore}
        level={level}
        isNewBest={score > highScore && status === 'playing'}
      />

      <div className={`relative w-full max-w-[500px]${isShaking ? ' animate-board-shake' : ''}`}>
        <GameBoard
          snake={snake}
          food={food}
          direction={direction}
          scorePopups={scorePopups}
          themeFilter={filter}
          onSwipe={changeDirection}
        />

        {status === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
            <p className="text-white text-xl">Press Start or Space to play</p>
          </div>
        )}

        {status === 'countdown' && countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
            <span
              key={countdown}
              className="text-white font-bold animate-countdown-pop"
              style={{ fontSize: '6rem', lineHeight: 1 }}
            >
              {countdown === 0 ? 'Go!' : countdown}
            </span>
          </div>
        )}

        {status === 'paused' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
            <p className="text-white text-xl">Paused</p>
          </div>
        )}

        {showLevelUp && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span key={level} className="text-yellow-300 text-4xl font-bold animate-level-up">
              Level {level}!
            </span>
          </div>
        )}

        {status === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-lg gap-2">
            <p className="text-red-500 text-2xl font-bold">Game Over!</p>
            <p className="text-white text-lg">Final Score: {score}</p>
          </div>
        )}
      </div>

      <GameControls
        status={status}
        wrapAround={wrapAround}
        onStart={startGame}
        onPause={pauseGame}
        onResume={resumeGame}
        onRestart={restartGame}
        onToggleWrap={toggleWrapAround}
      />

      <MobileControls onDirection={changeDirection} disabled={status !== 'playing'} />

      {/* Theme picker */}
      <div className="flex gap-2">
        {(Object.keys(THEME_CONFIG) as Theme[]).map(t => (
          <button
            key={t}
            onClick={() => handleThemeChange(t)}
            className={`px-3 py-1 rounded text-xs transition-all ${
              theme === t
                ? 'bg-white text-black font-semibold'
                : 'bg-white/10 text-zinc-400 hover:bg-white/20'
            }`}
          >
            {THEME_CONFIG[t].label}
          </button>
        ))}
      </div>

      <div className="hidden md:block text-zinc-500 text-sm text-center">
        <p>Use arrow keys to move</p>
        <p>Press Space to pause/resume</p>
      </div>
    </main>
  );
}
