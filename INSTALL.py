import os
import subprocess
import string
import secrets
from typing import Callable, Union
from shutil import copyfile
from time import sleep


class ComponentNotFound(Exception):
    """
    Raised when a required component
    cannot be found
    """


class FolderNotFoundError(Exception):
    """
    Raised when a folder cannot be found
    causing a fatal error.
    """


"""
we need to check if the development
environment is as optimal as possible.
Things to check are existing volumes
under the expected names (existing database)
will cause problems when building postgres 
container as credentials for pg server when
built will be different to creds stored in env
"""


class EnvironmentVariable(object):
    def __init__(
        self,
        name: str = None,
        default: Union[str, None] = None,
        description: str = None,
        cryptographic: Union[bool, None] = False,
        inputGenerator: Callable = None,
        defaultPrompt: Union[str, None] = None
    ):
        self.name: str = name
        self.default: Union[str, None] = default
        self.description: str = description
        self.cryptographic: Union[bool, None] = cryptographic
        self.inputGenerator: Union[Callable, None] = inputGenerator
        self.defaultPrompt: Union[str, None] = defaultPrompt
        self.userInput = ""

    def getEnvironmentVariableInput(self):
        print(f"\n{self.name}\n{self.description}\n")
        userInput = None
        while (
            (userInput is None) or
            (userInput == "" and (
                self.default is None and self.inputGenerator is None
            )) or (self.cryptographic and len(userInput) % 16 != 0)
        ):
            if self.default:
                userPrompt = f"Enter value ({self.default}): "
            elif self.inputGenerator:
                userPrompt = (
                    "Enter value (generates random string if no input): "
                )
            else:
                userPrompt = \
                    f"Enter value ({self.defaultPrompt or 'no default'}): "
            userInput = input(userPrompt)

        self.userInput = userInput if userInput != "" else (
            self.default or self.inputGenerator()
        )


class CommandFailed(Exception):
    """
    This is raised when a subprocess runs a
    non-correct/complete exit code
    """


def runCommand(*args, **kwargs):
    proc = subprocess.run(*args, **kwargs)
    if str(proc.returncode) != "0":
        raise CommandFailed(f"Process returned exit code {proc.returncode}")
    return proc


def validateInput(message: str, selection: list):
    userInput = None
    selection = [x.lower() for x in selection]
    while userInput not in selection:
        userInput = input(message).lower()
    return userInput


def generateRandomKey():
    chars = string.ascii_uppercase + string.ascii_lowercase + string.digits
    return ''.join(secrets.choice(chars) for _ in range(32))


def generateRandomPassword():
    chars = string.ascii_uppercase + string.ascii_lowercase + string.digits
    return ''.join(secrets.choice(chars) for _ in range(8))


# CONFIGURATION
ENV_DEFS = {
    "backend": {
        "DATABASE_NAME": EnvironmentVariable(
            name="DATABASE_NAME",
            default="sd_backend",
            description="Name of database table"
        ),
        "DECISION_POINT_LOCKOUT_DURATION": EnvironmentVariable(
            name="DECISION_POINT_LOCKOUT_DURATION",
            default=600000,
            description="Length of cookie lifespan in milliseconds"
        ),
        "HOSPITAL_NUMBER_NAME": EnvironmentVariable(
            name="HOSPITAL_NUMBER_NAME",
            default="MRN",
            description="Name of database table"
        ),
        "HOSPITAL_NUMBER_REGEX": EnvironmentVariable(
            name="HOSPITAL_NUMBER_REGEX",
            default="^fMRN[0-9]{6}$",
            description="Username of database account"
        ),
        "NATIONAL_NUMBER_NAME": EnvironmentVariable(
            name="NATIONAL_NUMBER_NAME",
            default="NHS",
            description="Password of database account"
        ),
        "NATIONAL_NUMBER_REGEX": EnvironmentVariable(
            name="NATIONAL_NUMBER_REGEX",
            default="^fNHS[0-9]{9}$",
            description="Length of cookie lifespan in milliseconds"
        ),
    },
    "pseudotie": {
        "DATABASE_NAME": EnvironmentVariable(
            name="DATABASE_NAME",
            default="sd_pseudotie",
            description="Name of database table"
        ),
    },
    "backend-and-pseudotie": {
        "DATABASE_HOSTNAME": EnvironmentVariable(
            name="DATABASE_HOSTNAME",
            default="sd-postgres",
            description="Hostname of postgres database server"
        ),
        "DATABASE_PORT": EnvironmentVariable(
            name="DATABASE_PORT",
            default="5432",
            description="Port of postgres database"
        ),
        "DATABASE_USERNAME": EnvironmentVariable(
            name="DATABASE_USERNAME",
            default="sd_postgres",
            description="Username of database account"
        ),
        "DATABASE_PASSWORD": EnvironmentVariable(
            name="DATABASE_PASSWORD",
            default=None,
            description="Password of database account",
            inputGenerator=generateRandomPassword
        ),
        "SESSION_SECRET_KEY": EnvironmentVariable(
            name="SESSION_SECRET_KEY",
            default=None,
            description=(
                "Secret key for session key signatures"
                " (MUST BE MULTIPLE OF SIXTEEN)"
            ),
            cryptographic=True,
            inputGenerator=generateRandomKey
        ),
        "SESSION_EXPIRY_LENGTH": EnvironmentVariable(
            name="SESSION_EXPIRY_LENGTH",
            default=21600,
            description="Length of cookie lifespan in seconds"
        ),
        "UPDATE_ENDPOINT_KEY": EnvironmentVariable(
            name="UPDATE_ENDPOINT_KEY",
            default=None,
            description=(
                "Key to authenticate between backend and pseudotie"
                " (MUST BE MULTIPLE OF SIXTEEN)"
            ),
            cryptographic=True,
            inputGenerator=generateRandomKey
        ),
    },
    "nginx": {
        "PRIMARY_HOSTNAME": EnvironmentVariable(
            name="PRIMARY_HOSTNAME",
            default="localhost",
            description="Address NGINX will listen on"
        ),
        "ALTERNATIVE_HOSTNAME": EnvironmentVariable(
            name="ALTERNATIVE_HOSTNAME",
            default="sddev.local",
            description=(
                "Alternative address NGINX will listen on"
                " (typically www. on production environment)"
            )
        ),
        "SSL_EMAIL": EnvironmentVariable(
            name="SSL_EMAIL",
            default=None,
            description=(
                "Address for LetsEncrypt SSL certificates"
                " (not used in dev environment)"
            ),
            defaultPrompt="please enter a valid email address"
        ),
    },
    "wordpress": {
        "WORDPRESS_DB_NAME": EnvironmentVariable(
            name="WORDPRESS_DB_NAME",
            default="sd_wordpress",
            description="Wordpress database name",
        ),
        "WORDPRESS_DB_USER": EnvironmentVariable(
            name="WORDPRESS_DB_USER",
            default="wordpress",
            description="Wordpress database username"
        ),
        "WORDPRESS_DB_PASSWORD": EnvironmentVariable(
            name="WORDPRESS_DB_PASSWORD",
            default=None,
            description="Wordpress database password",
            inputGenerator=generateRandomPassword
        ),
    },
    "mysql": {
        "MYSQL_ROOT_PASSWORD": EnvironmentVariable(
            name="MYSQL_ROOT_PASSWORD",
            default=None,
            description="Wordpress database server root password",
            inputGenerator=generateRandomPassword
        ),
    }
}

print("""
    ##### SPIRITUM DUO INSTALLER #####

    1. Check Docker's installed
    2. Check Docker Compose is installed
    3. Gather environment variables
    4. Configuring docker compose file from template
    5. Build frontend node modules
    6. Build containers
    7. Migrate database schemas
    8. Restart containers
    9. Give option between manage + manage-demo scripts
    10. Display endpoint + login information

""")

print("\n1. Check project files exist")
for path in [
    "backend",
    "frontend",
    "mysql",
    "nginx",
    "postgres",
    "pseudotie",
    "wordpress"
]:
    if not os.path.exists(path):
        raise FolderNotFoundError(
            f"path '{path}' cannot be found! Program terminating"
        )
print("Success!")


DOCKER_PRESENT = False
DOCKER_COMPOSE_PRESENT = False

print("\n2. Check Docker's installed")
DOCKER_PRESENT = "docker version" in str(subprocess.getoutput(
    "docker --version"
)).lower()
if DOCKER_PRESENT:
    print("Success! Docker found!")
else:
    raise ComponentNotFound("Docker cannot be found!")

print("\n3. Check Docker Compose is installed")
DOCKER_COMPOSE_PRESENT = "compose version" in str(subprocess.getoutput(
   "docker-compose --version"
)).lower()
if DOCKER_COMPOSE_PRESENT:
    print("Success! Docker Compose found!")
else:
    raise ComponentNotFound("Docker Compose cannot be found!")

print("\n4. Gather environment variables")
print("NOTE: TO USE DEFAULT OR GENERATED VALUE, LEAVE INPUT EMPTY")
for serviceName, variableList in ENV_DEFS.items():
    print(f"\n##########\nVARIABLES FOR SERVICE: {serviceName}\n##########")
    for varName, varObject in variableList.items():
        varObject.getEnvironmentVariableInput()


createOrOverrideEnvFile = True
if os.path.exists("postgres/.env"):
    createOrOverrideEnvFile = validateInput(
        "Do you wish to override this file (postgres/.env)? (Y/n): ",
        ["y", "n"]
    ).lower() == "y"

if createOrOverrideEnvFile:
    buffer = []
    buffer.append(
        f"POSTGRES_DB = \"{ENV_DEFS['backend']['DATABASE_NAME'].userInput}\"\n"
    )
    buffer.append(
        "POSTGRES_USER = "
        f"\"{ENV_DEFS['backend-and-pseudotie']['DATABASE_USERNAME'].userInput}"
        "\"\n")
    buffer.append(
        "POSTGRES_PASSWORD = "
        f"\"{ENV_DEFS['backend-and-pseudotie']['DATABASE_PASSWORD'].userInput}"
        "\"\n")
    file = open("postgres/.env", "w")
    file.writelines(buffer)
    file.close()


createOrOverrideEnvFile = True
if os.path.exists("backend/.env"):
    createOrOverrideEnvFile = validateInput(
        "Do you wish to override this file (backend/.env)? (Y/n): ",
        ["y", "n"]      # add yes/no and more obvious options
    ).lower() == "y"

if createOrOverrideEnvFile:
    buffer = []
    for varName, varObject in ENV_DEFS["backend"].items():
        buffer.append(f"{varName} = \"{varObject.userInput}\"\n")
    for varName, varObject in ENV_DEFS["backend-and-pseudotie"].items():
        buffer.append(f"{varName} = \"{varObject.userInput}\"\n")

    file = open("backend/.env", "w")
    file.writelines(buffer)
    file.close()


createOrOverrideEnvFile = True
if os.path.exists("pseudotie/.env"):
    createOrOverrideEnvFile = validateInput(
        "Do you wish to override this file (pseudotie/.env)? (Y/n): ",
        ["y", "n"]
    ).lower() == "y"

if createOrOverrideEnvFile:
    buffer = []
    for varName, varObject in ENV_DEFS["pseudotie"].items():
        buffer.append(f"{varName} = \"{varObject.userInput}\"\n")
    for varName, varObject in ENV_DEFS["backend-and-pseudotie"].items():
        buffer.append(f"{varName} = \"{varObject.userInput}\"\n")

    file = open("pseudotie/.env", "w")
    file.writelines(buffer)
    file.close()


createOrOverrideEnvFile = True
if os.path.exists("nginx/.env"):
    createOrOverrideEnvFile = validateInput(
        "Do you wish to override this file (nginx/.env)? (Y/n): ",
        ["y", "n"]
    ).lower() == "y"

if createOrOverrideEnvFile:
    buffer = []
    for varName, varObject in ENV_DEFS["nginx"].items():
        buffer.append(f"{varName} = \"{varObject.userInput}\"\n")

    file = open("nginx/.env", "w")
    file.writelines(buffer)
    file.close()


createOrOverrideEnvFile = True
if os.path.exists("wordpress/.env"):
    createOrOverrideEnvFile = validateInput(
        "Do you wish to override this file (wordpress/.env)? (Y/n): ",
        ["y", "n"]
    ).lower() == "y"

if createOrOverrideEnvFile:
    buffer = []
    for varName, varObject in ENV_DEFS["wordpress"].items():
        buffer.append(f"{varName} = \"{varObject.userInput}\"\n")

    file = open("wordpress/.env", "w")
    file.writelines(buffer)
    file.close()


createOrOverrideEnvFile = True
if os.path.exists("mysql/.env"):
    createOrOverrideEnvFile = validateInput(
        "Do you wish to override this file (mysql/.env)? (Y/n): ",
        ["y", "n"]
    ).lower() == "y"

if createOrOverrideEnvFile:
    buffer = []
    buffer.append(
        "MYSQL_USER = "
        f"\"{ENV_DEFS['wordpress']['WORDPRESS_DB_USER'].userInput}\"\n")
    buffer.append(
        "MYSQL_PASSWORD = "
        f"\"{ENV_DEFS['wordpress']['WORDPRESS_DB_PASSWORD'].userInput}\"\n")
    buffer.append(
        "MYSQL_ROOT_PASSWORD = "
        f"\"{ENV_DEFS['mysql']['MYSQL_ROOT_PASSWORD'].userInput}\"\n")
    file = open("mysql/.env", "w")
    file.writelines(buffer)
    file.close()


print("\n5. Configuring docker compose file from template")

copyfile("docker-compose.dev.yml.example", "docker-compose.dev.yml")
print("Success!")


print("\n6. Build frontend node modules")
print("NOTE: this may take time, depending on computer configuration\n")

sleep(2)
os.chdir("frontend")
runCommand("./bin/update-node-modules")
sleep(2)

print("\n7. Build containers")
os.chdir("..")
runCommand(
    "docker-compose -f docker-compose.dev.yml up -d --build"
    " sd-backend sd-pseudotie", shell=True)
sleep(5)

print("\n8. Migrate database schemas")
print("Waiting...")
runCommand(
    "docker exec -ti sd-backend"
    " bash -c 'chmod +x ./bin/container-migrate-alembic &&"
    " ./bin/container-migrate-alembic'", shell=True)
runCommand(
    "docker exec -ti sd-pseudotie"
    " bash -c 'chmod +x ./bin/container-migrate-alembic &&"
    " ./bin/container-migrate-alembic'", shell=True)

print("\n9. Restart containers")
runCommand(
    "docker-compose -f docker-compose.dev.yml down",
    shell=True)
sleep(5)
runCommand(
    "docker-compose -f docker-compose.dev.yml up -d --build",
    shell=True)

sleep(10)

print("\n10. Insert test data")
print(
    "NOTE: IF THE REGEX PATTERN FOR HOSPITAL OR NATIONAL NUMBER HAS CHANGED,"
    " THIS STEP WILL FAIL!"
)
print(
    "NOTE: TO REMEDY THIS, CHANGE THE FORMAT OF GENERATED STRINGS IN"
    " MANAGE.PY OR ADD DATA MANUALLY!")
subprocess.run(
    "docker exec -ti sd-backend bash -c 'python manage.py'",
    shell=True)

print("""
    ***************************
            SPIRITUMDUO
    ***************************

    INSTALLATION SUCCESSFUL

    LISTENING ON
        - localhost/app

    NOTE: it may take anywhere
    from a few seconds to
    minutes for the frontend to
    launch for the first time
""")
