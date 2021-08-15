FROM ubuntu:latest
FROM python:3.9
RUN mkdir -p /src/web
RUN mkdir -p /src/core
WORKDIR /src
COPY core/requirements.txt /src/
RUN python -m pip install --upgrade pip && pip install -r requirements.txt
RUN apt-get -y update && apt-get -y install \
nginx \
tzdata \
uwsgi \
vim \
&& rm -rf /var/lib/apt/lists/*
RUN mkdir -p /etc/uwsgi/vassals
WORKDIR /src/web