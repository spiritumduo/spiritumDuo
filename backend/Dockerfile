FROM python:3.9-slim-bullseye

RUN apt update && apt install -y gcc libpq-dev cron

WORKDIR /app/core
COPY core/requirements.txt /app/core
COPY core/cronjob /etc/cron.d/container_cronjob
COPY core/entrypoint /app/core

RUN python -m pip install --upgrade pip && pip install -r requirements.txt

RUN ["chmod", "0644", "/etc/cron.d/container_cronjob"]
RUN ["crontab", "/etc/cron.d/container_cronjob"]

RUN ["chmod", "+x", "/app/core/entrypoint"]
WORKDIR /app/src
ENTRYPOINT [ "/app/core/entrypoint" ]