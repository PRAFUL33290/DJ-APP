# 📱 Guide de Build & Déploiement - DJ PRAFUL D App

## 🎨 Nouveau Design Implémenté

Votre application a été complètement redesignée avec :

✅ **Gros bouton circulaire** facile à utiliser en live
✅ **Mode Dark/Light** (avec option Auto)
✅ **Design responsive** (Mobile, Tablette, Desktop)
✅ **Style Deezer** moderne et professionnel
✅ **Nom DJ PRAFUL D** personnalisé
✅ **Expérience plein écran** optimisée pour mobile

---

## 🚀 Option 1 : Tester avec Expo Go (Recommandé pour débuter)

### Sur votre ordinateur local

1. **Clonez le projet** (si ce n'est pas déjà fait) :
```bash
git clone https://github.com/PRAFUL33290/DJ-APP.git
cd DJ-APP
```

2. **Installez les dépendances** :
```bash
npm install
```

3. **Lancez le serveur Expo** :
```bash
npm start
```

4. **Scannez le QR code** qui apparaît dans le terminal :
   - **iPhone** : Utilisez l'app Appareil photo → Tapez sur la notification
   - **Android** : Ouvrez Expo Go → Scannez le QR code

### Sur votre smartphone

1. **Installez Expo Go** :
   - [iPhone - App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android - Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Ouvrez Expo Go** et scannez le QR code

3. **L'application se charge** et vous pouvez commencer à l'utiliser !

---

## 📦 Option 2 : Build APK/IPA (Application installable)

### Configuration initiale

1. **Installez EAS CLI** :
```bash
npm install -g eas-cli
```

2. **Connectez-vous à Expo** :
```bash
eas login
```

3. **Configurez le projet** :
```bash
eas build:configure
```

### Build Android (APK)

Pour créer une application Android installable :

```bash
# Build pour test (APK)
eas build --platform android --profile preview

# Build pour production (AAB pour Google Play)
eas build --platform android --profile production
```

**Temps estimé** : 10-20 minutes

Une fois terminé, vous recevrez un lien pour télécharger l'APK.

### Build iOS (IPA)

Pour créer une application iOS :

```bash
# Build pour test (sans App Store)
eas build --platform ios --profile preview

# Build pour production (App Store)
eas build --platform ios --profile production
```

**Note** : Nécessite un compte Apple Developer (99$/an)

---

## 🌐 Option 3 : Version Web

Votre application fonctionne aussi sur le web !

### Développement local

```bash
npm run web
```

L'application s'ouvrira dans votre navigateur sur `http://localhost:8081`

### Déploiement web

#### Sur Vercel (Gratuit)

1. **Installez Vercel CLI** :
```bash
npm install -g vercel
```

2. **Déployez** :
```bash
vercel
```

#### Sur Netlify (Gratuit)

1. **Créez un build web** :
```bash
npx expo export:web
```

2. **Déployez le dossier `web-build`** sur Netlify

---

## 🎯 Utilisation de l'Application

### Configuration initiale

1. **Ouvrez l'app** et allez dans **Paramètres** ⚙️
2. **Choisissez votre thème** : Clair ☀️, Sombre 🌙, ou Auto ⚡
3. **Sélectionnez un fournisseur AI** :
   - Claude (Anthropic) - Recommandé
   - OpenAI (GPT)
   - Gemini (Google)
4. **Entrez votre clé API**
5. **Sauvegardez** 💾

### Recherche de chansons

1. **Allez dans Recherche** 🔍
2. **Entrez le titre** de la chanson en cours
3. **(Optionnel)** Ajoutez le nom de l'artiste
4. **Sélectionnez un mode** : BPM, Style, Artiste, ou Tous
5. **Appuyez sur le gros bouton GO** 🔍
6. **Consultez les recommandations** avec BPM, genre, et raison

---

## 🔑 Obtenir une Clé API

### Claude (Anthropic) - Recommandé
- URL : [console.anthropic.com](https://console.anthropic.com)
- Crédit gratuit : 5$ de crédit d'essai
- Prix : ~15$/million de tokens

### OpenAI (GPT)
- URL : [platform.openai.com](https://platform.openai.com)
- Crédit gratuit : 5$ pour nouveaux comptes
- Prix : Variable selon le modèle

### Gemini (Google)
- URL : [aistudio.google.com](https://aistudio.google.com)
- Crédit gratuit : Généreux quota gratuit
- Prix : Gratuit jusqu'à 60 requêtes/minute

---

## 📱 Fonctionnalités Mobiles

### Optimisations Live DJ

- **Gros bouton circulaire** : 80px (mobile), 100px (tablette), 120px (desktop)
- **Interface plein écran** : Maximise l'espace utilisable
- **Mode sombre par défaut** : Réduit la fatigue oculaire en cabine
- **Responsive** : S'adapte automatiquement à la taille d'écran
- **Touches rapides** : Navigation facile entre recherche et paramètres

### Breakpoints Responsive

- **Mobile** : < 768px
- **Tablette** : 768px - 1024px
- **Desktop** : > 1024px

---

## 🐛 Dépannage

### L'app ne démarre pas

```bash
# Nettoyez le cache
rm -rf node_modules
npm install
npx expo start --clear
```

### Le QR code ne fonctionne pas

Essayez le mode tunnel :
```bash
npx expo start --tunnel
```

### Erreur de build

Vérifiez les versions avec :
```bash
npx expo-doctor
```

---

## 📚 Structure du Projet

```
DJ-APP/
├── App.js                    # Point d'entrée avec ThemeProvider
├── src/
│   ├── context/
│   │   └── ThemeContext.js   # Gestion Dark/Light mode
│   ├── screens/
│   │   ├── SearchScreen.js   # Écran de recherche (nouveau design)
│   │   └── SettingsScreen.js # Écran paramètres (nouveau design)
│   ├── components/
│   │   ├── SongCard.js       # Carte de chanson (nouveau design)
│   │   └── StarRating.js     # Notation par étoiles
│   ├── constants/
│   │   ├── theme.js          # Couleurs et constantes
│   │   └── layout.js         # Layout responsive
│   └── services/
│       └── aiService.js      # Appels API AI
```

---

## 🎉 Prochaines Étapes

1. **Testez l'app** sur votre smartphone avec Expo Go
2. **Configurez votre clé API** dans les paramètres
3. **Essayez le nouveau design** avec le gros bouton circulaire
4. **Testez le mode Dark/Light** pour voir ce que vous préférez
5. **Créez un build APK/IPA** pour une vraie app installable

---

## 💡 Conseils Pro

- **En live** : Utilisez le mode sombre pour réduire la luminosité
- **Tablette** : Parfait pour avoir plus d'espace sur les résultats
- **Desktop** : Idéal pour préparer vos sets à l'avance
- **Raccourcis** : Balayez entre les onglets pour naviguer rapidement

---

## 📞 Support

Si vous avez des questions ou problèmes :
- Ouvrez une issue sur [GitHub](https://github.com/PRAFUL33290/DJ-APP/issues)
- Consultez la [documentation Expo](https://docs.expo.dev)

---

**Bon mix ! 🎵 DJ PRAFUL D**
