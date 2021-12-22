FROM nginx:1.21.4-alpine

COPY docker-entrypoint /
ENTRYPOINT [ "/docker-entrypoint" ]
CMD ["nginx", "-g", "daemon off;"]