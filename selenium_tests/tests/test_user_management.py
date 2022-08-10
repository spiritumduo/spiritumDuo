import pytest
from random import randint
from hamcrest import assert_that, is_, not_none
from selenium import webdriver
from selenium.webdriver.common.by import By
from pytest_bdd import scenario, given, when, then
from time import sleep
from conftest import ServerEndpoints
from selenium.webdriver.support.ui import WebDriverWait
from conftest import UserDetails
from conftest import change_url
from selenium.webdriver.support import (
    expected_conditions as ExpectedConditions,
)


@pytest.fixture
def create_user_details(platform_browser_string: str) -> str:
    return UserDetails(
        username=f"{platform_browser_string}_test_user",
        password="test password",
        department="test department",
        email=f"{platform_browser_string}@test.com",
        firstName=f"{platform_browser_string}",
        lastName="testcreate",
        roles=["admin"],
        pathways=["cancer demo 1"],
    )


@pytest.fixture
def update_user_details(platform_browser_string: str):
    return UserDetails(
        username=f"{platform_browser_string}_update_user",
        password="test password",
        department="test department",
        email=f"{platform_browser_string}_update@test.com",
        firstName=f"{platform_browser_string}_update",
        lastName="update",
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


@given("the user is on the user creation page")
def set_to_admin_page(
    driver: webdriver.Remote, endpoints: ServerEndpoints
):
    change_url(driver, f"{endpoints.app}admin")
    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Users')]"
    ).click()

    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Create user')]"
    ).click()


@then("the user fills the form in with valid data")
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


@when("the user submits the form")
def submit_form(driver: webdriver.Remote):
    submit = driver.find_element(
        By.XPATH, "//button[contains(text(), 'Create User')]"
    )
    submit.click()


@then("the user should see the confirmation modal")
def check_modal_present(
    driver: webdriver.Remote, create_user_details: UserDetails
):
    WebDriverWait(driver, 4).until(
        ExpectedConditions.visibility_of(
            driver.find_element(By.CSS_SELECTOR, '.modal-body')
        )
    )
    assert_that(
        driver.find_element(By.CSS_SELECTOR, '.modal-body').is_displayed(),
        is_(True)
    )

    assert_that(
        driver.find_element(
            By.XPATH,
            f"//*[contains(text(), '{create_user_details.firstName}')]"
        ).is_displayed(),
        is_(True)
    )
    assert_that(
        driver.find_element(
            By.XPATH,
            f"//*[contains(text(), '{create_user_details.lastName}')]"
        ).is_displayed(),
        is_(True)
    )
    assert_that(
        driver.find_element(
            By.XPATH,
            f"//*[contains(text(), '{create_user_details.email}')]"
        ).is_displayed(),
        is_(True)
    )
    assert_that(
        driver.find_element(
            By.XPATH,
            "//*[contains(text(), 'Hidden')]"
        ).is_displayed(),
        is_(True)
    )
    assert_that(
        driver.find_element(
            By.XPATH,
            f"//*[contains(text(), '{create_user_details.department}')]"
        ).is_displayed(),
        is_(True)
    )
    for role in create_user_details.roles:
        assert_that(
            driver.find_element(
                By.XPATH,
                f"//*[contains(text(), '{role}')]"
            ).is_displayed(),
            is_(True)
        )
    for pathway in create_user_details.pathways:
        assert_that(
            driver.find_element(
                By.XPATH,
                f"//*[contains(text(), '{pathway}')]"
            ).is_displayed(),
            is_(True)
        )


###################
###################
###################
###################


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


@given("the user is on the users list page")
def set_to_users_admin_page(
    driver: webdriver.Remote, endpoints: ServerEndpoints
):
    change_url(driver, f"{endpoints.app}admin")
    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Users')]"
    ).click()

    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'All')]"
    ).click()


@when("the user selects a user")
def select_user_row(driver: webdriver.Remote):
    table_body = driver.find_element(By.CLASS_NAME, "nhsuk-table__body")
    user_row = table_body.find_elements(By.CLASS_NAME, "nhsuk-table__row")[0]
    user_row.find_element(By.XPATH, ".//button").click()


@then("the user should see a modal to edit the user")
def check_edit_modal(driver: webdriver.Remote):
    modal = driver.find_element(
        By.XPATH,
        "//div[contains(@class, 'modal-body')]"
    )
    WebDriverWait(driver, 10).until(
        ExpectedConditions.visibility_of(
            modal
        )
    )
    assert_that(
        modal.is_displayed(),
        is_(True)
    )


@then("the user changes values in this form")
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


@when("the user submits the edit form")
def submit_edit_form(driver: webdriver.Remote):
    submit = WebDriverWait(driver, 10).until(
        lambda d: d.find_element(
            By.XPATH, "//button[contains(text(), 'Update User')]"
        )
    )
    submit.click()


@then("the user is shown a confirmation modal")
def check_edit_confirmation(
    driver: webdriver.Remote, update_user_details: UserDetails
):
    WebDriverWait(driver, 4).until(
        ExpectedConditions.visibility_of(
            driver.find_element(By.CSS_SELECTOR, '.modal-body')
        )
    )
    assert_that(
        driver.find_element(By.CSS_SELECTOR, '.modal-body').is_displayed(),
        is_(True)
    )

    assert_that(
        driver.find_element(
            By.XPATH,
            f"//*[contains(text(), '{update_user_details.firstName}')]"
        ).is_displayed(),
        is_(True)
    )
    assert_that(
        driver.find_element(
            By.XPATH,
            f"//*[contains(text(), '{update_user_details.lastName}')]"
        ).is_displayed(),
        is_(True)
    )
    assert_that(
        driver.find_element(
            By.XPATH,
            f"//*[contains(text(), '{update_user_details.email}')]"
        ).is_displayed(),
        is_(True)
    )
    assert_that(
        driver.find_element(
            By.XPATH,
            "//*[contains(text(), 'Hidden')]"
        ).is_displayed(),
        is_(True)
    )
    assert_that(
        driver.find_element(
            By.XPATH,
            f"//*[contains(text(), '{update_user_details.department}')]"
        ).is_displayed(),
        is_(True)
    )


###################
###################
###################
###################


@scenario(
    "user_management.feature",
    "A user attempts to create a user with a pre-existing username"
)
def test_create_existing_user():
    pass


@given("the user is logged in")
def log_user_in(driver: webdriver.Remote, login_user: None):
    sleep(1)
    assert_that(driver.get_cookie("SDSESSION"), is_(not_none()))


@given("a user already exists")
def add_user(driver: webdriver.Remote, test_user: UserDetails):
    pass


@given("the user is on the user creation page")
def set_to_user_create_page(
    driver: webdriver.Remote, endpoints: ServerEndpoints
):
    change_url(driver, f"{endpoints.app}admin")
    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Users')]"
    ).click()

    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Create user')]"
    ).click()


@when("the user fills the form in with an existing username")
def populate_form_with_existing_data(
    driver: webdriver.Remote,
    create_user_details: UserDetails,
    test_user: UserDetails
):
    driver.find_element(By.NAME, "firstName").send_keys(
        test_user.firstName
    )
    driver.find_element(By.NAME, "lastName").send_keys(
        test_user.lastName
    )
    driver.find_element(By.NAME, "username").send_keys(
        test_user.username
    )
    driver.find_element(By.NAME, "password").send_keys(
        test_user.password
    )
    driver.find_element(By.NAME, "email").send_keys(
        test_user.email
    )
    driver.find_element(By.NAME, "department").send_keys(
        test_user.department
    )
    driver.find_element(By.NAME, 'isActive').click()

    roles_section = driver.find_element(
        By.XPATH, "//label[contains(text(), 'Roles')]"
    )
    roles_input = roles_section.find_element(By.XPATH, "./div")

    for role in test_user.roles:
        roles_input.click()
        roles_input.find_element(
            By.XPATH, f".//*[contains(text(), '{role}')]"
        ).click()

    pathways_section = driver.find_element(
        By.XPATH, "//label[contains(text(), 'Pathways')]"
    )
    pathways_input = pathways_section.find_element(By.XPATH, "./div")
    for pathway in test_user.pathways:
        pathways_input.click()
        pathway = pathways_input.find_element(
            By.XPATH, f".//div/*[contains(text(), '{pathway}')]"
        )

    pathway.click()


@when("the user submits the form")
def submit_form(driver: webdriver.Remote):
    submit = driver.find_element(
        By.XPATH, "//button[contains(text(), 'Create User')]"
    )
    submit.click()


@then("the user should be presented with an error message")
def check_error_present(
    driver: webdriver.Remote
):
    assert_that(
        driver.find_element(
            By.XPATH,
            "//*[contains(text(), 'An account with this email already exists')]"
        ).is_displayed(),
        is_(True)
    )
