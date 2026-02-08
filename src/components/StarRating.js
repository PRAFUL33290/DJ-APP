import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function StarRating({ rating, size = 18 }) {
  const { theme } = useTheme();

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const isFilled = i <= rating;
    stars.push(
      <Text
        key={i}
        style={[
          styles.star,
          {
            fontSize: size,
            color: isFilled ? theme.star : theme.starEmpty,
          }
        ]}
      >
        {isFilled ? '★' : '☆'}
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
    marginRight: 2,
  },
});
