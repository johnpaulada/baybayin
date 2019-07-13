FROM node:alpine
WORKDIR /app
COPY yarn.lock .
COPY package.json .
RUN yarn
COPY . .
CMD ["yarn", "start"]
