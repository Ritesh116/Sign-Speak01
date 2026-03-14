
export type GestureType = 'hello' | 'hi' | 'i' | 'love' | 'you' | 'none';

export const gestureLabels: Record<GestureType, string> = {
  hello: 'Hello',
  hi: 'Hi',
  i: 'I',
  love: 'Love',
  you: 'You',
  none: ''
};

export const gestureEmojis: Record<GestureType, string> = {
  hello: '👋',
  hi: '✌️',
  i: '🤙',
  love: '🤟',
  you: '☝️',
  none: ''
};

interface Landmark {
  x: number;
  y: number;
  z: number;
}

const isFingerExtended = (landmarks: Landmark[], tip: number, pip: number, mcp: number) => {
  // Simple check: tip is higher (lower y) than pip and mcp
  return landmarks[tip].y < landmarks[pip].y && landmarks[pip].y < landmarks[mcp].y;
};

const isFingerCurled = (landmarks: Landmark[], tip: number, pip: number) => {
  return landmarks[tip].y > landmarks[pip].y;
};

const isThumbExtended = (landmarks: Landmark[]) => {
  // Thumb is special, check horizontal distance from index mcp
  const thumbTip = landmarks[4];
  const indexMcp = landmarks[5];
  return Math.abs(thumbTip.x - indexMcp.x) > 0.1;
};

export const detectGesture = (landmarks: Landmark[]): GestureType => {
  if (!landmarks || landmarks.length < 21) return 'none';

  const thumbExtended = isThumbExtended(landmarks);
  const indexExtended = isFingerExtended(landmarks, 8, 7, 5);
  const middleExtended = isFingerExtended(landmarks, 12, 11, 9);
  const ringExtended = isFingerExtended(landmarks, 16, 15, 13);
  const pinkyExtended = isFingerExtended(landmarks, 20, 19, 17);

  // Hello: All 5 fingers extended
  if (thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended) {
    return 'hello';
  }

  // Hi: Index + Middle extended, Ring + Pinky curled
  if (!thumbExtended && indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
    return 'hi';
  }

  // I: Only pinky extended
  if (!thumbExtended && !indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
    return 'i';
  }

  // Love: Thumb + Index + Pinky extended (ASL Love)
  // The prompt says: thumb + index extended (L-shape), others curled
  // But usually "I Love You" in ASL is Thumb + Index + Pinky.
  // Let's stick to the prompt's specific description: thumb + index extended, others curled
  if (thumbExtended && indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    return 'love';
  }

  // You: Only index extended
  if (!thumbExtended && indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    return 'you';
  }

  return 'none';
};
