
import React, { useState, useCallback } from 'react';
import { CameraFeed } from '../components/CameraFeed';
import { SentenceBuilder } from '../components/SentenceBuilder';
import { LanguageSelector } from '../components/LanguageSelector';
import { GestureGuide } from '../components/GestureGuide';
import { GameStats } from '../components/GameStats';
import { GameButton } from '../components/ui/game-button';
import { GestureType } from '../lib/gestureDetection';
import { LanguageCode } from '../lib/languageUtils';
import { Camera, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

const Index: React.FC = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectedGestures, setDetectedGestures] = useState<GestureType[]>([]);
  const [allDetectedGestures, setAllDetectedGestures] = useState<Set<GestureType>>(new Set());
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalGestures, setTotalGestures] = useState(0);

  const handleGestureDetected = useCallback((gesture: GestureType) => {
    setDetectedGestures(prev => [...prev, gesture]);
    setAllDetectedGestures(prev => new Set(prev).add(gesture));
    setTotalGestures(prev => prev + 1);
    
    // Points formula: +10 * (1 + Math.floor(streak / 5)) per gesture
    const newPoints = 10 * (1 + Math.floor(streak / 5));
    setPoints(prev => prev + newPoints);
    setStreak(prev => prev + 1);
  }, [streak]);

  const clearGestures = () => {
    setDetectedGestures([]);
    setStreak(0);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-game">
              <span className="text-2xl">🤟</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              SignSpeak
            </h1>
          </div>
          
          <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2 shadow-game border-2 border-border">
            <Trophy className="h-5 w-5 text-accent" />
            <span className="font-black text-foreground">{points} XP</span>
          </div>
        </header>

        <main className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Camera + Sentence Builder */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            <div className="relative">
              <CameraFeed 
                isActive={isCameraActive} 
                onGestureDetected={handleGestureDetected} 
              />
              
              {!isCameraActive && (
                <div className="absolute inset-0 flex items-center justify-center rounded-3xl border-4 border-dashed border-border bg-muted/30">
                  <motion.div 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
                  >
                    <GameButton 
                      size="lg" 
                      onClick={() => setIsCameraActive(true)}
                      className="animate-pulse-glow"
                    >
                      <Camera className="mr-2 h-6 w-6" />
                      Start Learning
                    </GameButton>
                  </motion.div>
                </div>
              )}
            </div>

            <SentenceBuilder 
              gestures={detectedGestures} 
              onClear={clearGestures} 
              languageCode={selectedLanguage} 
            />
          </div>

          {/* Right Column: Stats + Language + Guide */}
          <div className="flex flex-col gap-8">
            <GameStats 
              points={points} 
              streak={streak} 
              totalGestures={totalGestures} 
            />
            
            <LanguageSelector 
              selected={selectedLanguage} 
              onSelect={setSelectedLanguage} 
            />
            
            <GestureGuide 
              detectedSet={allDetectedGestures} 
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
