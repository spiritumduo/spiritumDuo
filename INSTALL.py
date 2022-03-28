import os
import subprocess
from typing import Union


class ComponentNotFound(Exception):
    """
    Raised when a required component
    cannot be found
    """


class EnvironmentVariable(object):
    def __init__(
        self,
        name: str = None,
        default: Union[str, None] = None,
        description: str = None,
        cryptographic: Union[bool, None] = False
    ):
        self.name = name
        self.default = default
        self.description = description
        self.cryptographic = cryptographic

        self.userInput = ""

    def getEnvironmentVariableInput(self):
        print(f"\n{self.name}\n{self.description}\n")
        userInput = None
        while (
            (userInput is None) or
            (userInput == "" and self.default is None) or
            (self.cryptographic and len(userInput) % 16 != 0)
        ):
            userInput = input(f"Enter value ({self.default}): ")

        self.userInput = userInput if userInput != "" else self.default


def validateInput(message: str, selection: list):
    userInput = None
    selection = [x.lower() for x in selection]
    while userInput not in selection:
        userInput = input(message)
    return userInput


# CONFIGURATION
ENV_DEFS = {
    "backend": {
        "DATABASE_NAME": EnvironmentVariable(
            name="DATABASE_NAME",
            default="sd_backend",
            description="Name of database table"
        ),
        "DATABASE_USERNAME": EnvironmentVariable(
            name="DATABASE_USERNAME",
            default="sd_backend",
            description="Username of database account"
        ),
        "DATABASE_PASSWORD": EnvironmentVariable(
            name="DATABASE_PASSWORD",
            default=None,
            description="Password of database account"
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
        "DATABASE_USERNAME": EnvironmentVariable(
            name="DATABASE_USERNAME",
            default="sd_postgres",
            description="Username of database account"
        ),
        "DATABASE_PASSWORD": EnvironmentVariable(
            name="DATABASE_PASSWORD",
            default=None,
            description="Password of database account"
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
        "SESSION_SECRET_KEY": EnvironmentVariable(
            name="SESSION_SECRET_KEY",
            default=None,
            description=(
                "Secret key for session key signatures"
                " (MUST BE MULTIPLE OF SIXTEEN)"
            ),
            cryptographic=True
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
            cryptographic=True
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
            )
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
        ),
    },
    "mysql": {
        "MYSQL_ROOT_PASSWORD": EnvironmentVariable(
            name="MYSQL_ROOT_PASSWORD",
            default=None,
            description="Wordpress database server root password",
        ),
    }
}

print("""
    ##### SPIRITUM DUO INSTALLER #####

    1. Check Docker's installed
    2. Check Docker Compose is installed
    3. Gather environment variables
    4. Build frontend node modules
    5. Start containers
    6. Migrate database schemas
    7. Restart containers
    8. Give option between manage + manage-demo scripts
    9. Display endpoint + login information
    10. Profit

""")

DOCKER_PRESENT = False
DOCKER_COMPOSE_PRESENT = False

print("1. Check Docker's installed")
DOCKER_PRESENT = "docker version" in str(subprocess.getoutput(
    "docker --version"
)).lower()
if DOCKER_PRESENT:
    print("Success! Docker found!")
else:
    raise ComponentNotFound("Docker cannot be found!")

print("2. Check Docker Compose is installed")
DOCKER_COMPOSE_PRESENT = "docker-compose version" in str(subprocess.getoutput(
    "docker-compose --version"
)).lower()
if DOCKER_COMPOSE_PRESENT:
    print("Success! Docker Compose found!")
else:
    raise ComponentNotFound("Docker Compose cannot be found!")

print("3. Gather environment variables")
print("NOTE: TO USE DEFAULT VALUE, LEAVE INPUT EMPTY")
for serviceName, variableList in ENV_DEFS.items():
    print(f"\n##########\nVARIABLES FOR SERVICE: {serviceName}\n##########")
    for varName, varObject in variableList.items():
        varObject.getEnvironmentVariableInput()

if os.path.exists("postgres/.env"):
    if validateInput(
        "Do you wish to override this file (postgres/.env)? (Y/n): ",
        ["y", "n"]
    ).lower() == "y":
        buffer = []
        buffer.append(f"POSTGRES_DB = \"{ENV_DEFS['backend']['DATABASE_NAME'].userInput}\"\n")
        buffer.append(f"POSTGRES_USER = \"{ENV_DEFS['backend']['DATABASE_USERNAME'].userInput}\"\n")
        buffer.append(f"POSTGRES_PASSWORD = \"{ENV_DEFS['backend']['DATABASE_PASSWORD'].userInput}\"\n")
        file = open("postgres/.env", "w")
        file.writelines(buffer)
        file.close()

if os.path.exists("backend/.env"):
    if validateInput(
        "Do you wish to override this file (backend/.env)? (Y/n): ",
        ["y", "n"]
    ).lower() == "y":
        buffer = []
        for varName, varObject in ENV_DEFS["backend"].items():
            buffer.append(f"{varName} = \"{varObject.userInput}\"\n")
        for varName, varObject in ENV_DEFS["backend-and-pseudotie"].items():
            buffer.append(f"{varName} = \"{varObject.userInput}\"\n")

        file = open("backend/.env", "w")
        file.writelines(buffer)

if os.path.exists("pseudotie/.env"):
    if validateInput(
        "Do you wish to override this file (pseudotie/.env)? (Y/n): ",
        ["y", "n"]
    ).lower() == "y":
        buffer = []
        for varName, varObject in ENV_DEFS["pseudotie"].items():
            buffer.append(f"{varName} = \"{varObject.userInput}\"\n")
        for varName, varObject in ENV_DEFS["backend-and-pseudotie"].items():
            buffer.append(f"{varName} = \"{varObject.userInput}\"\n")

        file = open("pseudotie/.env", "w")
        file.writelines(buffer)

if os.path.exists("nginx/.env"):
    if validateInput(
        "Do you wish to override this file (nginx/.env)? (Y/n): ",
        ["y", "n"]
    ).lower() == "y":
        buffer = []
        for varName, varObject in ENV_DEFS["nginx"].items():
            buffer.append(f"{varName} = \"{varObject.userInput}\"\n")

        file = open("nginx/.env", "w")
        file.writelines(buffer)

if os.path.exists("wordpress/.env"):
    if validateInput(
        "Do you wish to override this file (wordpress/.env)? (Y/n): ",
        ["y", "n"]
    ).lower() == "y":
        buffer = []
        for varName, varObject in ENV_DEFS["wordpress"].items():
            buffer.append(f"{varName} = \"{varObject.userInput}\"\n")

        file = open("wordpress/.env", "w")
        file.writelines(buffer)

if os.path.exists("mysql/.env"):
    if validateInput(
        "Do you wish to override this file (mysql/.env)? (Y/n): ",
        ["y", "n"]
    ).lower() == "y":
        buffer = []
        buffer.append(f"MYSQL_USER = \"{ENV_DEFS['wordpress']['WORDPRESS_DB_USER'].userInput}\"\n")
        buffer.append(f"MYSQL_PASSWORD = \"{ENV_DEFS['wordpress']['WORDPRESS_DB_PASSWORD'].userInput}\"\n")
        buffer.append(f"MYSQL_ROOT_PASSWORD = \"{ENV_DEFS['mysql']['MYSQL_ROOT_PASSWORD'].userInput}\"\n")
        file = open("mysql/env", "w")
        file.writelines(buffer)
        file.close()
