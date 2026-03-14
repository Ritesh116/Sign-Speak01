
import { GestureType } from './gestureDetection';

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'ja' | 'zh' | 'pt';

export interface Language {
  code: LanguageCode;
  name: string;
  flag: string;
  translations: Record<Exclude<GestureType, 'none'>, string>;
}

export const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    translations: { hello: 'Hello', hi: 'Hi', i: 'I', love: 'Love', you: 'You' }
  },
  {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸',
    translations: { hello: 'Hola', hi: 'Hola', i: 'Yo', love: 'Amo', you: 'Ti' }
  },
  {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
    translations: { hello: 'Bonjour', hi: 'Salut', i: 'Je', love: 'Aime', you: 'Toi' }
  },
  {
    code: 'de',
    name: 'Deutsch',
    flag: '🇩🇪',
    translations: { hello: 'Hallo', hi: 'Hi', i: 'Ich', love: 'Liebe', you: 'Dich' }
  },
  {
    code: 'hi',
    name: 'हिन्दी',
    flag: '🇮🇳',
    translations: { hello: 'नमस्ते', hi: 'नमस्ते', i: 'मैं', love: 'प्यार', you: 'तुमसे' }
  },
  {
    code: 'ja',
    name: '日本語',
    flag: '🇯🇵',
    translations: { hello: 'こんにちは', hi: 'やあ', i: '私', love: '愛', you: 'あなた' }
  },
  {
    code: 'zh',
    name: '中文',
    flag: '🇨🇳',
    translations: { hello: '你好', hi: '嗨', i: '我', love: '爱', you: '你' }
  },
  {
    code: 'pt',
    name: 'Português',
    flag: '🇧🇷',
    translations: { hello: 'Olá', hi: 'Oi', i: 'Eu', love: 'Amo', you: 'Você' }
  }
];

export const constructSentence = (gestures: GestureType[], languageCode: LanguageCode): string => {
  const filtered = gestures.filter(g => g !== 'none') as Exclude<GestureType, 'none'>[];
  if (filtered.length === 0) return '';

  const lang = languages.find(l => l.code === languageCode) || languages[0];
  
  // Special handling for "I love you"
  const lastThree = filtered.slice(-3);
  const isILoveYou = lastThree[0] === 'i' && lastThree[1] === 'love' && lastThree[2] === 'you';

  if (isILoveYou) {
    switch (languageCode) {
      case 'fr': return "Je t'aime";
      case 'es': return "Te amo";
      case 'de': return "Ich liebe dich";
      case 'hi': return "मैं तुमसे प्यार करता हूं";
      case 'ja': return "愛してる";
      case 'zh': return "我爱你";
      case 'pt': return "Eu te amo";
      default: return "I love you";
    }
  }

  return filtered.map(g => lang.translations[g]).join(' ');
};

export const speakText = (text: string, languageCode: LanguageCode) => {
  if (!window.speechSynthesis) return;
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = languageCode;
  
  // Try to find a better voice for the language
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang.startsWith(languageCode));
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
};
