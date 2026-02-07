// AI Service for song recommendations
// Supports Claude (Anthropic), OpenAI, and Gemini APIs

const SYSTEM_PROMPT = `Tu es un DJ professionnel expert en transitions musicales. 
On te donne un titre de chanson (et éventuellement l'artiste), ainsi qu'un mode de recherche.
Tu dois proposer 5 chansons qui feraient une excellente transition depuis le titre donné.

Pour chaque chanson proposée, tu dois fournir :
- title: le titre de la chanson
- artist: l'artiste
- bpm: le BPM estimé
- genre: le genre musical
- reason: une courte explication de pourquoi cette transition fonctionne bien
- popularity: une note de 1 à 5 basée sur la popularité de la chanson (5 = très populaire)

Réponds UNIQUEMENT avec un JSON valide au format suivant, sans aucun texte avant ou après :
{
  "recommendations": [
    {
      "title": "Nom de la chanson",
      "artist": "Nom de l'artiste",
      "bpm": 128,
      "genre": "House",
      "reason": "Explication de la transition",
      "popularity": 4
    }
  ]
}`;

function buildUserPrompt(songTitle, artistName, searchMode) {
  let prompt = `Chanson actuelle : "${songTitle}"`;
  if (artistName) {
    prompt += ` par ${artistName}`;
  }

  const modeDescriptions = {
    bpm: 'Recherche basée principalement sur le BPM similaire pour une transition fluide.',
    style: 'Recherche basée principalement sur le style musical / genre similaire.',
    artist: "Recherche basée principalement sur l'artiste ou des artistes similaires.",
    all: 'Recherche en prenant en compte tous les critères : BPM, style musical et artiste similaire.',
  };

  prompt += `\nMode de recherche : ${modeDescriptions[searchMode] || modeDescriptions.all}`;
  prompt += '\nPropose les 5 meilleures chansons pour faire la transition.';
  return prompt;
}

function parseAIResponse(responseText) {
  // Try to extract JSON from the response
  let jsonStr = responseText.trim();

  // If the response contains markdown code blocks, extract the JSON
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  // Try to find JSON object in the response
  const objectMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    jsonStr = objectMatch[0];
  }

  const parsed = JSON.parse(jsonStr);
  if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
    throw new Error('Invalid response format: missing recommendations array');
  }

  return parsed.recommendations.map((rec) => ({
    title: rec.title || 'Unknown',
    artist: rec.artist || 'Unknown',
    bpm: rec.bpm || 0,
    genre: rec.genre || 'Unknown',
    reason: rec.reason || '',
    popularity: Math.min(5, Math.max(1, rec.popularity || 3)),
  }));
}

// Claude (Anthropic) API
async function searchWithClaude(apiKey, songTitle, artistName, searchMode) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildUserPrompt(songTitle, artistName, searchMode),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Claude API error: ${response.status} - ${errorData.error?.message || response.statusText}`
    );
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;
  if (!text) {
    throw new Error('Empty response from Claude API');
  }

  return parseAIResponse(text);
}

// OpenAI API
async function searchWithOpenAI(apiKey, songTitle, artistName, searchMode) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: buildUserPrompt(songTitle, artistName, searchMode),
        },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`
    );
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('Empty response from OpenAI API');
  }

  return parseAIResponse(text);
}

// Gemini (Google) API
async function searchWithGemini(apiKey, songTitle, artistName, searchMode) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\n${buildUserPrompt(songTitle, artistName, searchMode)}`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.7,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Gemini API error: ${response.status} - ${errorData.error?.message || response.statusText}`
    );
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Empty response from Gemini API');
  }

  return parseAIResponse(text);
}

// Main search function
export async function searchSongRecommendations(
  provider,
  apiKey,
  songTitle,
  artistName,
  searchMode
) {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("Veuillez configurer votre clé API dans l'onglet Paramètres.");
  }

  if (!songTitle || songTitle.trim() === '') {
    throw new Error('Veuillez entrer un titre de chanson.');
  }

  switch (provider) {
    case 'claude':
      return searchWithClaude(apiKey, songTitle, artistName, searchMode);
    case 'openai':
      return searchWithOpenAI(apiKey, songTitle, artistName, searchMode);
    case 'gemini':
      return searchWithGemini(apiKey, songTitle, artistName, searchMode);
    default:
      throw new Error(`Fournisseur AI inconnu: ${provider}`);
  }
}

// Exported for testing
export { buildUserPrompt, parseAIResponse };
