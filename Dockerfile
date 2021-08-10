FROM ubuntu:latest
FROM python:3.9
RUN mkdir -p /src/web
RUN mkdir -p /src/core
WORKDIR /src
COPY core/requirements.txt /src/
RUN pip install -r requirements.txt
RUN apt-get -y update
RUN apt-get -y install uwsgi nginx tzdata vim
RUN mkdir -p /etc/uwsgi/vassals
WORKDIR /src/web