'use client';

import { useSnakeGame } from '@/hooks/useSnakeGame';
import { GameBoard } from '@/components/GameBoard';
import { ScoreBoard } from '@/components/ScoreBoard';
import { GameControls } from '@/components/GameControls';
import { MobileControls } from '@/components/MobileControls';

export default function Home() {
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
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    changeDirection,
    toggleWrapAround,
  } = useSnakeGame();

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 gap-6">
      <h1 className="text-4xl font-bold text-white">Snake Game</h1>

      <ScoreBoard score={score} highScore={highScore} level={level} />

      <div className="relative w-full max-w-[500px]">
        <GameBoard
          snake={snake}
          food={food}
          scorePopups={scorePopups}
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

      <div className="hidden md:block text-zinc-500 text-sm text-center">
        <p>Use arrow keys to move</p>
        <p>Press Space to pause/resume</p>
      </div>
    </main>
  );
}
