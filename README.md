# Spiritum Duo Docker
I have decided to take the Spiritum Duo and put it in containers!

## Overview
Ongoing work, but this repo will hold all of the work for the modular and open-source digital pathway. Initial work will be on the Glouecestershire lung cancer pathway, but this work would implemented so that other disease sites and trusts can benefit from this work
or actively on this project, and plan to expand the README file to make it easier to understand this program.

i will add more detail soon.

## Installation (WIP)
Before beginning, ensure .env files in each directory are populated from their examples (if appropriate)

### Frontend
    The containers must not be running before you can initialise node modules. You can build node modules by running `./frontend/bin/update-node-modules` from the host while in the `/frontend` directory

### Certbot
    An initial certificate must be generated. You can do this by running `./certbot/bin/prime-certificates` from the host when no other containers are running. This is necessary because the container has to listen on port 80 for verification

### Backend
    The containers must be running before you can initialise the database. When this is done, run `./backend/bin/migrate-alembic` from the host while in the `/backend` directory

### NGINX
    - No further configuration is required outside of .env variables