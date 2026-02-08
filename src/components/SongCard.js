import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useTheme } from '../context/ThemeContext';
import StarRating from './StarRating';
import {
  SPACING,
  BORDER_RADIUS,
  FONT_SIZE,
  SHADOWS,
  getResponsiveValue,
} from '../constants/layout';

export default function SongCard({ song, index }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const soundRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => null);
      }
    };
  }, []);

  const stopPlayback = async () => {
    if (!soundRef.current) {
      return;
    }

    try {
      await soundRef.current.stopAsync();
      await soundRef.current.setPositionAsync(0);
    } catch (error) {
      console.warn('Failed to stop preview:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handlePreviewPress = async () => {
    if (!song.previewUrl || isPreviewLoading) {
      return;
    }

    if (isPlaying) {
      await stopPlayback();
      return;
    }

    setIsPreviewLoading(true);

    try {
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: song.previewUrl },
          { shouldPlay: true }
        );
        soundRef.current = sound;
        sound.setOnPlaybackStatusUpdate((status) => {
          if (!status.isLoaded) {
            return;
          }
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      } else {
        await soundRef.current.replayAsync();
      }

      setIsPlaying(true);
    } catch (error) {
      console.warn('Failed to play preview:', error);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9}>
      {/* Rank Badge */}
      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>#{index + 1}</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Title and Artist */}
        <View style={styles.titleSection}>
          <Text style={styles.title} numberOfLines={2} selectable>
            {song.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1} selectable>
            {song.artist}
          </Text>
        </View>

        {/* Tags Row */}
        <View style={styles.tagsRow}>
          <View style={styles.tag}>
            <Ionicons name="musical-notes" size={14} color={theme.text} style={styles.tagIcon} />
            <Text style={styles.tagText} selectable>{song.bpm} BPM</Text>
          </View>
          <View style={styles.tag}>
            <MaterialCommunityIcons name="guitar-electric" size={14} color={theme.text} style={styles.tagIcon} />
            <Text style={styles.tagText} selectable>{song.genre}</Text>
          </View>
        </View>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <StarRating rating={song.popularity} />
          <Text style={styles.popularityText}>Popularité</Text>
        </View>

        <View style={styles.previewRow}>
          <TouchableOpacity
            style={[
              styles.previewButton,
              !song.previewUrl && styles.previewButtonDisabled,
            ]}
            onPress={handlePreviewPress}
            activeOpacity={0.7}
            disabled={!song.previewUrl || isPreviewLoading}
            accessibilityRole="button"
            accessibilityLabel={
              song.previewUrl ? 'Ecouter un extrait' : 'Preview indisponible'
            }
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={16}
              color={song.previewUrl ? '#FFFFFF' : theme.textTertiary}
            />
            <Text
              style={[
                styles.previewText,
                !song.previewUrl && styles.previewTextDisabled,
              ]}
            >
              {song.previewUrl ? 'Preview' : 'Preview indisponible'}
            </Text>
          </TouchableOpacity>
          {isPreviewLoading && (
            <Text style={styles.previewLoading}>Chargement...</Text>
          )}
        </View>

        {/* Reason */}
        <View style={styles.reasonContainer}>
          <View style={styles.reasonHeader}>
            <Ionicons name="bulb" size={14} color={theme.primary} />
            <Text style={styles.reasonLabel}>Pourquoi cette recommandation ?</Text>
          </View>
          <Text style={styles.reasonText} selectable>{song.reason}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (theme) => StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderRadius: getResponsiveValue(BORDER_RADIUS.md, BORDER_RADIUS.lg, BORDER_RADIUS.xl),
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.border,
    ...SHADOWS.medium,
  },
  rankBadge: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    backgroundColor: theme.primary,
    borderRadius: BORDER_RADIUS.round,
    width: getResponsiveValue(36, 42, 48),
    height: getResponsiveValue(36, 42, 48),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...SHADOWS.small,
  },
  rankText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: getResponsiveValue(FONT_SIZE.md, FONT_SIZE.lg, FONT_SIZE.xl),
  },
  content: {
    padding: SPACING.lg,
    paddingLeft: getResponsiveValue(64, 72, 80),
  },
  titleSection: {
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: getResponsiveValue(FONT_SIZE.lg, FONT_SIZE.xl, FONT_SIZE.xxl),
    fontWeight: '800',
    color: theme.text,
    marginBottom: 4,
    lineHeight: getResponsiveValue(22, 26, 30),
  },
  artist: {
    fontSize: getResponsiveValue(FONT_SIZE.sm, FONT_SIZE.md, FONT_SIZE.lg),
    fontWeight: '600',
    color: theme.textSecondary,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surfaceElevated,
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  tagIcon: {
    marginRight: 4,
  },
  tagText: {
    fontSize: getResponsiveValue(FONT_SIZE.xs, FONT_SIZE.sm, FONT_SIZE.md),
    fontWeight: '700',
    color: theme.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: theme.primary,
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  previewButtonDisabled: {
    backgroundColor: theme.surfaceElevated,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  previewText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewTextDisabled: {
    color: theme.textTertiary,
  },
  previewLoading: {
    fontSize: FONT_SIZE.xs,
    color: theme.textSecondary,
    fontWeight: '600',
  },
  popularityText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: theme.textTertiary,
    marginLeft: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  reasonContainer: {
    backgroundColor: theme.surfaceElevated,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: theme.primary,
  },
  reasonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  reasonLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: theme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reasonText: {
    fontSize: getResponsiveValue(FONT_SIZE.sm, FONT_SIZE.md, FONT_SIZE.lg),
    color: theme.textSecondary,
    lineHeight: getResponsiveValue(18, 20, 22),
    fontStyle: 'italic',
  },
});
