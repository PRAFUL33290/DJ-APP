import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useTheme } from '../context/ThemeContext';
import { AI_PROVIDERS, OPENAI_MODELS } from '../constants/theme';
import {
  SPACING,
  BORDER_RADIUS,
  FONT_SIZE,
  SHADOWS,
  getResponsiveValue,
  getContainerPadding,
  DEVICE_TYPE,
} from '../constants/layout';
import { storageService } from '../services/storageService';

export default function SettingsScreen({ navigation }) {
  const { theme, themeMode, toggleTheme, isDark } = useTheme();
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('openai');
  const [openaiModel, setOpenaiModel] = useState('gpt-4.1');
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const defaultApiKey = Constants.expoConfig?.extra?.DEFAULT_OPENAI_KEY || '';

  // Load saved settings on mount
  useEffect(() => {
    loadSavedSettings();
  }, []);

  const loadSavedSettings = async () => {
    try {
      const savedApiKey = await storageService.getApiKey();
      const savedProvider = await storageService.getProvider();
      const savedOpenAIModel = await storageService.getOpenAIModel();

      if (savedApiKey) {
        setApiKey(savedApiKey);
        setSaved(true);
      } else if (defaultApiKey) {
        // Pre-fill with OpenAI key from local env if nothing is saved
        setApiKey(defaultApiKey);
        await storageService.saveApiKey(defaultApiKey);
        await storageService.saveProvider('openai');
        await storageService.saveOpenAIModel('gpt-4.1');
        setSaved(true);
      }

      if (savedProvider) {
        setProvider(savedProvider);
      }

      if (savedOpenAIModel) {
        setOpenaiModel(savedOpenAIModel);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer une clé API.');
      return;
    }

    try {
      // Save to AsyncStorage
      await storageService.saveApiKey(apiKey.trim());
      await storageService.saveProvider(provider);
      await storageService.saveOpenAIModel(openaiModel);

      // Also pass via navigation for immediate use
      navigation.navigate('Recherche', {
        apiKey: apiKey.trim(),
        provider,
        openaiModel,
        refresh: Date.now(), // Force refresh
      });

      setSaved(true);
      Alert.alert('Succès', 'Paramètres sauvegardés de manière permanente !');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder les paramètres.');
      console.error('Save error:', error);
    }
  };

  const handleThemeChange = (mode) => {
    toggleTheme(mode);
  };

  const styles = createStyles(theme);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.textSecondary, marginTop: SPACING.md }}>
          Chargement des paramètres...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Ionicons name="settings" size={getResponsiveValue(28, 32, 36)} color={theme.text} />
          <Text style={styles.headerTitle}>Paramètres</Text>
        </View>
        <Text style={styles.headerSubtitle}>DJ PRAFUL D Configuration</Text>
      </View>

      {/* Theme Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="palette" size={20} color={theme.primary} />
          <Text style={styles.sectionTitle}>Thème d'apparence</Text>
        </View>
        <View style={styles.themeOptions}>
          {[
            { id: 'light', label: 'Clair', iconName: 'sunny', iconFamily: 'Ionicons' },
            { id: 'dark', label: 'Sombre', iconName: 'moon', iconFamily: 'Ionicons' },
            { id: 'auto', label: 'Auto', iconName: 'flash', iconFamily: 'Ionicons' },
          ].map((themeOption) => (
            <TouchableOpacity
              key={themeOption.id}
              style={[
                styles.themeButton,
                themeMode === themeOption.id && styles.themeButtonActive,
              ]}
              onPress={() => handleThemeChange(themeOption.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={themeOption.iconName}
                size={getResponsiveValue(28, 32, 36)}
                color={themeMode === themeOption.id ? '#FFFFFF' : theme.textSecondary}
                style={styles.themeIcon}
              />
              <Text
                style={[
                  styles.themeLabel,
                  themeMode === themeOption.id && styles.themeLabelActive,
                ]}
              >
                {themeOption.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* AI Provider Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="robot" size={20} color={theme.primary} />
          <Text style={styles.sectionTitle}>Fournisseur AI</Text>
        </View>
        {AI_PROVIDERS.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.providerCard, provider === p.id && styles.providerCardActive]}
            onPress={() => {
              setProvider(p.id);
              setSaved(false);
            }}
            activeOpacity={0.8}
          >
            <View style={[styles.radio, provider === p.id && styles.radioActive]}>
              {provider === p.id && <View style={styles.radioInner} />}
            </View>
            <Text
              style={[styles.providerLabel, provider === p.id && styles.providerLabelActive]}
            >
              {p.label}
            </Text>
            {provider === p.id && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>

      {provider === 'openai' && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="brain" size={20} color={theme.primary} />
            <Text style={styles.sectionTitle}>Modele OpenAI</Text>
          </View>
          {OPENAI_MODELS.map((model) => (
            <TouchableOpacity
              key={model.id}
              style={[
                styles.providerCard,
                openaiModel === model.id && styles.providerCardActive,
              ]}
              onPress={() => {
                setOpenaiModel(model.id);
                setSaved(false);
              }}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.radio,
                  openaiModel === model.id && styles.radioActive,
                ]}
              >
                {openaiModel === model.id && <View style={styles.radioInner} />}
              </View>
              <Text
                style={[
                  styles.providerLabel,
                  openaiModel === model.id && styles.providerLabelActive,
                ]}
              >
                {model.label}
              </Text>
              {openaiModel === model.id && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* API Key Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="key" size={20} color={theme.primary} />
          <Text style={styles.sectionTitle}>Clé API</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={`Entrez votre clé API ${
              provider === 'claude'
                ? 'Anthropic'
                : provider === 'openai'
                  ? 'OpenAI'
                  : 'Google'
            }`}
            placeholderTextColor={theme.textTertiary}
            value={apiKey}
            onChangeText={(text) => {
              setApiKey(text);
              setSaved(false);
            }}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View style={styles.hintRow}>
            <Ionicons name="information-circle" size={14} color={theme.textSecondary} />
            <Text style={styles.hint}>
              {provider === 'claude'
                ? 'Obtenez votre clé sur console.anthropic.com'
                : provider === 'openai'
                  ? 'Obtenez votre clé sur platform.openai.com'
                  : 'Obtenez votre clé sur aistudio.google.com'}
            </Text>
          </View>
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, saved && styles.saveButtonSaved]}
        onPress={handleSave}
        activeOpacity={0.8}
      >
        <Ionicons
          name={saved ? 'checkmark-circle' : 'save'}
          size={24}
          color="#FFFFFF"
          style={{ marginRight: SPACING.xs }}
        />
        <Text style={styles.saveButtonText}>{saved ? 'Sauvegardé' : 'Sauvegarder'}</Text>
      </TouchableOpacity>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <View style={styles.infoHeader}>
          <Ionicons name="information-circle" size={24} color={theme.primary} />
          <Text style={styles.infoTitle}>À propos</Text>
        </View>
        <Text style={styles.infoText}>
          DJ PRAFUL D Live Mix Assistant utilise l'intelligence artificielle pour analyser les
          caractéristiques musicales (BPM, style, artiste) et suggérer les meilleures transitions
          pour vos sets DJ.
        </Text>
        <View style={styles.infoRow}>
          <Ionicons name="lock-closed" size={16} color={theme.textSecondary} />
          <Text style={styles.infoText}>
            Vos clés API sont stockées localement et ne sont jamais partagées.
          </Text>
        </View>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    paddingHorizontal: getContainerPadding(),
    paddingVertical: SPACING.lg,
    paddingBottom: SPACING.xxl,
    width: '100%',
    maxWidth: DEVICE_TYPE.isDesktop ? 800 : '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  headerTitle: {
    fontSize: getResponsiveValue(FONT_SIZE.xxl, FONT_SIZE.xxxl, 40),
    fontWeight: '900',
    color: theme.text,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: theme.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: getResponsiveValue(FONT_SIZE.md, FONT_SIZE.lg, FONT_SIZE.xl),
    fontWeight: '800',
    color: theme.text,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  themeButton: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.border,
    ...SHADOWS.small,
  },
  themeButtonActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
    transform: [{ scale: 1.05 }],
  },
  themeIcon: {
    marginBottom: SPACING.xs,
  },
  themeLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: theme.textSecondary,
  },
  themeLabelActive: {
    color: '#FFFFFF',
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: theme.border,
    ...SHADOWS.small,
  },
  providerCardActive: {
    borderColor: theme.primary,
    backgroundColor: theme.surfaceElevated,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.textSecondary,
    marginRight: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: theme.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.primary,
  },
  providerLabel: {
    flex: 1,
    fontSize: getResponsiveValue(FONT_SIZE.md, FONT_SIZE.lg, FONT_SIZE.xl),
    fontWeight: '600',
    color: theme.textSecondary,
  },
  providerLabelActive: {
    color: theme.text,
    fontWeight: '700',
  },
  checkmark: {
    fontSize: FONT_SIZE.xl,
    color: theme.primary,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: theme.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: getResponsiveValue(14, 16, 18),
    paddingHorizontal: SPACING.md,
    fontSize: getResponsiveValue(FONT_SIZE.md, FONT_SIZE.lg, FONT_SIZE.xl),
    color: theme.text,
    borderWidth: 2,
    borderColor: theme.border,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.xs,
  },
  hint: {
    fontSize: FONT_SIZE.xs,
    color: theme.textSecondary,
    fontStyle: 'italic',
    flex: 1,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: theme.success,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: getResponsiveValue(16, 18, 20),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    ...SHADOWS.medium,
  },
  saveButtonSaved: {
    backgroundColor: theme.primary,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: getResponsiveValue(FONT_SIZE.lg, FONT_SIZE.xl, FONT_SIZE.xxl),
    fontWeight: '900',
    letterSpacing: 1,
  },
  infoBox: {
    backgroundColor: theme.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: theme.border,
    ...SHADOWS.small,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  infoTitle: {
    fontSize: getResponsiveValue(FONT_SIZE.md, FONT_SIZE.lg, FONT_SIZE.xl),
    fontWeight: '800',
    color: theme.text,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontSize: getResponsiveValue(FONT_SIZE.sm, FONT_SIZE.md, FONT_SIZE.lg),
    color: theme.textSecondary,
    lineHeight: getResponsiveValue(20, 22, 24),
    marginBottom: SPACING.sm,
  },
  version: {
    fontSize: FONT_SIZE.xs,
    color: theme.textTertiary,
    fontWeight: '600',
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
});
