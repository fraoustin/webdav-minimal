# Docker Image for webdav

generate a nginx server webdav

You can use client

- ihm on http://127.0.0.1/ (minimal ihm)
- windows : winscp https://sourceforge.net/projects/winscp/
- android : in play store you can find apps (WebDAV Navigator Lite, ...)
- linux : by nautilus (davfs://127.0.0.1/) or by davfs2 

    apt-get install davfs2

    mount.davfs http://127.0.0.1/auth /media/mywebdav

You can read https://doc.ubuntu-fr.org/davfs2


load when start image load file in

- /usr/share/gitweb/docker-entrypoint.pre
- /usr/share/gitweb/docker-entrypoint.post

## Parameter

- SET_CONTAINER_TIMEZONE (false or true) manage time of container
- CONTAINER_TIMEZONE timezone of container
- DAVUSER (default user)
- DAVPASSWORD (default pass)

## Volume

- /share

note: check authorization on directory /share

## Port

- 80 

## Command

- addauth : add user for git
- rmauth : remove user

## Usage direct

run image fraoustin/webdav-minimal

    docker run -d -v <localpath>:/share --name webdav -p 80:80 fraoustin/webdav-minimal

user default is *user* and password default is *pass*

you use http://localhost/ for access login ihm

## Usage by Dockerfile

Sample of Dockerfile

    FROM fraoustin/webdav-minimal
    COPY ./00_init.sh /usr/share/docker-entrypoint.pre/00_init.sh
    RUN chmod +x -R /usr/share/gitweb/docker-entrypoint.pre

File 00_init.sh

    #!/bin/bash
    if [ ! -z "$DAVUSER" ]; then
        addauth $DAVUSER $DAVPASSWORD
    fi    


build image mywebdav

    docker build -t mywebdav .

run image mywebdav

    docker run -d -e "CONTAINER_TIMEZONE=Europe/Paris" -e DAVUSER=myuser" -e "DAVPASSWORD=mypassword" -v <localpath>:/share --name test -p 80:80 mywebdav

You can add 5 users (DAVUSER1-5 / DAVPASSWORD1-5)


## For developer

    git clone https://github.com/fraoustin/webdav-minimal.git
    docker build -t mywebdav .
    docker run -d -v c:/users/myhome/workspace/webdav-minimal/minimal:/theme/minimal -v c:/users/myhome/downloads:/share --name test -p 8080:80 mywebdav

## External library

- wedav.js on https://github.com/aslakhellesoy/webdavjs
- siimple.xyz on http://siimple.xyz

