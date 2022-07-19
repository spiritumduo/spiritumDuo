import pytest
import httpx
from os import environ
from selenium import webdriver
from webdriver_manager.firefox import GeckoDriverManager
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.core.utils import ChromeType
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.chrome.service import Service as ChromeService


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
        driver = webdriver.Firefox(
            service=FirefoxService(GeckoDriverManager().install()),
            options=options
        )
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
        driver.maximize_window()
    yield driver
    driver.close()


@pytest.fixture
async def login_user(firefox_driver: webdriver.Firefox):
    res: httpx.Response = await httpx.post(
        url='/rest/login/',
        json={
            "username": 'demo-1-2',
            "password": '22password1',
        }
    )
    firefox_driver.add_cookie({
        'name': 'SDSESSION',
        'value': res.cookies['SDSESSION']
    })
