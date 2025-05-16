FROM nginx:stable-alpine3.21-slim

# move the website to the folder nginx needs and clear before it too
RUN rm -rf /usr/share/nginx/html
COPY static /usr/share/nginx/html
