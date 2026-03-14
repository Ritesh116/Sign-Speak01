
import React from 'react';
import { GestureType, gestureEmojis, gestureLabels } from '../lib/gestureDetection';
import { GameCard } from './ui/game-card';
import { GameButton } from './ui/game-button';
import { Trash2, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageCode, constructSentence, speakText } from '../lib/languageUtils';

interface SentenceBuilderProps {
  gestures: GestureType[];
  onClear: () => void;
  languageCode: LanguageCode;
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({ gestures, onClear, languageCode }) => {
  const sentence = constructSentence(gestures, languageCode);

  return (
    <GameCard className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-foreground/80 uppercase tracking-tight">Your Sentence</h3>
        <GameButton variant="ghost" size="sm" onClick={onClear} disabled={gestures.length === 0}>
          <Trash2 className="mr-2 h-4 w-4" />
          Clear
        </GameButton>
      </div>

      <div className="flex min-h-[80px] flex-wrap gap-2 rounded-2xl bg-muted/50 p-4 shadow-inner-game">
        <AnimatePresence mode="popLayout">
          {gestures.map((gesture, index) => (
            <motion.div
              key={`${gesture}-${index}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              layout
              className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-game border border-border"
            >
              <span className="text-xl">{gestureEmojis[gesture]}</span>
              <span className="font-bold text-foreground/70">{gestureLabels[gesture]}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {gestures.length === 0 && (
          <p className="flex w-full items-center justify-center text-sm font-medium text-muted-foreground">
            Start signing to build a sentence!
          </p>
        )}
      </div>

      {sentence && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between rounded-2xl bg-success/10 p-4 border-2 border-success/20"
        >
          <p className="text-xl font-bold text-success">{sentence}</p>
          <GameButton
            variant="success"
            size="icon"
            onClick={() => speakText(sentence, languageCode)}
          >
            <Volume2 className="h-6 w-6" />
          </GameButton>
        </motion.div>
      )}
    </GameCard>
  );
};
