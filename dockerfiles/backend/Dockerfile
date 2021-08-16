FROM ubuntu:20.04
FROM python:3.9
RUN mkdir -p /src/web
RUN mkdir -p /src/core
RUN mkdir -p /etc/uwsgi/vassals
# python dependencies
WORKDIR /tmp
COPY core/requirements.txt /tmp/
RUN python -m pip install --upgrade pip && pip install -r requirements.txt
# Node js V16
RUN apt-get update && apt-get install -y curl sudo
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
RUN sudo apt-get install -y nodejs
# Other packages
RUN apt-get -y update && apt-get -y install \
nginx=1.14.2-2+deb10u4 \
tzdata=2021a-0+deb10u1 \
uwsgi=2.0.18-1 \
vim=2:8.1.0875-5 \
&& rm -rf /var/lib/apt/lists/*
WORKDIR /src/web