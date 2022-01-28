FROM python:3.9-slim-bullseye

RUN apt update && apt install -y gcc libpq-dev cron

WORKDIR /app
COPY core/requirements.txt core/entrypoint /app/core/
COPY core/cronjob /etc/cron.d/container_cronjob
COPY . /app

RUN python -m pip install --upgrade pip && pip install -r /app/core/requirements.txt

RUN ["chmod", "0644", "/etc/cron.d/container_cronjob"]
RUN ["crontab", "/etc/cron.d/container_cronjob"]

RUN ["chmod", "+x", "/app/core/entrypoint"]
WORKDIR /app/src
ENTRYPOINT [ "/app/core/entrypoint" ]