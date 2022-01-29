# Spiritum Duo
A docker based web app for improving clinical pathways

## Overview
Ongoing work, but this repo will hold all of the work for the modular and open-source digital pathway. Initial work will be on the Glouecestershire lung cancer pathway, but this work would implemented so that other disease sites and trusts can benefit from this work or actively on this project, and plan to expand the README file to make it easier to understand this program.

## Installation (WIP)
Before beginning, ensure .env files in each directory are populated from their examples (if appropriate)

### Notice
    If you cannot run the scripts below, getting "Permission denied", you may need to set execution permission. You can do this by running `chmod +x [SCRIPTPATH]`.

### 1. Certbot
    An initial certificate must be generated. You can do this by running `./certbot/bin/prime-certificates` from the host when no other containers are running. This is necessary because the container has to listen on port 80 for verification

### 2. Start all containers
    From the root directory, run `docker-compose up --build` and wait until completion

### 3. Backend
    The containers must be running before you can initialise the database. When this is done, run `./backend/bin/migrate-alembic` from the host while in the `/backend` directory
