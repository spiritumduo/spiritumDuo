from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from pytest_bdd import scenario, given, when, then
from time import sleep

from selenium_tests.conftest import ServerEndpoints


@scenario("login.feature", "Logging the user in with valid credentials")
def test_login_correct_creds():
    pass


@given("the login page is displayed")
def set_login_page_for_correct_credentials_test(
    driver: webdriver.Remote, endpoints: ServerEndpoints
):
    driver.get(endpoints.app)


@when("I insert a correct username and password and submit")
def insert_correct_credentials(driver: webdriver.Remote):
    # username field
    driver.find_element(By.NAME, "username").send_keys("demo-1-2")

    # password field
    driver.find_element(By.NAME, "password").send_keys("22password1")

    # submit button
    driver.find_element(By.ID, "submit").send_keys(Keys.ENTER)


@then("I should be assigned a session cookie")
def check_cookie_present(driver: webdriver.Remote):
    # we wait what we think is a timely amount of time
    sleep(1)

    # check session cookie has been set
    assert driver.get_cookie("SDSESSION") is not None


@then("I should not be on the login page")
def check_url_is_not_login(driver: webdriver.Remote):
    # check URL does not container /app/login
    assert driver.current_url.find("/login") == -1


@scenario("login.feature", "Logging the user in with invalid credentials")
def test_login_incorrect_creds():
    pass


@given("the login page is displayed")
def set_login_page_for_incorrect_credentials_test(
    driver: webdriver.Remote, endpoints: ServerEndpoints
):
    driver.get(endpoints.app)


@when("I insert an incorrect username and password and submit")
def insert_incorrect_credentials(driver: webdriver.Remote):
    # username field
    driver.find_element(By.NAME, "username").send_keys("thisisincorrect")

    # password field
    driver.find_element(By.NAME, "password").send_keys("thisiswrongtoo")

    # submit button
    driver.find_element(By.ID, "submit").send_keys(Keys.ENTER)


@then("I should not be assigned a session cookie")
def check_cookie_not_present(driver: webdriver.Remote):
    # we wait what we think is a timely amount of time
    sleep(1)

    # check session cookie has been set
    assert driver.get_cookie("SDSESSION") is None


@then("I should still be on the login page")
def check_url_is_login(driver: webdriver.Remote):
    # check URL contains /app/login
    assert driver.current_url.find("/login") != -1
