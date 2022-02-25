# Initial build image
FROM node:16.13-alpine as build
WORKDIR /app
COPY ./frontend .
RUN yarn install --silent && yarn build

# Final target
FROM nginx:1.21.4-alpine
COPY --from=build /app/build /var/www/app
COPY nginx/docker-entrypoint /
COPY nginx/nginx.conf.template /etc/nginx/conf.d
RUN chmod +x ./docker-entrypoint
ENTRYPOINT [ "/docker-entrypoint" ]
CMD ["nginx", "-g", "daemon off;"]