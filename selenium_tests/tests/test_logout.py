from hamcrest import assert_that, is_not, is_, none
from selenium import webdriver
from selenium.webdriver.common.by import By
from pytest_bdd import scenario, given, when, then
from time import sleep
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import (
    expected_conditions as ExpectedConditions,
)
from conftest import ServerEndpoints
from selenium.common.exceptions import NoSuchElementException
from conftest import change_url


@scenario("logout.feature", "Logging the user out from the home page")
def test_logout():
    pass


@given("the user is logged in")
# def set_user_logged_in(driver: webdriver.Remote):
def set_user_logged_in(
    login_user: None,
    driver: webdriver.Remote,
    endpoints: ServerEndpoints
):
    WebDriverWait(driver, 10).until(
        ExpectedConditions.url_to_be(
            endpoints.app
        )
    )

    assert_that(
        driver.get_cookie("SDSESSION"),
        is_not(None)
    )


@given("the user is on the home page")
def set_client_on_homepage(
    driver: webdriver.Remote, endpoints: ServerEndpoints
):
    change_url(driver, endpoints.app)


@when("the user presses the logout button")
def press_logout_btn(driver: webdriver.Remote):
    logoutButton = driver.find_element(By.ID, "logoutBtn")
    logoutButton.click()


@then("the user should not be assigned a session cookie")
def check_no_session_cookie(
    driver: webdriver.Remote,
    endpoints: ServerEndpoints
):
    # check session cookie has been set
    WebDriverWait(driver, 10).until(
        ExpectedConditions.url_to_be(
            f"{endpoints.app}login"
        )
    )

    sleep(1)

    assert_that(
        driver.get_cookie("SDSESSION"),
        is_(none())
    )


@then("the user should remain on the login page")
def check_url_is_login(driver: webdriver.Remote):
    # check URL does not container /app/login
    WebDriverWait(driver, 10).until(
        ExpectedConditions.url_to_be(
            f"{endpoints.app}login"
        )
    )
