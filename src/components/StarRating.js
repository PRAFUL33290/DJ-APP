import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export default function StarRating({ rating, size = 18 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Text key={i} style={[styles.star, { fontSize: size }]}>
        {i <= rating ? '★' : '☆'}
      </Text>
    );
  }

  return <View style={styles.container}>{stars}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    color: COLORS.star,
    marginRight: 2,
  },
});
