// Theme colors for the DJ App
export const COLORS = {
  primary: '#6c5ce7',
  primaryDark: '#5a4bd1',
  secondary: '#00cec9',
  background: '#1a1a2e',
  surface: '#16213e',
  surfaceLight: '#1f3056',
  text: '#ffffff',
  textSecondary: '#a0a0b8',
  accent: '#e17055',
  star: '#fdcb6e',
  starEmpty: '#444466',
  border: '#2d2d4a',
  error: '#ff6b6b',
  success: '#00b894',
};

// Search modes
export const SEARCH_MODES = [
  { id: 'bpm', label: 'BPM', icon: '🎵' },
  { id: 'style', label: 'Style musical', icon: '🎸' },
  { id: 'artist', label: 'Artiste', icon: '🎤' },
  { id: 'all', label: 'Tous les critères', icon: '🔍' },
];

// AI Provider options
export const AI_PROVIDERS = [
  { id: 'claude', label: 'Claude (Anthropic)' },
  { id: 'openai', label: 'OpenAI (GPT)' },
  { id: 'gemini', label: 'Gemini (Google)' },
];
