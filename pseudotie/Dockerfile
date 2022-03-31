FROM python:3.9-slim-bullseye

RUN apt update && apt install -y gcc libpq-dev cron

WORKDIR /app
COPY . .
COPY core/cronjob /etc/cron.d/container_cronjob

RUN useradd -m docker

RUN ["chmod", "0644", "/etc/cron.d/container_cronjob"]
RUN ["chmod", "+x", "/app/core/entrypoint"]
RUN ["chown", "-R", "docker", "/app/src/alembic"]

RUN python -m pip install --upgrade pip && pip install -r core/requirements.txt

USER docker

RUN ["crontab", "/etc/cron.d/container_cronjob"]

WORKDIR /app/src
ENTRYPOINT [ "/app/core/entrypoint" ]