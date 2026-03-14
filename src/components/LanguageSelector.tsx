
import React from 'react';
import { LanguageCode, languages } from '../lib/languageUtils';
import { GameCard } from './ui/game-card';
import { cn } from './ui/game-button';

interface LanguageSelectorProps {
  selected: LanguageCode;
  onSelect: (code: LanguageCode) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selected, onSelect }) => {
  return (
    <GameCard className="flex flex-col gap-4">
      <h3 className="text-lg font-black text-foreground/80 uppercase tracking-tight">Language</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-2xl border-2 p-3 transition-all active:scale-95",
              selected === lang.code
                ? "border-primary bg-primary/10 shadow-game scale-105 z-10"
                : "border-border bg-white hover:border-primary/50 hover:bg-muted"
            )}
          >
            <span className="text-2xl">{lang.flag}</span>
            <span className={cn(
              "text-xs font-bold",
              selected === lang.code ? "text-primary" : "text-muted-foreground"
            )}>
              {lang.name}
            </span>
          </button>
        ))}
      </div>
    </GameCard>
  );
};
