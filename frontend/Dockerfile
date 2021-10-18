FROM node:latest
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install --development --silent
CMD ["yarn", "start"]