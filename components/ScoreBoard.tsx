'use client';

import { Card, CardContent } from '@/components/ui/card';

const POINTS_PER_LEVEL = 50;

interface ScoreBoardProps {
  score: number;
  highScore: number;
  level: number;
  isNewBest: boolean;
}

export function ScoreBoard({ score, highScore, level, isNewBest }: ScoreBoardProps) {
  const progress = (score % POINTS_PER_LEVEL) / POINTS_PER_LEVEL;

  return (
    <div className="flex flex-col gap-2 w-full max-w-[500px]">
      <div className="flex gap-4">
        <Card className="flex-1 bg-zinc-900 border-zinc-700">
          <CardContent className="p-4">
            <p className="text-sm text-zinc-400">Score</p>
            <p className="text-3xl font-bold text-white">{score}</p>
          </CardContent>
        </Card>
        <Card className="flex-1 bg-zinc-900 border-zinc-700">
          <CardContent className="p-4">
            <p className="text-sm text-zinc-400">Level</p>
            <p className="text-3xl font-bold text-blue-400">{level}</p>
          </CardContent>
        </Card>
        <Card className="flex-1 bg-zinc-900 border-zinc-700">
          <CardContent className="p-4">
            <p className="text-sm text-zinc-400">
              {isNewBest ? (
                <span className="text-yellow-400 font-semibold animate-pulse">New Best!</span>
              ) : (
                'Best'
              )}
            </p>
            <p className="text-3xl font-bold text-yellow-400">
              {isNewBest ? score : highScore}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress toward next level */}
      <div className="w-full">
        <div className="flex justify-between text-xs text-zinc-500 mb-1">
          <span>Level {level}</span>
          <span>{score % POINTS_PER_LEVEL} / {POINTS_PER_LEVEL} pts to level {level + 1}</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-400 rounded-full transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
