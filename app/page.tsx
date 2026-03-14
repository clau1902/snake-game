'use client';

import { useSnakeGame } from '@/hooks/useSnakeGame';
import { GameBoard } from '@/components/GameBoard';
import { ScoreBoard } from '@/components/ScoreBoard';
import { GameControls } from '@/components/GameControls';

export default function Home() {
  const {
    snake,
    food,
    score,
    status,
    highScore,
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
  } = useSnakeGame();

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 gap-6">
      <h1 className="text-4xl font-bold text-white">Snake Game</h1>

      <ScoreBoard score={score} highScore={highScore} />

      <div className="relative w-full max-w-[500px]">
        <GameBoard snake={snake} food={food} />

        {status === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
            <p className="text-white text-xl">Press Start or Space to play</p>
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
        onStart={startGame}
        onPause={pauseGame}
        onResume={resumeGame}
        onRestart={restartGame}
      />

      <div className="text-zinc-500 text-sm text-center">
        <p>Use arrow keys to move</p>
        <p>Press Space to pause/resume</p>
      </div>
    </main>
  );
}
