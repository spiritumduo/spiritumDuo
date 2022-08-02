import pytest
from random import randint
from hamcrest import assert_that, is_, not_none
from selenium import webdriver
from selenium.webdriver.common.by import By
from pytest_bdd import scenario, given, when, then
from time import sleep
from selenium_tests.conftest import RoleDetails, ServerEndpoints
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait


@pytest.fixture
def create_role_details():
    return RoleDetails(
        name=f"custom role{randint(1, 100)}",
        permissions=["AUTHENTICATED"]
    )


@pytest.fixture
def update_role_details():
    return RoleDetails(
        name=f"custom role{randint(1, 100)}",
        permissions=["AUTHENTICATED"]
    )


@scenario(
    "roles_management.feature",
    "A role needs to be created"
)
def test_create_new_role():
    pass


@given("the user is logged in")
def log_user_in_for_create(driver: webdriver.Remote, login_user: None):
    sleep(1)
    assert_that(driver.get_cookie("SDSESSION"), is_(not_none()))


@given("the user is on the role creation page")
def set_to_role_create_page(
    driver: webdriver.Remote, endpoints: ServerEndpoints
):
    driver.get(f"{endpoints.app}/admin")
    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Roles management')]"
    ).click()

    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Create role')]"
    ).click()


@then("the user fills the form in with valid data")
def populate_form(
    driver: webdriver.Remote,
    create_role_details: RoleDetails
):
    driver.find_element(By.NAME, "name").send_keys(
        create_role_details.name
    )

    permissions_section = driver.find_element(
        By.XPATH, "//*[contains(text(), 'Role permissions')]/../div"
    )

    for permission in create_role_details.permissions:
        permissions_section.click()

        permissions_section.find_element(
            By.XPATH, f".//div/*[contains(text(), '{permission}')]"
        ).click()


@when("the user submits the create form")
def submit_create_form(driver: webdriver.Remote):
    submit = driver.find_element(
        By.XPATH, "//button[contains(text(), 'Create role')]"
    )
    submit.click()


@then("the user should see the creation confirmation modal")
def check_create_modal_present(
    driver: webdriver.Remote, create_role_details: RoleDetails
):
    assert_that(
        driver.find_element(
            By.XPATH, "//div[contains(text(), 'Role created')]"
        ).is_displayed(),
        is_(True)
    )

    modal = driver.find_element(
        By.XPATH,
        "//div[contains(@class, 'modal-body')]"
    )

    assert_that(
        modal.find_element(
            By.XPATH,
            f".//*[contains(text(), '{create_role_details.name}')]"
        ).is_displayed(),
        is_(True)
    )
    for permission in create_role_details.permissions:
        assert_that(
            modal.find_element(
                By.XPATH,
                f".//*[contains(text(), '{permission}')]"
            ).is_displayed(),
            is_(True)
        )


###################################
###################################
###################################
###################################


@scenario(
    "roles_management.feature",
    "A role needs to be updated"
)
def test_update_role():
    pass


@given("the user is logged in")
def log_user_in_for_update(driver: webdriver.Remote, login_user: None):
    sleep(1)
    assert_that(driver.get_cookie("SDSESSION"), is_(not_none()))


@given("a role to update exists")
def generate_role_to_update(driver: webdriver.Remote, test_role: RoleDetails):
    pass


@given("the user is on the role update page")
def set_to_modify_role_page(
    driver: webdriver.Remote, endpoints: ServerEndpoints
):
    driver.get(f"{endpoints.app}/admin")
    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Roles management')]"
    ).click()

    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Update role')]"
    ).click()


@then("the user selects an exiting role to update")
def select_role_to_update(
    driver: webdriver.Remote,
    test_role: RoleDetails
):
    role_index = WebDriverWait(driver, 10).until(
        lambda d: d.find_element(
            By.NAME, "roleIndex"
        )
    )
    role_select = Select(role_index)
    role_select.select_by_visible_text(test_role.name)


@then("the user clears and fills the form with valid data")
def clear_and_populate_form(
    driver: webdriver.Remote,
    update_role_details: RoleDetails
):
    name_input = driver.find_element(By.NAME, "name")
    name_input.clear()
    name_input.send_keys(
        update_role_details.name
    )


@when("the user submits the update form")
def submit_edit_form(driver: webdriver.Remote):
    submit = driver.find_element(
        By.XPATH, "//button[contains(text(), 'Update role')]"
    )
    submit.click()


@then("the user should see the update confirmation modal")
def check_edit_conf_modal_present(
    driver: webdriver.Remote, update_role_details: RoleDetails
):
    driver.find_element(By.XPATH, "//div[contains(text(), 'Role updated')]")

    modal = driver.find_element(
        By.XPATH,
        "//div[contains(@class, 'modal-body')]"
    )

    assert_that(
        modal.find_element(
            By.XPATH,
            f".//*[contains(text(), '{update_role_details.name}')]"
        ).is_displayed(),
        is_(True)
    )


###################################
###################################
###################################
###################################


@scenario(
    "roles_management.feature",
    "A role needs to be deleted"
)
def test_delete_role():
    pass


@given("the user is logged in")
def log_user_in_for_delete(driver: webdriver.Remote, login_user: None):
    sleep(1)
    assert_that(driver.get_cookie("SDSESSION"), is_(not_none()))


@given("a role to delete exists")
def generate_role_to_delete(driver: webdriver.Remote, test_role: RoleDetails):
    pass


@given("the user is on the role delete page")
def set_to_delete_role_page(
    driver: webdriver.Remote, endpoints: ServerEndpoints
):
    driver.get(f"{endpoints.app}/admin")
    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Roles management')]"
    ).click()

    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Delete role')]"
    ).click()


@then("the user selects an existing role to delete")
def select_role_to_delete(
    driver: webdriver.Remote,
    test_role: RoleDetails
):
    role_index = WebDriverWait(driver, 10).until(
        lambda d: d.find_element(
            By.NAME, "roleIndex"
        )
    )
    role_select = Select(role_index)
    role_select.select_by_visible_text(test_role.name)


@when("the user submits the delete form")
def submit_delete_form(driver: webdriver.Remote):
    submit = driver.find_element(
        By.XPATH, "//button[contains(text(), 'Delete role')]"
    )
    submit.click()


@then("the user should see the delete confirmation modal")
def check_delete_conf_modal_present(
    driver: webdriver.Remote
):
    assert_that(
        driver.find_element(
            By.XPATH,
            "//div[contains(text(), 'Role deleted')]"
        ).is_displayed(),
        is_(True)
    )


###################################
###################################
###################################
###################################


@scenario(
    "roles_management.feature",
    "A user attempted to create a role by a name that already exists"
)
def test_create_duplicate_role():
    pass


@given("the user is logged in")
def log_user_in(driver: webdriver.Remote, login_user: None):
    sleep(1)
    assert_that(driver.get_cookie("SDSESSION"), is_(not_none()))


@given("a role already exists")
def add_role(driver: webdriver.Remote, test_role: RoleDetails):
    pass


@given("the user is on the role creation page")
def set_to_role_create_page(
    driver: webdriver.Remote, endpoints: ServerEndpoints
):
    driver.get(f"{endpoints.app}/admin")
    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Roles management')]"
    ).click()

    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Create role')]"
    ).click()


@when("the user fills the form in with the name of the existing role")
def populate_form_with_duplicate_data(
    driver: webdriver.Remote,
    test_role: RoleDetails
):
    driver.find_element(By.NAME, "name").send_keys(
        test_role.name
    )

    permissions_section = driver.find_element(
        By.XPATH, "//*[contains(text(), 'Role permissions')]/../div"
    )

    for permission in test_role.permissions:
        permissions_section.click()

        permissions_section.find_element(
            By.XPATH, f".//div/*[contains(text(), '{permission}')]"
        ).click()


@when("the user submits the form")
def submit_form(driver: webdriver.Remote):
    submit = driver.find_element(
        By.XPATH, "//button[contains(text(), 'Create role')]"
    )
    submit.click()


@then("the user should be presented with an error message")
def check_error_present(
    driver: webdriver.Remote, create_role_details: RoleDetails
):
    assert_that(
        driver.find_element(
            By.XPATH,
            "//*[contains(text(), 'a role with this name already exists')]"
        ).is_displayed(),
        is_(True)
    )
