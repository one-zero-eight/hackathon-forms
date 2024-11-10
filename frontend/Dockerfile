FROM node:20-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3000
ENV NODE_ENV=production
RUN ["npm run dev", "--", "-p 3000", "-H"]
