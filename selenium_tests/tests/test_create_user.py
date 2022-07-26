from random import randint
from hamcrest import assert_that, is_, not_none
from selenium import webdriver
from selenium.webdriver.common.by import By
from pytest_bdd import scenario, given, when, then
from time import sleep
from selenium_tests.conftest import ServerEndpoints


@scenario(
    "create_user.feature",
    "A new user needs to be created"
)
def test_create_decision_point():
    pass


@given("the user is logged in")
def log_user_in(driver: webdriver.Remote, login_user: None):
    sleep(1)
    assert_that(driver.get_cookie("SDSESSION"), is_(not_none()))


@given("we are on the user administration page and tab")
def set_to_admin_page(driver: webdriver.Remote, endpoints: ServerEndpoints):
    driver.get(f"{endpoints.app}/admin")
    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Users')]"
    ).click()

    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Create user')]"
    ).click()


@then("we fill the form in with valid data")
def populate_form(driver: webdriver.Remote):
    driver.find_element(By.NAME, "firstName").send_keys("selenium")
    driver.find_element(By.NAME, "lastName").send_keys("test")
    driver.find_element(By.NAME, "username").send_keys(
        f"selenium{randint(1, 1000)}")
    driver.find_element(By.NAME, "password").send_keys(
        "selenium_test")
    driver.find_element(By.NAME, "email").send_keys(
        f"test_client{randint(1, 1000)}@spiritumduo.local")
    driver.find_element(By.NAME, "department").send_keys("Selenium runner")
    driver.find_element(By.NAME, 'isActive').click()

    roles_section = driver.find_element(
        By.XPATH, "//label[contains(text(), 'Roles')]"
    )
    roles_input = roles_section.find_element(By.XPATH, "./div")
    roles_input.click()
    roles_input.find_element(
        By.XPATH, ".//*[contains(text(), 'admin')]"
    ).click()

    pathways_section = driver.find_element(
        By.XPATH, "//label[contains(text(), 'Pathways')]"
    )
    pathways_input = pathways_section.find_element(By.XPATH, "./div")
    pathways_input.click()
    pathway = pathways_input.find_element(
        By.XPATH, ".//div/*[contains(text(), 'cancer demo 1')]"
    )

    pathway.click()


@when("we submit the form")
def submit_form(driver: webdriver.Remote):
    submit = driver.find_element(
        By.XPATH, "//button[contains(text(), 'Create User')]"
    )
    submit.click()


@then("we should see the confirmation modal")
def check_modal_present(driver: webdriver.Remote):
    driver.find_element(By.XPATH, "//div[contains(text(), 'User created')]")
