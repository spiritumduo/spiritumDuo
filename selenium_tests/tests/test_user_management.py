from dataclasses import dataclass
from typing import List
import pytest
from random import randint
from hamcrest import assert_that, is_, not_none
from selenium import webdriver
from selenium.webdriver.common.by import By
from pytest_bdd import scenario, given, when, then
from time import sleep
from selenium_tests.conftest import ServerEndpoints
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

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


@pytest.fixture
def create_user_details():
    return UserDetails(
        username="test_user_" + str(randint(1, 100)),
        password="test password",
        department="test department",
        email=f"test{randint(1, 100)}@test.com",
        firstName="test",
        lastName="runner",
        roles=["admin"],
        pathways=["cancer demo 1"],
    )


@pytest.fixture
def update_user_details():
    return UserDetails(
        username="test_user_" + str(randint(1, 100)),
        password="test password",
        department="test department",
        email=f"test{randint(1, 100)}@test.com",
        firstName="test",
        lastName="runner",
        roles=["admin"],
        pathways=["cancer demo 1"],
    )


@scenario(
    "user_management.feature",
    "A new user needs to be created"
)
def test_create_new_user():
    pass


@given("the user is logged in")
def log_user_in(driver: webdriver.Remote, login_user: None):
    sleep(1)
    assert_that(driver.get_cookie("SDSESSION"), is_(not_none()))


@given("we are on the user creation page")
def set_to_admin_page(
    driver: webdriver.Remote, endpoints: ServerEndpoints
):
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
def populate_form(
    driver: webdriver.Remote,
    create_user_details: UserDetails
):
    driver.find_element(By.NAME, "firstName").send_keys(
        create_user_details.firstName
    )
    driver.find_element(By.NAME, "lastName").send_keys(
        create_user_details.lastName
    )
    driver.find_element(By.NAME, "username").send_keys(
        create_user_details.username
    )
    driver.find_element(By.NAME, "password").send_keys(
        create_user_details.password
    )
    driver.find_element(By.NAME, "email").send_keys(
        create_user_details.email
    )
    driver.find_element(By.NAME, "department").send_keys(
        create_user_details.department
    )
    driver.find_element(By.NAME, 'isActive').click()

    roles_section = driver.find_element(
        By.XPATH, "//label[contains(text(), 'Roles')]"
    )
    roles_input = roles_section.find_element(By.XPATH, "./div")

    for role in create_user_details.roles:
        roles_input.click()
        roles_input.find_element(
            By.XPATH, f".//*[contains(text(), '{role}')]"
        ).click()

    pathways_section = driver.find_element(
        By.XPATH, "//label[contains(text(), 'Pathways')]"
    )
    pathways_input = pathways_section.find_element(By.XPATH, "./div")
    for pathway in create_user_details.pathways:
        pathways_input.click()
        pathway = pathways_input.find_element(
            By.XPATH, f".//div/*[contains(text(), '{pathway}')]"
        )

    pathway.click()


@when("we submit the form")
def submit_form(driver: webdriver.Remote):
    submit = driver.find_element(
        By.XPATH, "//button[contains(text(), 'Create User')]"
    )
    submit.click()


@then("we should see the confirmation modal")
def check_modal_present(
    driver: webdriver.Remote, create_user_details: UserDetails
):
    driver.find_element(By.XPATH, "//div[contains(text(), 'User created')]")

    modal = driver.find_element(
        By.XPATH,
        "//div[contains(@class, 'modal-body')]"
    )

    modal.find_element(
        By.XPATH,
        f".//*[contains(text(), '{create_user_details.firstName}')]"
    )
    modal.find_element(
        By.XPATH,
        f".//*[contains(text(), '{create_user_details.lastName}')]"
    )
    modal.find_element(
        By.XPATH,
        f".//*[contains(text(), '{create_user_details.email}')]"
    )
    modal.find_element(
        By.XPATH,
        ".//*[contains(text(), 'Hidden')]"
    )
    modal.find_element(
        By.XPATH,
        f".//*[contains(text(), '{create_user_details.department}')]"
    )
    for role in create_user_details.roles:
        modal.find_element(
            By.XPATH,
            f".//*[contains(text(), '{role}')]"
        )
    for pathway in create_user_details.pathways:
        modal.find_element(
            By.XPATH,
            f".//*[contains(text(), '{pathway}')]"
        )


@scenario(
    "user_management.feature",
    "A user needs to be updated"
)
def test_update_new_user():
    pass


@given("the user is logged in")
def log_user_in(driver: webdriver.Remote, login_user: None):
    sleep(1)
    assert_that(driver.get_cookie("SDSESSION"), is_(not_none()))


@given("we are on the users list page")
def set_to_users_admin_page(
    driver: webdriver.Remote, endpoints: ServerEndpoints
):
    driver.get(f"{endpoints.app}/admin")
    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Users')]"
    ).click()

    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'All')]"
    ).click()


@when("we select a user")
def select_user_row(driver: webdriver.Remote):
    table_body = driver.find_element(By.CLASS_NAME, "nhsuk-table__body")
    user_row = table_body.find_elements(By.CLASS_NAME, "nhsuk-table__row")[0]
    user_row.click()


@then("we see a modal to edit the user")
def check_edit_modal(driver: webdriver.Remote):
    driver.find_element(By.CLASS_NAME, "modal-content")


@then("we change values in this form")
def clear_and_populate_form(
    driver: webdriver.Remote, update_user_details: UserDetails
):
    driver.find_element(By.NAME, "firstName").clear()
    driver.find_element(By.NAME, "firstName").send_keys(
        update_user_details.firstName
    )
    driver.find_element(By.NAME, "lastName").clear()
    driver.find_element(By.NAME, "lastName").send_keys(
        update_user_details.lastName
    )
    driver.find_element(By.NAME, "username").clear()
    driver.find_element(By.NAME, "username").send_keys(
        update_user_details.username
    )
    driver.find_element(By.NAME, "password").clear()
    driver.find_element(By.NAME, "password").send_keys(
        update_user_details.password
    )
    driver.find_element(By.NAME, "email").clear()
    driver.find_element(By.NAME, "email").send_keys(
        update_user_details.email
    )
    driver.find_element(By.NAME, "department").clear()
    driver.find_element(By.NAME, "department").send_keys(
        update_user_details.department
    )


@when("we submit the edit form")
def submit_edit_form(driver: webdriver.Remote):
    submit = WebDriverWait(driver, 10).until(
        lambda d: d.find_element(
            By.XPATH, "//button[contains(text(), 'Update User')]"
        )
    )
    submit.click()


@then("we get a confirmation modal")
def check_edit_confirmation(
    driver: webdriver.Remote, update_user_details: UserDetails
):
    driver.find_element(By.XPATH, "//div[contains(text(), 'User updated')]")

    modal = driver.find_element(
        By.XPATH,
        "//*[contains(text(), 'User updated')]/../.."
    )
    modal.find_element(
        By.XPATH,
        f".//*[contains(text(), '{update_user_details.firstName}')]"
    )
    modal.find_element(
        By.XPATH,
        f".//*[contains(text(), '{update_user_details.lastName}')]"
    )
    modal.find_element(
        By.XPATH,
        f".//*[contains(text(), '{update_user_details.email}')]"
    )
    modal.find_element(
        By.XPATH,
        ".//*[contains(text(), 'Hidden')]"
    )
    modal.find_element(
        By.XPATH,
        f".//*[contains(text(), '{update_user_details.department}')]"
    )
