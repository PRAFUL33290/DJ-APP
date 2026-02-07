import { buildUserPrompt, parseAIResponse } from '../src/services/aiService';

describe('aiService', () => {
  describe('buildUserPrompt', () => {
    test('builds prompt with song title only', () => {
      const prompt = buildUserPrompt('Blinding Lights', '', 'all');
      expect(prompt).toContain('Blinding Lights');
      expect(prompt).toContain('tous les critères');
    });

    test('builds prompt with song title and artist', () => {
      const prompt = buildUserPrompt('Blinding Lights', 'The Weeknd', 'bpm');
      expect(prompt).toContain('Blinding Lights');
      expect(prompt).toContain('The Weeknd');
      expect(prompt).toContain('BPM');
    });

    test('builds prompt for style search mode', () => {
      const prompt = buildUserPrompt('One More Time', 'Daft Punk', 'style');
      expect(prompt).toContain('style musical');
    });

    test('builds prompt for artist search mode', () => {
      const prompt = buildUserPrompt('Levels', 'Avicii', 'artist');
      expect(prompt).toContain('artiste');
    });
  });

  describe('parseAIResponse', () => {
    test('parses valid JSON response', () => {
      const response = JSON.stringify({
        recommendations: [
          {
            title: 'Test Song',
            artist: 'Test Artist',
            bpm: 128,
            genre: 'House',
            reason: 'Great transition',
            popularity: 4,
          },
        ],
      });
      const result = parseAIResponse(response);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Test Song');
      expect(result[0].artist).toBe('Test Artist');
      expect(result[0].bpm).toBe(128);
      expect(result[0].genre).toBe('House');
      expect(result[0].popularity).toBe(4);
    });

    test('parses JSON wrapped in code blocks', () => {
      const response = '```json\n{"recommendations": [{"title": "Song", "artist": "Artist", "bpm": 120, "genre": "Pop", "reason": "Good match", "popularity": 3}]}\n```';
      const result = parseAIResponse(response);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Song');
    });

    test('clamps popularity to 1-5 range', () => {
      const response = JSON.stringify({
        recommendations: [
          {
            title: 'Song',
            artist: 'Artist',
            bpm: 128,
            genre: 'House',
            reason: 'Test',
            popularity: 10,
          },
          {
            title: 'Song2',
            artist: 'Artist2',
            bpm: 130,
            genre: 'Techno',
            reason: 'Test2',
            popularity: -1,
          },
        ],
      });
      const result = parseAIResponse(response);
      expect(result[0].popularity).toBe(5);
      expect(result[1].popularity).toBe(1);
    });

    test('handles missing fields with defaults', () => {
      const response = JSON.stringify({
        recommendations: [{}],
      });
      const result = parseAIResponse(response);
      expect(result[0].title).toBe('Unknown');
      expect(result[0].artist).toBe('Unknown');
      expect(result[0].bpm).toBe(0);
      expect(result[0].genre).toBe('Unknown');
      expect(result[0].popularity).toBe(3);
    });

    test('throws on invalid JSON', () => {
      expect(() => parseAIResponse('not json')).toThrow();
    });

    test('throws on missing recommendations array', () => {
      expect(() => parseAIResponse('{"other": "data"}')).toThrow(
        'Invalid response format'
      );
    });
  });
});
