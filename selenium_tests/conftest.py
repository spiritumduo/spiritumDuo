import pytest
import httpx
from selenium import webdriver
from webdriver_manager.firefox import GeckoDriverManager
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.firefox.service import Service as FirefoxService


@pytest.fixture
def firefox_driver():
    firefox_options = FirefoxOptions()
    firefox_options.add_argument("--headless")
    firefox_driver = webdriver.Firefox(
        service=FirefoxService(GeckoDriverManager().install()),
        options=firefox_options
    )
    firefox_driver.maximize_window()
    yield firefox_driver
    firefox_driver.close()


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