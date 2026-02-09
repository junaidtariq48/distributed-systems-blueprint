FROM node:24-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG APP
RUN npm run build -- ${APP}

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist

ARG APP
ENV APP_NAME=${APP}

CMD ["sh", "-c", "node dist/apps/${APP_NAME}/main.js"]
