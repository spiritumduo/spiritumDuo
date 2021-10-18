FROM ubuntu:20.04
FROM python:3.9

# python dependencies
WORKDIR /tmp
COPY backend/core/requirements.txt /tmp/
RUN python -m pip install --upgrade pip && pip install -r requirements.txt

# Other packages
RUN apt-get -y update && apt-get -y install \
nginx=1.18.0-6.1 \
uwsgi=2.0.19.1-7.1 \
&& rm -rf /var/lib/apt/lists/*

# Working directory
RUN mkdir -p /src/djangoProject
WORKDIR /src/djangoProject
