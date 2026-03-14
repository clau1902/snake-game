'use client';

import { Direction } from '@/lib/game-utils';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileControlsProps {
  onDirection: (direction: Direction) => void;
  disabled: boolean;
}

export function MobileControls({ onDirection, disabled }: MobileControlsProps) {
  const handle = (dir: Direction) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    onDirection(dir);
  };

  const btnClass = 'bg-zinc-800 border-zinc-600 text-white active:bg-zinc-600 h-12 w-12';

  return (
    <div className="grid grid-cols-3 gap-1 md:hidden">
      <div />
      <Button variant="outline" size="icon" disabled={disabled} onTouchStart={handle('UP')} onClick={handle('UP')} className={btnClass}>
        <ChevronUp className="h-5 w-5" />
      </Button>
      <div />
      <Button variant="outline" size="icon" disabled={disabled} onTouchStart={handle('LEFT')} onClick={handle('LEFT')} className={btnClass}>
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button variant="outline" size="icon" disabled={disabled} onTouchStart={handle('DOWN')} onClick={handle('DOWN')} className={btnClass}>
        <ChevronDown className="h-5 w-5" />
      </Button>
      <Button variant="outline" size="icon" disabled={disabled} onTouchStart={handle('RIGHT')} onClick={handle('RIGHT')} className={btnClass}>
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
