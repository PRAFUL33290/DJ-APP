import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  API_KEY: '@dj_app_api_key',
  PROVIDER: '@dj_app_provider',
  OPENAI_MODEL: '@dj_app_openai_model',
};

export const storageService = {
  // Save API Key
  async saveApiKey(apiKey) {
    try {
      await AsyncStorage.setItem(KEYS.API_KEY, apiKey);
      return true;
    } catch (error) {
      console.error('Error saving API key:', error);
      return false;
    }
  },

  // Get API Key
  async getApiKey() {
    try {
      const apiKey = await AsyncStorage.getItem(KEYS.API_KEY);
      return apiKey;
    } catch (error) {
      console.error('Error getting API key:', error);
      return null;
    }
  },

  // Save Provider
  async saveProvider(provider) {
    try {
      await AsyncStorage.setItem(KEYS.PROVIDER, provider);
      return true;
    } catch (error) {
      console.error('Error saving provider:', error);
      return false;
    }
  },

  // Get Provider
  async getProvider() {
    try {
      const provider = await AsyncStorage.getItem(KEYS.PROVIDER);
      return provider || 'openai'; // Default to OpenAI
    } catch (error) {
      console.error('Error getting provider:', error);
      return 'openai';
    }
  },

  // Save OpenAI Model
  async saveOpenAIModel(model) {
    try {
      await AsyncStorage.setItem(KEYS.OPENAI_MODEL, model);
      return true;
    } catch (error) {
      console.error('Error saving OpenAI model:', error);
      return false;
    }
  },

  // Get OpenAI Model
  async getOpenAIModel() {
    try {
      const model = await AsyncStorage.getItem(KEYS.OPENAI_MODEL);
      return model || 'gpt-4.1';
    } catch (error) {
      console.error('Error getting OpenAI model:', error);
      return 'gpt-4.1';
    }
  },

  // Clear all stored data
  async clearAll() {
    try {
      await AsyncStorage.multiRemove([KEYS.API_KEY, KEYS.PROVIDER, KEYS.OPENAI_MODEL]);
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  },
};
