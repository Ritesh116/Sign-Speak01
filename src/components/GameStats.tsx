
import React from 'react';
import { GameCard } from './ui/game-card';
import { Trophy, Flame, Hand } from 'lucide-react';

interface GameStatsProps {
  points: number;
  streak: number;
  totalGestures: number;
}

export const GameStats: React.FC<GameStatsProps> = ({ points, streak, totalGestures }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      <GameCard variant="accent" padding="sm" className="flex flex-col items-center justify-center gap-1 text-center">
        <Trophy className="h-6 w-6 text-accent" />
        <span className="text-xl font-black text-foreground">{points}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">XP</span>
      </GameCard>
      
      <GameCard variant="primary" padding="sm" className="flex flex-col items-center justify-center gap-1 text-center">
        <Flame className="h-6 w-6 text-primary animate-pulse" />
        <span className="text-xl font-black text-foreground">{streak}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Streak</span>
      </GameCard>

      <GameCard variant="secondary" padding="sm" className="flex flex-col items-center justify-center gap-1 text-center">
        <Hand className="h-6 w-6 text-secondary" />
        <span className="text-xl font-black text-foreground">{totalGestures}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total</span>
      </GameCard>
    </div>
  );
};
