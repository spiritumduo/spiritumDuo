FROM nginx:1.21.4-alpine

COPY docker-entrypoint /
RUN chmod +x ./docker-entrypoint
ENTRYPOINT [ "/docker-entrypoint" ]
CMD ["nginx", "-g", "daemon off;"]