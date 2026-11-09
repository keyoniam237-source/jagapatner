# Website statis JAGA — disajikan dengan nginx
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
COPY jaga-logo.svg /usr/share/nginx/html/jaga-logo.svg
EXPOSE 80
