FROM node:16.13-alpine
WORKDIR /app
COPY . .
RUN yarn install --development --silent
CMD ["yarn", "start"]