FROM python:3.9-slim-bullseye

WORKDIR /app/core
COPY core/requirements.txt /app/core
RUN python -m pip install --upgrade pip && pip install -r requirements.txt

WORKDIR /app/src