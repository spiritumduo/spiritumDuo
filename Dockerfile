FROM ubuntu:20.04
FROM python:3.9
RUN mkdir -p /src/web
RUN mkdir -p /src/core
WORKDIR /tmp
COPY core/requirements.txt /tmp/
RUN python -m pip install --upgrade pip && pip install -r requirements.txt
RUN apt-get -y update && apt-get -y install \
nginx=1.14.2-2+deb10u4 \
nodejs=10.24.0~dfsg-1~deb10u1 \
tzdata=2021a-0+deb10u1 \
uwsgi=2.0.18-1 \
vim=2:8.1.0875-5 \
&& rm -rf /var/lib/apt/lists/*
# Need to install npm from source to get a version (V7) that is compatible with nodejs v10. Using 'apt-get install' does not get the most recent version (only V5)
COPY core/npmInstall.sh /tmp/
RUN ./npmInstall.sh 7.20.6
RUN mkdir -p /etc/uwsgi/vassals
WORKDIR /src/web