FROM node:lts-iron AS builder
WORKDIR /usr/bot

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:lts-iron AS runner
WORKDIR /usr/bot

COPY package.json .
COPY package-lock.json .
COPY ./locales ./locales

RUN npm install --omit=dev

COPY --from=builder /usr/bot/dist/ ./dist
COPY ./src/*.json ./dist

USER node

CMD [ "npm", "start" ]
