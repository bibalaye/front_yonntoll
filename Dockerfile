# Utiliser une image Node.js officielle comme image de base
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json (si disponible)
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Copier les fichiers et dossiers du projet dans le répertoire de travail du conteneur
COPY . .

# Construire l'application pour la production
RUN npm run build

# Exposer le port sur lequel l'application s'exécute
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]