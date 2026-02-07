import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, AI_PROVIDERS } from '../constants/theme';

export default function SettingsScreen({ navigation }) {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('claude');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!apiKey.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer une clé API.');
      return;
    }

    // Pass settings to the Search tab via navigation params
    navigation.navigate('Recherche', {
      apiKey: apiKey.trim(),
      provider,
    });

    setSaved(true);
    Alert.alert('Succès', 'Paramètres sauvegardés ! Retournez à la recherche pour commencer.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>⚙️ Paramètres</Text>
      <Text style={styles.subtitle}>Configurez votre fournisseur AI et clé API</Text>

      {/* AI Provider Selection */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Fournisseur AI</Text>
        {AI_PROVIDERS.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.providerButton, provider === p.id && styles.providerButtonActive]}
            onPress={() => {
              setProvider(p.id);
              setSaved(false);
            }}
          >
            <View style={[styles.radio, provider === p.id && styles.radioActive]}>
              {provider === p.id && <View style={styles.radioInner} />}
            </View>
            <Text style={[styles.providerLabel, provider === p.id && styles.providerLabelActive]}>
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* API Key Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Clé API</Text>
        <TextInput
          style={styles.input}
          placeholder={`Entrez votre clé API ${
            provider === 'claude'
              ? 'Anthropic'
              : provider === 'openai'
                ? 'OpenAI'
                : 'Google'
          }`}
          placeholderTextColor={COLORS.textSecondary}
          value={apiKey}
          onChangeText={(text) => {
            setApiKey(text);
            setSaved(false);
          }}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={styles.hint}>
          {provider === 'claude'
            ? 'Obtenez votre clé sur console.anthropic.com'
            : provider === 'openai'
              ? 'Obtenez votre clé sur platform.openai.com'
              : 'Obtenez votre clé sur aistudio.google.com'}
        </Text>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {saved ? '✅ Sauvegardé' : '💾 Sauvegarder'}
        </Text>
      </TouchableOpacity>

      {/* Info */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ Information</Text>
        <Text style={styles.infoText}>
          Cette application utilise l'intelligence artificielle pour analyser les caractéristiques
          musicales (BPM, style, artiste) et suggérer les meilleures transitions pour vos sets DJ.
        </Text>
        <Text style={styles.infoText}>
          Vos clés API sont stockées localement sur votre appareil et ne sont jamais partagées.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  providerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  providerButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surfaceLight,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  providerLabel: {
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  providerLabelActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 14,
    color: COLORS.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hint: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 6,
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: COLORS.success,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  saveButtonText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
});
