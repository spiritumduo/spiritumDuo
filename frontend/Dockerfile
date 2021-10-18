FROM node:latest
WORKDIR /app
COPY . .
RUN yarn install --development --silent
CMD ["yarn", "start"]