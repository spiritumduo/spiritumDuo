FROM ubuntu:20.04
FROM python:3.9

# python dependencies
WORKDIR /tmp
COPY backend/core/requirements.txt /tmp/
RUN python -m pip install --upgrade pip && pip install -r requirements.txt

# Other packages
RUN apt-get -y update && apt-get -y install \
nginx=1.14.2-2+deb10u4 \
tzdata=2021a-0+deb10u1 \
uwsgi=2.0.18-1 \
vim=2:8.1.0875-5 \
&& rm -rf /var/lib/apt/lists/*

# Working directory
RUN mkdir -p /src/djangoProject
WORKDIR /src/djangoProject