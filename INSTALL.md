# Installation (development environment)

## Installation prerequisites

1. Git
2. Docker (with Docker Compose)
3. A clone of this repository (`git clone http://github.com/spiritumduo/spiritumDuo`)

## Terms

|Term|Description
---|---|
|Project's root directory|The topmost directory of the project (where the individual container folders are)

## Automated installer

For an automated install of a development environment please run the Python script in the project's root directory, `INSTALL.dev.py`.

### Steps

1. Check Docker is installed
2. Check Docker Compose is installed
3. Check if containers are running
4. Check if database volume already exists
5. Gather environment variables
6. Configuring Docker Compose file from template
7. Build frontend node modules
8. Build containers
9. Migrate database schema
10. Restart containers
11. Insert test data

### Where to find generated strings

If you have chosen to generate random strings for some variables, the value can be seen in the `.env` file in the service folder (backend/.env, etc).

### Notes

#### Gather environment variables

Example

```
DATABASE_NAME
Name of database table

Enter value (sd_pseudotie):
```

The value in brackets is the default value. To continue using the default value, do not enter any data and press enter.

## Configuring environmental variables

1. Duplicate and rename each `.env.example` files to `.env`
    1. `postgres/.env.example`
    2. `backend/.env.example`
    3. `pseudotie/.env.example`
    4. `nginx/.env.example`
    5. `mysql/.env.example`
    6. `wordpress/.env.example`

### postgres/.env

These define the database settings, the database and user account is automatically configured when the container is built for the first time

- POSTGRES_DB
  - This is the name of the database
- POSTGRES_USER
  - This is the username of the user account
- POSTGRES_PASSWORD
  - This is the password of the user account

### backend/.env

- DATABASE_HOSTNAME
  - This should be set to `sd-postgres` if it hasn't been changed otherwise
- DATABASE_USERNAME
  - This should be equal to `POSTGRES_USER` in `backend\.env`
- DATABASE_PASSWORD
  - This should be equal to `POSTGRES_PASSWORD` in `backend\.env`
- DATABASE_NAME
  - This should be equal to `POSTGRES_DB` in `backend\.env`
- DATABASE_PORT
  - By default, this is 5432
- HOSPITAL_NUMBER_NAME
  - This is the identifier for hospital numbers (ie. MRN)
- HOSPITAL_NUMBER_REGEX
  - This is the regex pattern for the hospital number
  - NOTE: this is incorrect for demonstration purposes, to ensure it is not a real identifier
- NATIONAL_NUMBER_NAME
  - This is the identifier for national numbers (ie. NHS)
- NATIONAL_NUMBER_REGEX
  - This is the regex pattern for the national number
  - NOTE: this is incorrect for demonstration purposes, to ensure it is not a real identifier
- SESSION_SECRET_KEY
  - This is the secret key for encrypting the session cookies
  - The length of this must be a multiple of 16
- SESSION_EXPIRY_LENGTH
  - This is the length of the session cookie lifespan in seconds. After this time has expired, the cookie is no longer valid
- UPDATE_ENDPOINT_KEY
  - This is the key for communication between the pseudotie and the backend services
  - The length of this must be a multiple of 16
- DEBUG_DISABLE_PERMISSION_CHECKING
  - This is a debug toggle to disable permission checking for the GraphQL endpoint
- TESTING
  - This sets the backend into testing mode, where a new non-persistant database is generated to be used with tests

### pseudotie/.env

- DATABASE_HOSTNAME
  - This should be set to `sd-postgres` if it hasn't been changed otherwise
- DATABASE_PORT
  - By default, this is `5432`
- DATABASE_USERNAME
  - This should be equal to `POSTGRES_USER` in `backend\.env`
- DATABASE_PASSWORD
  - This should be equal to `POSTGRES_PASSWORD` in `backend\.env`
- DATABASE_NAME
  - By default, this is `pseudotie`
- SESSION_SECRET_KEY
  - This should be equal to `SESSION_SECRET_KEY`  in `backend/.env`
- UPDATE_ENDPOINT_KEY
  - This should be equal to `UPDATE_ENDPOINT_KEY`  in `backend/.env`

### nginx/.env

- PRIMARY_HOSTNAME
  - This is the primary hostname NGINX will listen on. For a dev environment, it's safe to leave this as `localhost`
- ALTERNATIVE_HOSTNAME
  - This is an alternative hostname NGINX will **also** listen on. This can be anything, but is usually used if two sites need to be listened on (www. and non-www.)
- SSL_EMAIL
  - This is the email address that will be used for LetsEncrypt SSL certificate generation. This is not used in a developer environment

### mysql/.env

These define the database settings as used by the wordpress landing page. The database and database user account will be created automatically on container build

- MYSQL_USER
  - This is the name of the database user the wordpress site will use
- MYSQL_PASSWORD
  - This is the password of the database user the wordpress site will use
- MYSQL_ROOT_PASSWORD
  - This is the password of the database's root user

### wordpress/.env

- WORDPRESS_DB_NAME
  - This is the database name the wordpress site will use
- WORDPRESS_DB_USER
  - This is the name of the database user the wordpress site will use
- WORDPRESS_DB_PASSWORD
  - This is the password of the database user the wordpress site will use

## Configure `docker-compose.dev.yml`

`docker-compose.dev.yml.example` is configured to load all services required for a full development environment. If you are not modifying React components, you can disable `sd-frontend-sb` (storybook) by commenting that service out for less overhead.

1. Duplicate `docker-compose.dev.yml.example` and rename it to `docker-compose.dev.yml`
2. As above, if necessary make any changes

## Building node modules

### NOTE: this may display warnings around peer dependancy versions, typically these can be ignored

1. Change directory into `frontend/`
2. Set execution permissions on the `update-node-modules` script (`chmod +x ./bin/update-node-modules && ./bin/update-node-modules`).
Depending on resources and configuration, the time this takes can vary dramatically.

## Build all containers

The containers need to be built to create database schemas for both `backend` and `pseudotie`. This will download the container images and configure them.

1. Change directory to the project's root
2. Run `docker-compose -f docker-compose.dev.yml up -d --build`

## Import database schemas

The containers must be running before the database can be migrated.

1. From the project's root directory, run:

```bash
docker exec -ti sd-backend bash -c "chmod +x ./bin/container-migrate-alembic && ./bin/container-migrate-alembic"
```

2. From the project's root directory, run:

```bash
docker exec -ti sd-pseudotie bash -c "chmod +x ./bin/container-migrate-alembic && ./bin/container-migrate-alembic"
```

3. Run `docker-compose -f docker-compose.dev.yml down`
4. Run `docker-compose -f docker-compose.dev.yml up -d`

## Insert test data

### NOTE

You may run this script multiple times, however you may need to clear the `pseudotie` database if the script displays HTTP 409 or `409 conflict`.
You can do this by:

- Dropping the postgres volume (`docker volume rm spiritumduo_sd_postgres_data`) and re-running database migrations (see 'Import database schemas' above)
- Manually deleting data using a database IDE like [pgadmin (FOSS)](https://www.pgadmin.org/) or [DataGrip (paid software)](https://www.jetbrains.com/datagrip/)

To insert a single test user and batch of test patients.

1. From the project's root directory, run

```bash
docker exec -ti sd-backend python manage.py
```

## Done!

If the steps above have been completed successfully, you should be able to connect to the application. By default, the app
will be listening on `http://localhost:8080/app`.

### NOTES

- The containers are set to restart automatically unless they are told to, by the user or if they crash out
- The frontend containers may take a few minutes to listen (for you to connect)
