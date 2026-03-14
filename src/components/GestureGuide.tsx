
import React from 'react';
import { GestureType, gestureEmojis, gestureLabels } from '../lib/gestureDetection';
import { GameCard } from './ui/game-card';
import { CheckCircle2 } from 'lucide-react';
import { cn } from './ui/game-button';

interface GestureGuideProps {
  detectedSet: Set<GestureType>;
}

const guideItems: { type: Exclude<GestureType, 'none'>; desc: string }[] = [
  { type: 'hello', desc: 'Open palm with all fingers extended' },
  { type: 'hi', desc: 'Index and middle fingers extended (Peace)' },
  { type: 'i', desc: 'Only pinky finger extended' },
  { type: 'love', desc: 'Thumb and index extended (L-shape)' },
  { type: 'you', desc: 'Only index finger extended (Pointing)' },
];

export const GestureGuide: React.FC<GestureGuideProps> = ({ detectedSet }) => {
  return (
    <GameCard className="flex flex-col gap-4">
      <h3 className="text-lg font-black text-foreground/80 uppercase tracking-tight">Gesture Guide</h3>
      <div className="flex flex-col gap-2">
        {guideItems.map((item) => {
          const isDetected = detectedSet.has(item.type);
          return (
            <div
              key={item.type}
              className={cn(
                "flex items-center gap-4 rounded-2xl border-2 p-3 transition-all",
                isDetected 
                  ? "border-success bg-success/5" 
                  : "border-border bg-white"
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-3xl">
                {gestureEmojis[item.type]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-foreground">{gestureLabels[item.type]}</span>
                  {isDetected && <CheckCircle2 className="h-4 w-4 text-success" />}
                </div>
                <p className="text-xs font-medium text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </GameCard>
  );
};
