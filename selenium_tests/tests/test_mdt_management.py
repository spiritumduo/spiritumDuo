from typing import List
import pytest
from hamcrest import assert_that, is_, not_none
from selenium import webdriver
from selenium.webdriver.common.by import By
from pytest_bdd import scenario, given, when, then
from time import sleep
from conftest import MdtDetails, ServerEndpoints
# from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from conftest import change_url
from selenium.webdriver.support import (
    expected_conditions as ExpectedConditions,
)

@pytest.fixture
def create_mdt_details():
    return MdtDetails(
        location="create_mdt_test",
        index=-2
    )


@pytest.fixture
def update_mdt_details():
    return MdtDetails(
        location="update_mdt_test",
        index=-3
    )


###########################
###########################
###########################
###########################


@scenario(
    "mdt_management.feature",
    "a new MDT needs to be created"
)
def test_create_mdt():
    pass


@given("the user is logged in")
def log_user_in_for_create_mdt(driver: webdriver.Remote, login_user: None):
    sleep(1)
    assert_that(driver.get_cookie("SDSESSION"), is_(not_none()))


@given("the user is on the MDT list page")
def set_to_mdt_create_page(
    driver: webdriver.Remote, endpoints: ServerEndpoints
):
    change_url(driver, f"{endpoints.app}mdt")


@when("the user clicks the create MDT button")
def click_create_mdt_button(driver: webdriver.Remote):
    driver.find_element(
        By.XPATH,
        "//button[contains(text(), 'Create MDT')]"
    ).click()


@then("a modal to create an MDT is shown")
def check_mdt_shown(driver: webdriver.Remote):
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


@when("the create form is populated correctly")
def populate_create_mdt_form(
    driver: webdriver.Remote, create_mdt_details: MdtDetails
):
    date_selector = driver.find_element(
        By.XPATH, "//*[contains(text(), 'Date of MDT')]")
    date_selector.click()

    date_selection = driver.find_elements(
        By.CLASS_NAME, "react-datepicker__day")
    # last day possibly selected, ensures that it's after the current date
    date_selection[-1].click()

    location_input = driver.find_element(By.NAME, "location")
    location_input.send_keys(create_mdt_details.location)


@when("the create form is submitted")
def submit_create_mdt_form(driver: webdriver.Remote):
    modal = driver.find_element(By.CLASS_NAME, "modal-content")

    assert_that(
        driver.find_element(
            By.XPATH,
            ".//button[contains(text(), 'Create')]"
        ).is_displayed(),
        is_(True)
    )

    submit_button = modal.find_element(
        By.XPATH, ".//button[contains(text(), 'Create')]")
    submit_button.click()


@then("a creation confirmation modal is shown")
def check_mdt_confirmation_modal_shown(
    driver: webdriver.Remote, create_mdt_details: MdtDetails
):
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
        driver.find_element(
            By.XPATH,
            "//div[contains(@class, 'modal-body')]"
        ).is_displayed(),
        is_(True)
    )

    assert_that(
        driver.find_element(
            By.XPATH,
            "//h3[contains(text(), 'Success')]"
        ).is_displayed(),
        is_(True)
    )

    assert_that(
        driver.find_element(
            By.XPATH,
            f"//*[contains(text(), '{create_mdt_details.location}')]"
        ).is_displayed(),
        is_(True)
    )


###########################
###########################
###########################
###########################


@scenario(
    "mdt_management.feature",
    "an MDT needs to be updated"
)
def test_update_mdt():
    pass


@given("the user is logged in")
def log_user_in_for_update_mdt(driver: webdriver.Remote, login_user: None):
    sleep(1)
    assert_that(driver.get_cookie("SDSESSION"), is_(not_none()))


@given("an MDT exists to update")
def add_mdt_to_update(driver: webdriver.Remote, test_mdts: List[MdtDetails]):
    pass


@given("the user is on the MDT list page")
def set_to_mdt_update_page(
    driver: webdriver.Remote, endpoints: ServerEndpoints
):
    change_url(driver, f"{endpoints.app}mdt")


@when("the user clicks the edit link")
def click_update_mdt_button(
    driver: webdriver.Remote,
    test_mdts: List[MdtDetails]
):
    row = driver.find_element(
        By.XPATH,
        f"//*[contains(text(), '{test_mdts[2].location}')]/.."
    )
    row.find_element(
        By.XPATH,
        ".//button[contains(text(), 'edit')]"
    ).click()


@then("a modal to update the MDT is shown")
def check_mdt_update_modal_shown(driver: webdriver.Remote):
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


@when("the edit form is populated correctly")
def populate_update_mdt_form(
    driver: webdriver.Remote, update_mdt_details: MdtDetails,
    test_mdts: List[MdtDetails]
):
    modal = driver.find_element(By.CLASS_NAME, "modal-content")

    date_selector = modal.find_element(
        By.XPATH, ".//*[contains(text(), 'Date')]")
    date_selector.click()

    date_selection = modal.find_elements(
        By.CLASS_NAME, "react-datepicker__day")

    date_selection[test_mdts[0].index].click()

    location_input = modal.find_element(By.NAME, "location")
    location_input.clear()
    location_input.send_keys(update_mdt_details.location)


@when("the edit form is submitted")
def submit_update_mdt_form(driver: webdriver.Remote):
    modal = driver.find_element(By.CLASS_NAME, "modal-content")

    assert_that(
        driver.find_element(
            By.XPATH,
            ".//button[contains(text(), 'Update')]"
        ).is_displayed(),
        is_(True)
    )

    submit_button = modal.find_element(
        By.XPATH, ".//button[contains(text(), 'Update')]")
    submit_button.click()


@then("an edit confirmation modal is shown")
def check_mdt_update_confirmation_modal_shown(
    driver: webdriver.Remote, update_mdt_details: MdtDetails
):
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
        driver.find_element(
            By.XPATH,
            "//div[contains(@class, 'modal-body')]"
        ).is_displayed(),
        is_(True)
    )

    assert_that(
        driver.find_element(
            By.XPATH,
            "//h3[contains(text(), 'Success')]"
        ).is_displayed(),
        is_(True)
    )

    assert_that(
        driver.find_element(
            By.XPATH,
            f"//*[contains(text(), '{update_mdt_details.location}')]"
        ).is_displayed(),
        is_(True)
    )


###########################
###########################
###########################
###########################
###########################


# @scenario(
#     "mdt_management.feature",
#     "an MDT needs to be deleted"
# )
# def test_delete_mdt():
#     pass


# @given("the user is logged in")
# def log_user_in_for_delete_mdt(driver: webdriver.Remote, login_user: None):
#     sleep(1)
#     assert_that(driver.get_cookie("SDSESSION"), is_(not_none()))


# @given("an MDT exists to delete")
# def add_mdt_to_delete(test_mdts: List[MdtDetails]):
#     pass


# @given("the user is on the MDT list page")
# def set_to_mdt_delete_page(
#     driver: webdriver.Remote, endpoints: ServerEndpoints
# ):
#     change_url(driver, f"{endpoints.app}mdt")


# @when("the user clicks on the edit link")
# def click_edit_mdt_button(driver: webdriver.Remote, test_mdts: List[MdtDetails], update_mdt_details):
#     row = driver.find_element(
#         By.XPATH,
#         f"//*[contains(text(), '{test_mdts[1].location}')]/.."
#     )
#     row.find_element(
#         By.XPATH,
#         ".//button[contains(text(), 'edit')]"
#     ).click()


# @then("a modal to delete the MDT is shown")
# def check_mdt_delete_modal_shown(driver: webdriver.Remote):
#     modal = driver.find_element(
#         By.XPATH,
#         "//div[contains(@class, 'modal-body')]"
#     )
#     WebDriverWait(driver, 10).until(
#         ExpectedConditions.visibility_of(
#             modal
#         )
#     )
#     assert_that(
#         modal.is_displayed(),
#         is_(True)
#     )


# @when("the tab is changed to delete")
# def change_mdt_edit_tab_to_delete(driver: webdriver.Remote):
#     modal = driver.find_element(
#         By.XPATH,
#         "//div[contains(@class, 'modal-body')]"
#     )
#     modal.find_element(
#         By.XPATH,
#         "//*[contains(text(), 'Delete MDT')]"
#     ).click()


# @when("the delete form is submitted")
# def submit_delete_mdt_form(driver: webdriver.Remote):
#     modal = driver.find_element(By.CLASS_NAME, "modal-content")

#     assert_that(
#         driver.find_element(
#             By.XPATH,
#             ".//button[contains(text(), 'Delete MDT')]"
#         ).is_displayed(),
#         is_(True)
#     )

#     submit_button = modal.find_element(
#         By.XPATH, ".//button[contains(text(), 'Delete MDT')]")
#     submit_button.click()


# @then("a delete confirmation modal is shown")
# def check_mdt_delete_confirmation_modal_shown(
#     driver: webdriver.Remote
# ):
#     assert_that(
#         driver.find_element(
#             By.XPATH,
#             "//h3[contains(text(), 'Success')]"
#         ).is_displayed(),
#         is_(True)
#     )
