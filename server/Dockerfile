FROM node:18

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
ENV NODE_ENV=development
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
