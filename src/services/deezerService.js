export async function fetchDeezerPreviewUrl(title, artist) {
  const queryParts = [title, artist].filter(Boolean).join(' ');
  if (!queryParts.trim()) {
    return null;
  }

  const query = encodeURIComponent(queryParts);

  try {
    const response = await fetch(`https://api.deezer.com/search?q=${query}`);
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const firstMatch = data?.data?.[0];
    return firstMatch?.preview || null;
  } catch (error) {
    console.warn('Deezer preview lookup failed:', error);
    return null;
  }
}

export async function fetchDeezerTrackInfo(title, artist) {
  const queryParts = [title, artist].filter(Boolean).join(' ');
  if (!queryParts.trim()) {
    return null;
  }

  const query = encodeURIComponent(queryParts);

  try {
    const response = await fetch(`https://api.deezer.com/search?q=${query}`);
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const firstMatch = data?.data?.[0];
    if (!firstMatch) {
      return null;
    }

    return {
      title: firstMatch.title || 'Unknown',
      artist: firstMatch.artist?.name || 'Unknown',
      bpm: Number(firstMatch.bpm) || 0,
      previewUrl: firstMatch.preview || null,
    };
  } catch (error) {
    console.warn('Deezer track lookup failed:', error);
    return null;
  }
}
