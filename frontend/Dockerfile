FROM node:22.14.0-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

EXPOSE 5173

# Start the dev server
CMD ["npm", "run", "dev"]
