# 🎧 DJ App - Song Recommendation

Application mobile pour DJ qui propose le titre de chanson suivante en rapport avec le BPM, le style musical et l'artiste.

## Fonctionnalités

- **Recherche intelligente** : Entrez un titre de chanson et obtenez des recommandations pour la transition parfaite
- **Modes de recherche** : Recherchez par BPM, style musical, artiste, ou tous les critères combinés
- **Multi-AI** : Supporte Claude (Anthropic), OpenAI (GPT), et Gemini (Google) comme fournisseurs d'IA
- **Notation de popularité** : Chaque chanson recommandée est notée de 1 à 5 étoiles selon sa popularité
- **Interface DJ** : Design sombre adapté pour une utilisation en cabine DJ

## Installation

```bash
# Cloner le repository
git clone https://github.com/PRAFUL33290/DJ-APP.git
cd DJ-APP

# Installer les dépendances
npm install

# Lancer l'application
npm start
```

## Configuration

1. Lancez l'application
2. Allez dans l'onglet **Paramètres**
3. Sélectionnez votre fournisseur AI (Claude, OpenAI ou Gemini)
4. Entrez votre clé API
5. Sauvegardez et retournez à l'onglet **Recherche**

## Utilisation

1. Entrez le titre de la chanson actuelle dans le champ de recherche
2. (Optionnel) Entrez le nom de l'artiste
3. Sélectionnez le mode de recherche :
   - **BPM** : Recherche basée sur le tempo
   - **Style** : Recherche par genre musical
   - **Artiste** : Recherche par artiste similaire
   - **Tous** : Combine tous les critères
4. Appuyez sur **Rechercher**
5. Consultez les recommandations avec leur BPM, genre, raison de la transition et note de popularité

## Technologies

- **React Native** avec **Expo**
- **React Navigation** pour la navigation entre écrans
- **API Claude** (Anthropic) - fournisseur AI par défaut
- **API OpenAI** - alternative
- **API Gemini** (Google) - alternative

## Clés API

Vous aurez besoin d'une clé API d'au moins un des fournisseurs suivants :
- [Anthropic (Claude)](https://console.anthropic.com/)
- [OpenAI](https://platform.openai.com/)
- [Google AI Studio (Gemini)](https://aistudio.google.com/)
