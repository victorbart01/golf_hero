# Mini Golf Hero

Un jeu de mini-golf minimaliste en 3D développé avec Three.js et Cannon.js pour le game jam de [Pieter Levels](https://x.com/levelsio/status/1901660771505021314).

## Description

Mini Golf Hero est un jeu de mini-golf en 3D où les joueurs frappent une balle pour la faire entrer dans un trou en aussi peu de coups que possible. Le jeu propose plusieurs parcours avec différents obstacles comme des murs, des pentes et de l'eau.

## Fonctionnalités

- Jeu de mini-golf en 3D avec physique réaliste
- Mode multijoueur local (tours alternés)
- Plusieurs parcours avec différents niveaux de difficulté
- Obstacles variés (murs, pentes, eau)
- Suivi des scores par joueur et par parcours

## Comment jouer

1. Cliquez et maintenez le bouton de la souris pour commencer à viser
2. Relâchez pour frapper la balle (la puissance augmente automatiquement)
3. Essayez de mettre la balle dans le trou en aussi peu de coups que possible
4. Une fois que tous les joueurs ont terminé un parcours, le jeu passe au parcours suivant

## Installation

### Option 1: Jouer en ligne

Visitez [URL du jeu déployé] pour jouer directement dans votre navigateur.

### Option 2: Exécuter localement

1. Clonez ce dépôt :
   ```
   git clone https://github.com/votre-nom/mini-golf-hero.git
   cd mini-golf-hero
   ```

2. Servez les fichiers avec un serveur HTTP simple :

   **Avec Python** :
   ```
   # Python 3
   python -m http.server
   
   # Python 2
   python -m SimpleHTTPServer
   ```

   **Avec Node.js** :
   ```
   # Installer http-server globalement si ce n'est pas déjà fait
   npm install -g http-server
   
   # Démarrer le serveur
   http-server
   ```

3. Ouvrez votre navigateur et accédez à `http://localhost:8000` (ou le port indiqué par votre serveur)

## Déploiement

Pour déployer le jeu en ligne, plusieurs options sont disponibles :

### GitHub Pages

1. Si vous utilisez GitHub, vous pouvez facilement déployer ce jeu sur GitHub Pages :
   ```
   git add .
   git commit -m "Version prête pour le déploiement"
   git push origin main
   ```

2. Dans les paramètres de votre dépôt GitHub, activez GitHub Pages et sélectionnez la branche `main` comme source.

### Netlify

1. Créez un compte sur [Netlify](https://www.netlify.com/)
2. Connectez votre dépôt GitHub ou téléversez directement les fichiers
3. Netlify déploiera automatiquement votre site et vous fournira une URL

### Vercel

1. Créez un compte sur [Vercel](https://vercel.com/)
2. Importez votre projet depuis GitHub ou téléversez directement les fichiers
3. Vercel déploiera automatiquement votre site et vous fournira une URL

## Technologies utilisées

- [Three.js](https://threejs.org/) - Bibliothèque JavaScript 3D
- [Cannon.js](https://schteppe.github.io/cannon.js/) - Moteur physique
- HTML5, CSS3, JavaScript

## Crédits

Développé par [Votre Nom] pour le Game Jam de Pieter Levels.

## Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails. 