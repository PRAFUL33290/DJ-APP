# 🎧 DJ PRAFUL D - Live Mix Assistant

Application mobile professionnelle pour DJ qui propose les meilleures transitions musicales grâce à l'intelligence artificielle.

## ✨ Fonctionnalités

### 🎵 Recherche Intelligente
- **Gros bouton circulaire** optimisé pour utilisation en live
- Recommandations basées sur BPM, style musical et artiste
- Interface **plein écran** sur mobile
- **4 modes de recherche** : BPM, Style, Artiste, ou Tous les critères

### 🎨 Design Professionnel
- **Style Deezer** moderne et élégant
- **Mode Dark/Light** avec option Auto
- **Responsive** : Mobile, Tablette, Desktop
- Cartes de résultats détaillées avec raisons des recommandations

### 🤖 Multi-IA
- **Claude (Anthropic)** - Recommandé
- **OpenAI (GPT)** - Alternative
- **Gemini (Google)** - Alternative

### 🎯 Optimisé pour DJ
- Notation de popularité (1-5 étoiles)
- Interface adaptée pour cabine DJ
- Navigation rapide entre recherche et paramètres
- Nom du DJ personnalisé : **DJ PRAFUL D**

## 📱 Installation & Utilisation

### Développement Local

```bash
# Cloner le repository
git clone https://github.com/PRAFUL33290/DJ-APP.git
cd DJ-APP

# Installer les dépendances
npm install

# Lancer l'application
npm start           # Mode développement avec Expo
npm run web         # Mode web (navigateur)
npm run android     # Mode Android
npm run ios         # Mode iOS
```

### 🚀 Build pour Expo Go

Consultez le guide complet : [EXPO_BUILD_GUIDE.md](./EXPO_BUILD_GUIDE.md)

**Option 1 - Expo Go (Rapide)** :
1. Installez [Expo Go](https://expo.dev/client) sur votre smartphone
2. Lancez `npm start`
3. Scannez le QR code

**Option 2 - Build APK/IPA** :
```bash
# Installer EAS CLI
npm install -g eas-cli

# Build Android
eas build --platform android --profile preview

# Build iOS
eas build --platform ios --profile preview
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
