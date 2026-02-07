import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS, SEARCH_MODES } from '../constants/theme';
import { searchSongRecommendations } from '../services/aiService';
import SongCard from '../components/SongCard';

export default function SearchScreen({ route }) {
  const [songTitle, setSongTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [searchMode, setSearchMode] = useState('all');
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!songTitle.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un titre de chanson.');
      return;
    }

    // Get settings from route params or use defaults
    const provider = route?.params?.provider || 'claude';
    const apiKey = route?.params?.apiKey || '';

    if (!apiKey) {
      Alert.alert(
        'Clé API manquante',
        "Veuillez configurer votre clé API dans l'onglet Paramètres avant de rechercher."
      );
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const results = await searchSongRecommendations(
        provider,
        apiKey,
        songTitle.trim(),
        artistName.trim(),
        searchMode
      );
      setRecommendations(results);
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue lors de la recherche.');
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>🎧 DJ Song Finder</Text>
        <Text style={styles.subtitle}>Trouvez la chanson parfaite pour votre transition</Text>

        {/* Song Title Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Titre de la chanson *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Blinding Lights"
            placeholderTextColor={COLORS.textSecondary}
            value={songTitle}
            onChangeText={setSongTitle}
          />
        </View>

        {/* Artist Name Input (Optional) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Artiste (optionnel)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: The Weeknd"
            placeholderTextColor={COLORS.textSecondary}
            value={artistName}
            onChangeText={setArtistName}
          />
        </View>

        {/* Search Mode Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mode de recherche</Text>
          <View style={styles.modeContainer}>
            {SEARCH_MODES.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                style={[styles.modeButton, searchMode === mode.id && styles.modeButtonActive]}
                onPress={() => setSearchMode(mode.id)}
              >
                <Text style={styles.modeIcon}>{mode.icon}</Text>
                <Text
                  style={[styles.modeLabel, searchMode === mode.id && styles.modeLabelActive]}
                >
                  {mode.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Search Button */}
        <TouchableOpacity
          style={[styles.searchButton, isLoading && styles.searchButtonDisabled]}
          onPress={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.text} />
          ) : (
            <Text style={styles.searchButtonText}>🔍 Rechercher</Text>
          )}
        </TouchableOpacity>

        {/* Results */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Recherche en cours...</Text>
          </View>
        )}

        {!isLoading && recommendations.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>
              🎶 Recommandations ({recommendations.length})
            </Text>
            {recommendations.map((song, index) => (
              <SongCard key={`${song.title}-${index}`} song={song} index={index} />
            ))}
          </View>
        )}

        {!isLoading && hasSearched && recommendations.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune recommandation trouvée.</Text>
            <Text style={styles.emptySubtext}>Essayez avec un autre titre ou mode de recherche.</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
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
    marginBottom: 16,
  },
  label: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
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
  modeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  modeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  modeLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  modeLabelActive: {
    color: COLORS.text,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  searchButtonDisabled: {
    opacity: 0.7,
  },
  searchButtonText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 30,
  },
  loadingText: {
    color: COLORS.textSecondary,
    marginTop: 12,
    fontSize: 14,
  },
  resultsContainer: {
    marginTop: 4,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  emptySubtext: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
});
