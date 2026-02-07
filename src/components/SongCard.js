import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';
import StarRating from './StarRating';

export default function SongCard({ song, index }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>#{index + 1}</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {song.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {song.artist}
          </Text>
        </View>
        <StarRating rating={song.popularity} />
      </View>

      <View style={styles.metaRow}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>🎵 {song.bpm} BPM</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>🎸 {song.genre}</Text>
        </View>
      </View>

      <Text style={styles.reason}>{song.reason}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rankBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rankText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  artist: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  tagText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  reason: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
