from argparse import ArgumentError
from dataclasses import dataclass
import sys
from time import sleep
from typing import List
import pytest
from os import environ
from selenium import webdriver
from webdriver_manager.firefox import GeckoDriverManager
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.microsoft import EdgeChromiumDriverManager
from webdriver_manager.core.utils import ChromeType
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.edge.service import Service as EdgeService
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import (
    expected_conditions as ExpectedConditions,
)
from selenium.common.exceptions import NoSuchElementException


@dataclass
class ServerEndpoints():
    app: str
    api: str


@dataclass
class RoleDetails():
    name: str
    permissions: List[str]


@dataclass
class PathwayDetails():
    name: str
    clinical_requests: List[str]


@dataclass
class MdtDetails():
    location: str
    index: int


@dataclass
class UserDetails():
    username: str
    password: str
    department: str
    email: str
    firstName: str
    lastName: str
    roles: List[str]
    pathways: List[str]


class TestCredentialsNotFound(Exception):
    """
    Raised when a set of credentials isn't
    found when searching by driver name and platform
    """


def pytest_addoption(parser):
    parser.addoption("--driver", action="store", default="chromium")


def change_url(driver: webdriver.Remote, url):
    driver.get(url)

    WebDriverWait(driver, 10).until(
        lambda driver: driver.execute_script(
            'return document.readyState'
        ) == 'complete'
    )

    # root = driver.find_element(By.ID, "root")
    root = WebDriverWait(driver, 10).until(
        lambda d: d.find_element(By.ID, 'root')
    )

    WebDriverWait(driver, 10).until(
        ExpectedConditions.visibility_of(root)
    )


@pytest.fixture
def endpoints():
    hostname: str = (
            'SELENIUM_HOSTNAME' in environ
            and (
                environ['SELENIUM_HOSTNAME']
            ) or 'http://localhost'
        )
    return ServerEndpoints(
        app=hostname + "/app/",
        api=hostname + "/api/"
    )


@pytest.fixture
def browser_name(pytestconfig):
    browser_choice: str = pytestconfig.getoption("driver")
    if browser_choice.lower() not in ["chromium", "firefox", "edge", "safari"]:
        raise ArgumentError(
            None,
            "Driver argument provided is not a valid driver"
        )

    return browser_choice


@pytest.fixture
def platform_browser_string(browser_name: str) -> str:
    return f"{sys.platform}{browser_name}"


@dataclass
class Credentials():
    username: str
    password: str


@pytest.fixture
def get_test_credentials(platform_browser_string: str) -> str:

    credentials: dict = {
        "darwinsafari": Credentials(
            username="demo-10-2",
            password="22password10"
        ),
        "darwinchromium": Credentials(
            username="demo-11-2",
            password="22password11"
        ),
        "win32chromium": Credentials(
            username="demo-12-2",
            password="22password12"
        ),
        "win32edge": Credentials(
            username="demo-13-2",
            password="22password13"
        ),
        "linuxfirefox": Credentials(
            username="demo-14-2",
            password="22password14"
        ),
        "linuxchromium": Credentials(
            username="demo-15-2",
            password="22password15"
        )
    }

    if platform_browser_string in credentials:
        return credentials[platform_browser_string]

    raise TestCredentialsNotFound(platform_browser_string)


@pytest.fixture
def driver(browser_name: str):
    if browser_name == "firefox":
        options = FirefoxOptions()
        options.add_argument("--headless")
        options.add_argument("--start-maximized")
        driver = webdriver.Firefox(
            # service=FirefoxService(GeckoDriverManager().install()),
            options=options
        )

    elif browser_name == "chromium":
        options = ChromeOptions()
        options.add_argument("--no-sandbox")
        options.add_argument("--headless")
        options.add_argument("--disable-setuid-sandbox")
        options.add_argument("--remote-debugging-port=9222")
        options.add_argument("--disable-dev-shm-using")
        options.add_argument("--disable-extensions")
        options.add_argument("--disable-gpu")
        options.add_argument("--start-maximized")
        options.add_argument("--disable-infobars")
        options.add_argument("--ignore-certificate-errors")

        driver = webdriver.Chrome(
            service=ChromeService(ChromeDriverManager(
                chrome_type=ChromeType.CHROMIUM).install()
            ),
            options=options,
        )

    elif browser_name == "safari":
        driver = webdriver.Safari()

    elif browser_name == "edge":
        options = EdgeOptions()

        options.add_argument("--no-sandbox")
        options.add_argument("--headless")
        options.add_argument("--disable-setuid-sandbox")
        options.add_argument("--remote-debugging-port=9222")
        options.add_argument("--disable-dev-shm-using")
        options.add_argument("--disable-extensions")
        options.add_argument("--disable-gpu")
        options.add_argument("--start-maximized")
        options.add_argument("--disable-infobars")
        options.add_argument("--ignore-certificate-errors")

        driver = webdriver.Edge(
            service=EdgeService(EdgeChromiumDriverManager().install()),
            options=options,
        )

    # driver.maximize_window()
    driver.set_window_size(1920, 1080)
    driver.implicitly_wait(10)
    yield driver
    driver.close()


@pytest.fixture
def login_user(
    driver: webdriver.Remote,
    endpoints: ServerEndpoints,
    get_test_credentials: Credentials
):
    change_url(driver, endpoints.app)

    WebDriverWait(
        driver, 10,
        ignored_exceptions=[NoSuchElementException]
    ).until(
        ExpectedConditions.visibility_of(
            driver.find_element(By.ID, "root")
        )
    )

    # username field
    driver.find_element(By.NAME, "username").send_keys(
        get_test_credentials.username)

    # password field
    driver.find_element(By.NAME, "password").send_keys(
        get_test_credentials.password)

    # submit button
    driver.find_element(By.ID, "submit").send_keys(Keys.ENTER)

    WebDriverWait(driver, 10).until(
        ExpectedConditions.url_to_be(
            endpoints.app
        )
    )


@pytest.fixture
def test_roles(
    driver: webdriver.Remote, endpoints: ServerEndpoints,
    login_user: None
):

    roles = [
        RoleDetails(
            name="fixture-test-role-one",
            permissions=["AUTHENTICATED"]
        ),
        RoleDetails(
            name="fixture-test-role-two",
            permissions=["AUTHENTICATED"]
        ),
        RoleDetails(
            name="fixture-test-role-three",
            permissions=["AUTHENTICATED"]
        ),
        RoleDetails(
            name="fixture-test-role-four",
            permissions=["AUTHENTICATED"]
        ),
    ]

    sleep(1)
    for role in roles:
        change_url(driver, f"{endpoints.app}admin")
        driver.find_element(
            By.XPATH,
            "//li[contains(text(), 'Roles management')]"
        ).click()

        driver.find_element(
            By.XPATH,
            "//li[contains(text(), 'Create role')]"
        ).click()

        driver.find_element(By.NAME, "name").send_keys(
            role.name
        )

        permissions_section = driver.find_element(
            By.XPATH, "//*[contains(text(), 'Role permissions')]/../div"
        )

        for permission in role.permissions:
            permissions_section.click()

            permissions_section.find_element(
                By.XPATH, f".//div/*[contains(text(), '{permission}')]"
            ).click()

        submit = driver.find_element(
            By.XPATH, "//button[contains(text(), 'Create role')]"
        )
        submit.click()

    return roles


@pytest.fixture
def test_pathways(
    driver: webdriver.Remote, endpoints: ServerEndpoints,
    login_user: None
):
    pathway_details = [
        PathwayDetails(
            name="Fixture test pathway",
            clinical_requests=[
                "Referral letter (Referral letter (record artifact))"
            ]
        ),
        PathwayDetails(
            name="Fixture test pathway two",
            clinical_requests=[
                "Referral letter (Referral letter (record artifact))"
            ]
        ),
        PathwayDetails(
            name="Fixture test pathway three",
            clinical_requests=[
                "Referral letter (Referral letter (record artifact))"
            ]
        ),
        PathwayDetails(
            name="Fixture test pathway four",
            clinical_requests=[
                "Referral letter (Referral letter (record artifact))"
            ]
        )
    ]

    sleep(1)
    for pathway in pathway_details:
        change_url(driver, f"{endpoints.app}admin")
        driver.find_element(
            By.XPATH,
            "//li[contains(text(), 'Pathway management')]"
        ).click()

        driver.find_element(
            By.XPATH,
            "//li[contains(text(), 'Create pathway')]"
        ).click()

        driver.find_element(By.NAME, "name").send_keys(
            pathway.name
        )

        requests_section = driver.find_element(
            By.XPATH, "//*[contains(text(), 'Clinical request types')]/../div"
        )

        for requests in pathway.clinical_requests:
            requests_section.click()

            requests_section.find_element(
                By.XPATH, f".//div/*[contains(text(), '{requests}')]"
            ).click()

        submit = driver.find_element(
            By.XPATH, "//button[contains(text(), 'Create pathway')]"
        )
        submit.click()

    return pathway_details


@pytest.fixture
def test_mdts(
    driver: webdriver.Remote, endpoints: ServerEndpoints,
    login_user: None
):
    mdts = [
        MdtDetails(
            location="test_location",
            index=-4
        ),
        MdtDetails(
            location="another_test_location",
            index=-5
        ),
        MdtDetails(
            location="another_test_location_2",
            index=-6
        )
    ]

    for mdt in mdts:
        change_url(driver, f"{endpoints.app}mdt")
        driver.find_element(
            By.XPATH,
            "//button[contains(text(), 'Create MDT')]"
        ).click()

        date_selector = driver.find_element(
            By.XPATH, "//*[contains(text(), 'Date of MDT')]")
        date_selector.click()

        date_selection = driver.find_elements(
            By.CLASS_NAME, "react-datepicker__day")
        date_selection[mdt.index].click()

        location_input = driver.find_element(By.NAME, "location")
        location_input.send_keys(mdt.location)

        modal = driver.find_element(By.CLASS_NAME, "modal-content")

        submit_button = modal.find_element(
            By.XPATH, ".//button[contains(text(), 'Create')]")
        submit_button.click()

    return mdts


@pytest.fixture
def test_user(
    driver: webdriver.Remote, endpoints: ServerEndpoints,
    login_user: None
):
    user_details = UserDetails(
        username="fixture_test_user",
        password="test password",
        department="test department",
        email="fixturetest@test.com",
        firstName="test",
        lastName="runner",
        roles=["admin"],
        pathways=["cancer demo 1"],
    )

    sleep(1)
    change_url(driver, f"{endpoints.app}admin")
    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Users')]"
    ).click()

    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Create user')]"
    ).click()

    driver.find_element(By.NAME, "firstName").send_keys(
        user_details.firstName
    )
    driver.find_element(By.NAME, "lastName").send_keys(
        user_details.lastName
    )
    driver.find_element(By.NAME, "username").send_keys(
        user_details.username
    )
    driver.find_element(By.NAME, "password").send_keys(
        user_details.password
    )
    driver.find_element(By.NAME, "email").send_keys(
        user_details.email
    )
    driver.find_element(By.NAME, "department").send_keys(
        user_details.department
    )
    driver.find_element(By.NAME, 'isActive').click()

    roles_section = driver.find_element(
        By.XPATH, "//label[contains(text(), 'Roles')]"
    )
    roles_input = roles_section.find_element(By.XPATH, "./div")

    for role in user_details.roles:
        roles_input.click()
        roles_input.find_element(
            By.XPATH, f".//*[contains(text(), '{role}')]"
        ).click()

    pathways_section = driver.find_element(
        By.XPATH, "//label[contains(text(), 'Pathways')]"
    )
    pathways_input = pathways_section.find_element(By.XPATH, "./div")
    for pathway in user_details.pathways:
        pathways_input.click()
        pathway = pathways_input.find_element(
            By.XPATH, f".//div/*[contains(text(), '{pathway}')]"
        )

    pathway.click()

    submit = driver.find_element(
        By.XPATH, "//button[contains(text(), 'Create User')]"
    )
    submit.click()

    return user_details
