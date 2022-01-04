FROM node:16.13-alpine
WORKDIR /app
COPY . .
RUN yarn install --development --silent
RUN npm install -g serve
RUN yarn build
CMD ["yarn", "serve"]