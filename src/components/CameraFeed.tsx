
import React, { useEffect, useRef, useState } from 'react';
import { detectGesture, GestureType, gestureEmojis } from '../lib/gestureDetection';
import { GameCard } from './ui/game-card';
import { GameButton } from './ui/game-button';
import { Loader2, CameraOff, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CameraFeedProps {
  onGestureDetected: (gesture: GestureType) => void;
  isActive: boolean;
}

declare global {
  interface Window {
    Hands: any;
    Camera: any;
    drawConnectors: any;
    drawLandmarks: any;
    HAND_CONNECTIONS: any;
  }
}

const loadScript = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${url}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
    document.head.appendChild(script);
  });
};

export const CameraFeed: React.FC<CameraFeedProps> = ({ onGestureDetected, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentGesture, setCurrentGesture] = useState<GestureType>('none');
  const lastGestureTime = useRef<number>(0);
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    const initMediaPipe = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await Promise.all([
          loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js'),
          loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js'),
          loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js'),
        ]);

        if (!isMounted) return;

        const hands = new window.Hands({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.5,
        });

        hands.onResults((results: any) => {
          if (!isMounted || !canvasRef.current || !videoRef.current) return;

          const canvasCtx = canvasRef.current.getContext('2d');
          if (!canvasCtx) return;

          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            
            // Draw skeleton
            window.drawConnectors(canvasCtx, landmarks, window.HAND_CONNECTIONS, {
              color: '#2ea397', // secondary
              lineWidth: 5,
            });
            window.drawLandmarks(canvasCtx, landmarks, {
              color: '#ff7f50', // primary
              lineWidth: 2,
              radius: 4,
            });

            // Detect gesture
            const gesture = detectGesture(landmarks);
            if (gesture !== 'none') {
              const now = Date.now();
              if (now - lastGestureTime.current > 800) {
                setCurrentGesture(gesture);
                onGestureDetected(gesture);
                lastGestureTime.current = now;
                
                // Reset visual gesture after a bit
                setTimeout(() => {
                  if (isMounted) setCurrentGesture('none');
                }, 1500);
              }
            }
          }
          canvasCtx.restore();
        });

        handsRef.current = hands;

        if (videoRef.current) {
          const camera = new window.Camera(videoRef.current, {
            onFrame: async () => {
              if (handsRef.current && videoRef.current) {
                await handsRef.current.send({ image: videoRef.current });
              }
            },
            width: 640,
            height: 480,
          });
          cameraRef.current = camera;
          
          if (isActive) {
            await camera.start();
          }
        }

        setIsLoading(false);
      } catch (err: any) {
        console.error(err);
        if (err.name === 'NotAllowedError') {
          setError('Camera permission denied. Please enable it in your browser settings.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera found on this device.');
        } else {
          setError('Failed to initialize camera. Please try again.');
        }
        setIsLoading(false);
      }
    };

    initMediaPipe();

    return () => {
      isMounted = false;
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (handsRef.current) {
        handsRef.current.close();
      }
    };
  }, [isActive]);

  return (
    <GameCard padding="none" className="relative aspect-video overflow-hidden bg-black shadow-game">
      {!isActive && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 text-muted-foreground">
          <CameraOff size={48} className="mb-4 opacity-20" />
          <p className="font-bold">Camera is off</p>
        </div>
      )}

      <video
        ref={videoRef}
        className="h-full w-full object-cover grayscale-[0.2]"
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        width={640}
        height={480}
      />

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
            <p className="font-bold text-primary">Initializing SignSpeak AI...</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 p-6 text-center"
          >
            <CameraOff size={48} className="mb-4 text-primary" />
            <p className="mb-6 font-bold text-foreground">{error}</p>
            <GameButton onClick={() => window.location.reload()} variant="primary">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </GameButton>
          </motion.div>
        )}

        {currentGesture !== 'none' && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: -20 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="flex items-center gap-3 rounded-full bg-white/90 px-6 py-3 shadow-game backdrop-blur-md border-2 border-primary/20">
              <span className="text-3xl">{gestureEmojis[currentGesture]}</span>
              <span className="text-xl font-black text-primary uppercase tracking-wider">
                {currentGesture}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GameCard>
  );
};
