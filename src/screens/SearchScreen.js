import React, { useState, useEffect, useRef } from 'react';
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
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SEARCH_MODES } from '../constants/theme';
import { autoCorrectSongMetadata, searchSongRecommendations } from '../services/aiService';
import { fetchDeezerPreviewUrl, fetchDeezerTrackInfo } from '../services/deezerService';
import SongCard from '../components/SongCard';
import StarRating from '../components/StarRating';
import {
  SPACING,
  BORDER_RADIUS,
  FONT_SIZE,
  SHADOWS,
  getResponsiveValue,
  getButtonSize,
  getContainerPadding,
  DEVICE_TYPE,
} from '../constants/layout';
import { storageService } from '../services/storageService';

const { width } = Dimensions.get('window');

export default function SearchScreen({ route }) {
  const { theme } = useTheme();
  const scrollViewRef = useRef(null);
  const [songTitle, setSongTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [searchMode, setSearchMode] = useState('all');
  const [recommendations, setRecommendations] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [savedApiKey, setSavedApiKey] = useState('');
  const [savedProvider, setSavedProvider] = useState('openai');
  const [savedOpenAIModel, setSavedOpenAIModel] = useState('gpt-4.1');
  const [isArtistLocked, setIsArtistLocked] = useState(false);
  const artistNameRef = useRef('');
  const isArtistLockedRef = useRef(false);
  const autoFillRequestId = useRef(0);
  const searchRequestId = useRef(0);

  // Load saved API key on mount
  useEffect(() => {
    loadSavedApiKey();
  }, []);

  // Also reload when route params change (when coming from Settings)
  useEffect(() => {
    if (route?.params?.refresh) {
      loadSavedApiKey();
    }
  }, [route?.params?.refresh]);

  useEffect(() => {
    artistNameRef.current = artistName;
  }, [artistName]);

  useEffect(() => {
    isArtistLockedRef.current = isArtistLocked;
  }, [isArtistLocked]);

  useEffect(() => {
    const trimmedTitle = songTitle.trim();
    if (!trimmedTitle) {
      if (!isArtistLockedRef.current) {
        setArtistName('');
      }
      return undefined;
    }

    if (trimmedTitle.length < 3) {
      return undefined;
    }

    const requestId = ++autoFillRequestId.current;
    const timeoutId = setTimeout(async () => {
      try {
        const provider = route?.params?.provider || savedProvider || 'openai';
        const apiKey = route?.params?.apiKey || savedApiKey || '';
        const openaiModel = route?.params?.openaiModel || savedOpenAIModel || 'gpt-4.1';

        let suggestedTitle = trimmedTitle;
        let suggestedArtist = '';

        if (apiKey) {
          try {
            const aiSuggestion = await autoCorrectSongMetadata(
              provider,
              apiKey,
              trimmedTitle,
              openaiModel
            );
            suggestedTitle = aiSuggestion.title || suggestedTitle;
            suggestedArtist = aiSuggestion.artist || '';
          } catch (error) {
            // Silent fallback to Deezer only
          }
        }

        const deezerTrack = await fetchDeezerTrackInfo(
          suggestedTitle,
          suggestedArtist || ''
        );

        if (autoFillRequestId.current !== requestId) {
          return;
        }

        const nextTitle = deezerTrack?.title || suggestedTitle;
        const nextArtist = deezerTrack?.artist || suggestedArtist;
        const canUpdateArtist =
          !isArtistLockedRef.current || !artistNameRef.current.trim();

        if (nextTitle && nextTitle !== songTitle) {
          setSongTitle(nextTitle);
        }
        if (nextArtist && canUpdateArtist && nextArtist !== artistNameRef.current) {
          setArtistName(nextArtist);
        }
      } catch (error) {
        // Ignore auto-fill errors to avoid blocking typing
      }
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [
    songTitle,
    route?.params?.provider,
    route?.params?.apiKey,
    route?.params?.openaiModel,
    savedProvider,
    savedApiKey,
    savedOpenAIModel,
  ]);

  const loadSavedApiKey = async () => {
    try {
      const apiKey = await storageService.getApiKey();
      const provider = await storageService.getProvider();
      const openaiModel = await storageService.getOpenAIModel();

      if (apiKey) {
        setSavedApiKey(apiKey);
      }
      if (provider) {
        setSavedProvider(provider);
      }
      if (openaiModel) {
        setSavedOpenAIModel(openaiModel);
      }
    } catch (error) {
      console.error('Error loading saved API key:', error);
    }
  };

  const attachPreviews = async (songs) => {
    const enriched = await Promise.all(
      songs.map(async (song) => {
        const previewUrl = await fetchDeezerPreviewUrl(song.title, song.artist);
        return { ...song, previewUrl };
      })
    );
    return enriched;
  };

  const handleSearch = async () => {
    if (!songTitle.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un titre de chanson.');
      return;
    }

    const requestId = ++searchRequestId.current;

    // Use saved API key or route params (route params take priority if present)
    const provider = route?.params?.provider || savedProvider || 'openai';
    const apiKey = route?.params?.apiKey || savedApiKey || '';
    const openaiModel = route?.params?.openaiModel || savedOpenAIModel || 'gpt-4.1';

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
      const deezerTrack = await fetchDeezerTrackInfo(
        songTitle.trim(),
        artistName.trim()
      );
      const correctedTitle = deezerTrack?.title || songTitle.trim();
      const correctedArtist = deezerTrack?.artist || artistName.trim();

      if (correctedTitle !== songTitle) {
        setSongTitle(correctedTitle);
      }
      if (correctedArtist !== artistName) {
        setArtistName(correctedArtist);
      }

      const results = await searchSongRecommendations(
        provider,
        apiKey,
        correctedTitle,
        correctedArtist,
        searchMode,
        openaiModel
      );

      if (searchRequestId.current !== requestId) {
        return;
      }
      const baseRecommendations = results.recommendations || [];
      const recommendationsWithPreview = await attachPreviews(baseRecommendations);

      if (searchRequestId.current !== requestId) {
        return;
      }
      setRecommendations(recommendationsWithPreview);
      const currentFromAI = results.current || null;
      if (currentFromAI) {
        setCurrentTrack({
          ...currentFromAI,
          title: correctedTitle || currentFromAI.title,
          artist: correctedArtist || currentFromAI.artist,
          bpm: deezerTrack?.bpm || currentFromAI.bpm,
        });
      } else {
        setCurrentTrack(
          deezerTrack
            ? {
                title: correctedTitle,
                artist: correctedArtist,
                bpm: deezerTrack.bpm || 0,
                popularity: 3,
              }
            : null
        );
      }
    } catch (error) {
      if (searchRequestId.current !== requestId) {
        return;
      }
      Alert.alert('Erreur', error.message || 'Une erreur est survenue lors de la recherche.');
      setRecommendations([]);
      setCurrentTrack(null);
    } finally {
      if (searchRequestId.current === requestId) {
        setIsLoading(false);
      }
    }
  };

  const handleReset = () => {
    setSongTitle('');
    setArtistName('');
    setIsArtistLocked(false);
    setSearchMode('all');
    setRecommendations([]);
    setHasSearched(false);
    setCurrentTrack(null);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const styles = createStyles(theme);
  const buttonSize = getButtonSize();

  return (
    <View style={styles.container}>
      {/* Header with DJ Name */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons name="headphones" size={getResponsiveValue(32, 38, 44)} color={theme.primary} />
            <Text style={styles.djName}>DJ PRAFUL D</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>Live Mix Assistant</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.contentContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Main Search Section */}
          <View style={styles.searchSection}>
            {/* Song Title Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Titre actuel</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Blinding Lights"
                placeholderTextColor={theme.textTertiary}
                value={songTitle}
                onChangeText={setSongTitle}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />
            </View>

            {/* Artist Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Artiste (optionnel)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: The Weeknd"
                placeholderTextColor={theme.textTertiary}
                value={artistName}
                onChangeText={(text) => {
                  setArtistName(text);
                  setIsArtistLocked(true);
                }}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />
            </View>

            {/* Search Mode Pills */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mode de recherche</Text>
              <View style={styles.modesGrid}>
                {SEARCH_MODES.map((mode) => {
                  const IconComponent = mode.iconFamily === 'Ionicons' ? Ionicons : MaterialCommunityIcons;
                  return (
                    <TouchableOpacity
                      key={mode.id}
                      style={[
                        styles.modeChip,
                        searchMode === mode.id && styles.modeChipActive,
                      ]}
                      onPress={() => setSearchMode(mode.id)}
                      activeOpacity={0.7}
                    >
                      <IconComponent
                        name={mode.iconName}
                        size={18}
                        color={searchMode === mode.id ? '#FFFFFF' : theme.textSecondary}
                        style={styles.modeIcon}
                      />
                      <Text
                        style={[
                          styles.modeLabel,
                          searchMode === mode.id && styles.modeLabelActive,
                        ]}
                      >
                        {mode.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Big Circular Search Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.searchButton,
                  { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2 },
                  isLoading && styles.searchButtonDisabled,
                ]}
                onPress={handleSearch}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="large" />
                ) : (
                  <>
                    <Ionicons name="search" size={getResponsiveValue(40, 48, 56)} color="#FFFFFF" />
                    <Text style={styles.searchButtonText}>GO</Text>
                  </>
                )}
              </TouchableOpacity>
              <Text style={styles.searchButtonHint}>
                {isLoading ? 'Recherche en cours...' : 'Appuyez pour chercher'}
              </Text>
            </View>
          </View>

          {/* Results Section */}
          {!isLoading && currentTrack && (
            <View style={styles.currentSection}>
              <View style={styles.currentHeader}>
                <Ionicons name="musical-note" size={20} color={theme.primary} />
                <Text style={styles.currentTitle}>Musique trouvee</Text>
              </View>
              <View style={styles.currentCard}>
                <View style={styles.currentMain}>
                  <Text style={styles.currentSong} numberOfLines={2}>
                    {currentTrack.title}
                  </Text>
                  <Text style={styles.currentArtist} numberOfLines={1} selectable>
                    {currentTrack.artist}
                  </Text>
                </View>
                <View style={styles.currentMetaRow}>
                  <View style={styles.currentTag}>
                    <Ionicons name="speedometer" size={14} color={theme.text} style={styles.currentTagIcon} />
                    <Text style={styles.currentTagText} selectable>{currentTrack.bpm} BPM</Text>
                  </View>
                  <View style={styles.currentRating}>
                    <StarRating rating={currentTrack.popularity} size={16} />
                    <Text style={styles.currentPopularityText}>Popularite</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {!isLoading && recommendations.length > 0 && (
            <View style={styles.resultsSection}>
              <View style={styles.resultsHeader}>
                <MaterialCommunityIcons name="music-note-multiple" size={24} color={theme.primary} />
                <Text style={styles.resultsTitle}>
                  Recommandations ({recommendations.length})
                </Text>
              </View>
              {recommendations.map((song, index) => (
                <SongCard key={`${song.title}-${index}`} song={song} index={index} />
              ))}
            </View>
          )}

          {!isLoading && hasSearched && recommendations.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="sad-outline" size={64} color={theme.textSecondary} />
              <Text style={styles.emptyText}>Aucune recommandation trouvée</Text>
              <Text style={styles.emptySubtext}>
                Essayez avec un autre titre ou mode de recherche
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Reinitialiser la recherche"
        >
          <Ionicons name="refresh" size={20} color={theme.text} />
          <Text style={styles.resetLabel}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    backgroundColor: theme.surface,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: SPACING.md,
    paddingHorizontal: getContainerPadding(),
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    width: '100%',
    maxWidth: DEVICE_TYPE.isDesktop ? 800 : '100%',
    alignSelf: 'center',
    ...SHADOWS.small,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  djName: {
    fontSize: getResponsiveValue(FONT_SIZE.xxl, FONT_SIZE.xxxl, 40),
    fontWeight: '900',
    color: theme.primary,
    textAlign: 'left',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: theme.textSecondary,
    textAlign: 'left',
    marginTop: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: getResponsiveValue(16, 18, 20),
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.surfaceElevated || theme.surface,
  },
  resetLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: theme.text,
  },
  contentContainer: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: getContainerPadding(),
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    backgroundColor: theme.surface,
    width: '100%',
    maxWidth: DEVICE_TYPE.isDesktop ? 800 : '100%',
    alignSelf: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: getContainerPadding(),
    paddingVertical: SPACING.lg,
    paddingBottom: SPACING.xxl,
    width: '100%',
    maxWidth: DEVICE_TYPE.isDesktop ? 800 : '100%',
    alignSelf: 'center',
  },
  searchSection: {
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: theme.text,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
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
    ...SHADOWS.small,
  },
  modesGrid: {
    flexDirection: 'column',
    gap: SPACING.sm,
  },
  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: getResponsiveValue(16, 18, 20),
    borderWidth: 2,
    borderColor: theme.border,
    ...SHADOWS.small,
  },
  modeChipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
    transform: [{ scale: 1.05 }],
  },
  modeIcon: {
    marginRight: SPACING.xs,
  },
  modeLabel: {
    fontSize: getResponsiveValue(FONT_SIZE.md, FONT_SIZE.lg, FONT_SIZE.lg),
    fontWeight: '600',
    color: theme.textSecondary,
  },
  modeLabelActive: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  searchButton: {
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    fontSize: getResponsiveValue(FONT_SIZE.lg, FONT_SIZE.xl, FONT_SIZE.xxl),
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 8,
    letterSpacing: 2,
  },
  searchButtonHint: {
    fontSize: FONT_SIZE.sm,
    color: theme.textSecondary,
    marginTop: SPACING.md,
    fontWeight: '600',
  },
  currentSection: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  currentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  currentTitle: {
    fontSize: getResponsiveValue(FONT_SIZE.lg, FONT_SIZE.xl, FONT_SIZE.xxl),
    fontWeight: '800',
    color: theme.text,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  currentCard: {
    backgroundColor: theme.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: theme.border,
    ...SHADOWS.small,
  },
  currentMain: {
    marginBottom: SPACING.sm,
  },
  currentSong: {
    fontSize: getResponsiveValue(FONT_SIZE.lg, FONT_SIZE.xl, FONT_SIZE.xxl),
    fontWeight: '800',
    color: theme.text,
  },
  currentArtist: {
    fontSize: getResponsiveValue(FONT_SIZE.sm, FONT_SIZE.md, FONT_SIZE.lg),
    fontWeight: '600',
    color: theme.textSecondary,
    marginTop: 4,
  },
  currentMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  currentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surfaceElevated,
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  currentTagIcon: {
    marginRight: 4,
  },
  currentTagText: {
    fontSize: getResponsiveValue(FONT_SIZE.xs, FONT_SIZE.sm, FONT_SIZE.md),
    fontWeight: '700',
    color: theme.text,
  },
  currentRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPopularityText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: theme.textTertiary,
    marginLeft: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resultsSection: {
    marginTop: SPACING.md,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  resultsTitle: {
    fontSize: getResponsiveValue(FONT_SIZE.xl, FONT_SIZE.xxl, FONT_SIZE.xxxl),
    fontWeight: '800',
    color: theme.text,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
    gap: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: theme.text,
    marginBottom: SPACING.xs,
  },
  emptySubtext: {
    fontSize: FONT_SIZE.sm,
    color: theme.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
});
