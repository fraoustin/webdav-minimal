FROM debian as builder
LABEL maintainer="Frederic Aoustin <fraoustin@gmail.com>"

RUN apt-get update && apt-get install -y \
        minify \
    && rm -rf /var/lib/apt/lists/* 

RUN mkdir /theme
RUN mkdir /theme/minimal
COPY ./minimal/ /theme/minimal/
WORKDIR /theme/minimal/login
RUN minify -o login.css login.css
RUN minify -o login.js login.js
WORKDIR /theme/minimal/minimal
RUN minify -o auth.js auth.js
RUN minify -o auth.css auth.css
RUN minify -o webdav.js webdav.js

FROM nginx:1.21

ENV SET_CONTAINER_TIMEZONE false 
ENV CONTAINER_TIMEZONE "" 

# manage user www-data
RUN usermod -u 1000 www-data

# manage start container
COPY ./src/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

RUN mkdir /usr/share/docker-entrypoint.pre
RUN mkdir /usr/share/docker-entrypoint.post
COPY ./src/00_init.sh /usr/share/docker-entrypoint.pre/00_init.sh
RUN chmod +x -R /usr/share/docker-entrypoint.pre

# install extra nginx
RUN apt-get update && apt-get install -y \
        apache2-utils \
        nginx-extras \
    && rm -rf /var/lib/apt/lists/* 

COPY ./src/default.conf /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/sites-enabled/default

# add cmd nginx
COPY ./src/cmd/addauth.sh /usr/bin/addauth
COPY ./src/cmd/rmauth.sh /usr/bin/rmauth
RUN chmod +x /usr/bin/addauth
RUN chmod +x /usr/bin/rmauth

# add theme
RUN mkdir /theme
RUN mkdir /theme/minimal
WORKDIR /theme/minimal
COPY --from=builder /theme/minimal /theme/minimal
#COPY ./minimal/ /theme/minimal/

RUN mkdir /login
RUN mkdir /share
VOLUME /share

ENV DAVUSER user
ENV DAVPASSWORD pass

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
CMD ["app"]
