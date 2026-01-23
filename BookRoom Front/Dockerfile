# Dockerfile pour le Frontend BookRoom
FROM node:20-alpine

WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm ci

# Copier le code source
COPY . .

# Exposer le port Vite
EXPOSE 5173

# Commande pour le développement avec host exposé
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
