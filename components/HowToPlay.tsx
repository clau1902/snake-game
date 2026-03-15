'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function HowToPlay() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('snakeHasVisited')) setShow(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem('snakeHasVisited', '1');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-sm w-full">
        <h2 className="text-white text-xl font-bold mb-4">How to Play</h2>
        <ul className="text-zinc-300 text-sm space-y-2.5 mb-6">
          <li><span className="text-white font-medium">Move</span> — Arrow keys or WASD (desktop) · Swipe the board (mobile)</li>
          <li><span className="text-white font-medium">Pause</span> — Space bar · auto-pauses when you switch tabs</li>
          <li><span className="text-white font-medium">Levels</span> — Speed increases every 50 points</li>
          <li><span className="text-white font-medium">Streak</span> — Eat food quickly for a multiplier (up to ×5)</li>
          <li><span className="text-white font-medium">Wrap-around</span> — Toggle to pass through walls instead of dying</li>
          <li><span className="text-white font-medium">Difficulty</span> — Sets your starting speed</li>
          <li><span className="text-white font-medium">Themes</span> — Classic · Neon · Synthwave</li>
        </ul>
        <Button onClick={dismiss} className="w-full">Let's Play!</Button>
      </div>
    </div>
  );
}
