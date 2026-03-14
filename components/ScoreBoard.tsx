'use client';

import { Card, CardContent } from '@/components/ui/card';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  level: number;
}

export function ScoreBoard({ score, highScore, level }: ScoreBoardProps) {
  return (
    <div className="flex gap-4 w-full max-w-[500px]">
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
          <p className="text-sm text-zinc-400">Best</p>
          <p className="text-3xl font-bold text-yellow-400">{highScore}</p>
        </CardContent>
      </Card>
    </div>
  );
}
