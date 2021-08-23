FROM ubuntu:20.04
# Get Node.js 16
RUN apt-get update && apt-get install -y curl sudo
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
RUN sudo apt-get install -y nodejs
RUN mkdir -p /src/frontend
WORKDIR /src/frontend
