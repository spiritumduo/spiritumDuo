from hamcrest import assert_that, is_, is_not
from selenium import webdriver
from selenium.webdriver.common.by import By
from pytest_bdd import scenario, given, when, then
from time import sleep
from conftest import ServerEndpoints
from conftest import change_url
from selenium.webdriver.support.ui import WebDriverWait


@scenario("login.feature", "Logging the user in with valid credentials")
def test_login_correct_creds():
    pass


@given("the login page is displayed")
def set_login_page_for_correct_credentials_test(
    driver: webdriver.Remote, endpoints: ServerEndpoints
):
    change_url(driver, endpoints.app)


@when("the user inserts a correct username and password and submits")
def insert_correct_credentials(driver: webdriver.Remote):
    # username field
    driver.find_element(By.NAME, "username").send_keys("demo-1-2")

    # password field
    driver.find_element(By.NAME, "password").send_keys("22password1")

    # submit button
    driver.find_element(By.ID, "submit").click()


@then("the user should be assigned a session cookie")
def check_cookie_present(driver: webdriver.Remote):
    WebDriverWait(driver, 10).until(
        lambda d: d.get_cookie("SDSESSION") is not None
    )

    # check session cookie has been set
    assert_that(
        driver.get_cookie("SDSESSION"),
        is_not(None)
    )


@then("the user should not be on the login page")
def check_url_is_not_login(driver: webdriver.Remote):
    # check URL does not container /app/login
    assert_that(
        driver.current_url.find("/login"),
        is_(-1)
    )


@scenario("login.feature", "Logging the user in with invalid credentials")
def test_login_incorrect_creds():
    pass


@given("the login page is displayed")
def set_login_page_for_incorrect_credentials_test(
    driver: webdriver.Remote, endpoints: ServerEndpoints
):
    change_url(driver, endpoints.app)


@when("the user inserts an incorrect username and password and submits")
def insert_incorrect_credentials(driver: webdriver.Remote):
    # username field
    driver.find_element(By.NAME, "username").send_keys("thisisincorrect")

    # password field
    driver.find_element(By.NAME, "password").send_keys("thisiswrongtoo")

    # submit button
    driver.find_element(By.ID, "submit").click()


@then("the user should see an error")
def check_error_present(driver: webdriver.Remote):
    assert_that(
        driver.find_element(
            By.XPATH,
            "//*[contains(text(), 'Incorrect username and/or password')]"
        ).is_displayed(),
        is_(True)
    )


@then("the user should not be assigned a session cookie")
def check_cookie_not_present(driver: webdriver.Remote):
    # we wait what we think is a timely amount of time
    sleep(1)

    # check session cookie has been set
    assert_that(
        driver.get_cookie("SDSESSION"),
        is_(None)
    )


@then("the user should still be on the login page")
def check_url_is_login(driver: webdriver.Remote):
    # check URL contains /app/login
    assert_that(
        driver.current_url.find("/login"),
        is_not(-1)
    )
