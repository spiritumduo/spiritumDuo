from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from pytest_bdd import scenario, given, when, then
from time import sleep


@scenario("logout.feature", "Logging the user out from the home page")
def test_logout():
    pass


@given("the user is logged in")
def set_user_logged_in(login_user: None, driver: webdriver.Remote):
    sleep(1)
    assert driver.get_cookie("SDSESSION") is not None


@given("the user is on the home page")
def set_client_on_homepage(driver: webdriver.Remote):
    driver.get("http://knightlx/app/")


@when("I press the logout button")
def press_logout_btn(driver: webdriver.Remote):
    # logout button on header
    driver.find_element(By.ID, "logoutBtn").send_keys(Keys.ENTER)


@then("I should not be assigned a session cookie")
def check_no_session_cookie(driver: webdriver.Remote):
    # we wait what we think is a timely amount of time
    sleep(1)

    # check session cookie has been set
    assert driver.get_cookie("SDSESSION") is not None


@then("I should be on the login page")
def check_url_is_login(driver: webdriver.Remote):
    # check URL does not container /app/login
    assert driver.current_url.find("/login") != -1
