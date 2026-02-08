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
        current: {
          title: 'Input Song',
          artist: 'Input Artist',
          bpm: 124,
          popularity: 5,
        },
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
      expect(result.recommendations).toHaveLength(1);
      expect(result.current.title).toBe('Input Song');
      expect(result.current.artist).toBe('Input Artist');
      expect(result.current.bpm).toBe(124);
      expect(result.current.popularity).toBe(5);
      expect(result.recommendations[0].title).toBe('Test Song');
      expect(result.recommendations[0].artist).toBe('Test Artist');
      expect(result.recommendations[0].bpm).toBe(128);
      expect(result.recommendations[0].genre).toBe('House');
      expect(result.recommendations[0].popularity).toBe(4);
    });

    test('parses JSON wrapped in code blocks', () => {
      const response = '```json\n{"current": {"title": "Input", "artist": "Artist", "bpm": 120, "popularity": 3}, "recommendations": [{"title": "Song", "artist": "Artist", "bpm": 120, "genre": "Pop", "reason": "Good match", "popularity": 3}]}\n```';
      const result = parseAIResponse(response);
      expect(result.recommendations).toHaveLength(1);
      expect(result.recommendations[0].title).toBe('Song');
    });

    test('clamps popularity to 1-5 range', () => {
      const response = JSON.stringify({
        current: {
          title: 'Input Song',
          artist: 'Input Artist',
          bpm: 122,
          popularity: 10,
        },
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
      expect(result.current.popularity).toBe(5);
      expect(result.recommendations[0].popularity).toBe(5);
      expect(result.recommendations[1].popularity).toBe(1);
    });

    test('handles missing fields with defaults', () => {
      const response = JSON.stringify({
        recommendations: [{}],
      });
      const result = parseAIResponse(response);
      expect(result.current.title).toBe('Unknown');
      expect(result.current.artist).toBe('Unknown');
      expect(result.current.bpm).toBe(0);
      expect(result.current.popularity).toBe(3);
      expect(result.recommendations[0].title).toBe('Unknown');
      expect(result.recommendations[0].artist).toBe('Unknown');
      expect(result.recommendations[0].bpm).toBe(0);
      expect(result.recommendations[0].genre).toBe('Unknown');
      expect(result.recommendations[0].popularity).toBe(3);
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
