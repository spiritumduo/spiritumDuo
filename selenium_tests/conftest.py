from dataclasses import dataclass
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
from selenium.webdriver.safari.options import Options as SafariOptions
from selenium.webdriver.safari.service import Service as SafariService
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.edge.service import Service as EdgeService

from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By


@dataclass
class ServerEndpoints():
    app: str
    api: str


@pytest.fixture
def endpoints():
    hostname: str = (
            'SELENIUM_HOSTNAME' in environ
            and (
                environ['SELENIUM_HOSTNAME']
            ) or 'http://localhost'
        )
    return ServerEndpoints(
        app=hostname + "/app",
        api=hostname + "/api"
    )


@pytest.fixture
def driver():
    browser_choice: str = (
        'SELENIUM_BROWSER_CLIENT' in environ
        and environ['SELENIUM_BROWSER_CLIENT']
        or 'chromium'
    ).lower()

    if browser_choice == "firefox":
        options = FirefoxOptions()
        options.add_argument("--headless")
        options.add_argument("--start-maximized")
        driver = webdriver.Firefox(
            service=FirefoxService(GeckoDriverManager().install()),
            options=options
        )
        driver.set_window_size(1920, 1080)
        driver.maximize_window()

    elif browser_choice == "chromium":
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
        driver.set_window_size(1920, 1080)
        driver.maximize_window()

    elif browser_choice == "safari":
        driver = webdriver.Safari()
        driver.set_window_size(1920, 1080)
        driver.maximize_window()

    elif browser_choice == "edge":
        options = EdgeOptions()
        driver = webdriver.Edge(EdgeService(
            EdgeChromiumDriverManager.install()
        ))
        driver.set_window_size(1920, 1080)
        driver.maximize_window()

    driver.implicitly_wait(10)
    yield driver
    driver.close()


@pytest.fixture
def login_user(driver: webdriver.Remote, endpoints: ServerEndpoints):
    # driver.get(endpoints.api)
    # with httpx.Client() as client:
    #     res: httpx.Response = client.post(
    #         url=f'{endpoints.api}/rest/login/',
    #         json={
    #             "username": 'demo-1-2',
    #             "password": '22password1',
    #         }
    #     )
    # driver.add_cookie({
    #     'name': 'SDSESSION',
    #     'value': res.cookies['SDSESSION'],
    #     'path': '/',
    # })

    driver.get(endpoints.app)
    # username field
    driver.find_element(By.NAME, "username").send_keys("demo-1-2")

    # password field
    driver.find_element(By.NAME, "password").send_keys("22password1")

    # submit button
    driver.find_element(By.ID, "submit").send_keys(Keys.ENTER)
