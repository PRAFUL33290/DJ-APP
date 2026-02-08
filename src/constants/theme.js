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
  accent: '#a238ff',
  star: '#a238ff',
  starEmpty: '#444466',
  border: '#2d2d4a',
  error: '#ff6b6b',
  success: '#00b894',
};

// Search modes
export const SEARCH_MODES = [
  { id: 'bpm', label: 'BPM', iconName: 'musical-notes', iconFamily: 'Ionicons' },
  { id: 'style', label: 'Style musical', iconName: 'guitar-electric', iconFamily: 'MaterialCommunityIcons' },
  { id: 'artist', label: 'Artiste', iconName: 'microphone', iconFamily: 'Ionicons' },
  { id: 'change', label: 'Changer de style musical', iconName: 'shuffle', iconFamily: 'Ionicons' },
  { id: 'all', label: 'Tous les critères', iconName: 'filter', iconFamily: 'Ionicons' },
];

// AI Provider options
export const AI_PROVIDERS = [
  { id: 'claude', label: 'Claude (Anthropic)' },
  { id: 'openai', label: 'OpenAI (GPT)' },
  { id: 'gemini', label: 'Gemini (Google)' },
];

export const OPENAI_MODELS = [
  { id: 'gpt-4.1', label: 'GPT-4.1 (qualite)' },
  { id: 'gpt-4.1-mini', label: 'GPT-4.1 Mini (moins cher)' },
  { id: 'gpt-4o-mini', label: 'GPT-4o Mini (tres economique)' },
];
