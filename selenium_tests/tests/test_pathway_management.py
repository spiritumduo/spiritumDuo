from typing import List
import pytest
from random import randint
from hamcrest import assert_that, is_, not_none
from selenium import webdriver
from selenium.webdriver.common.by import By
from pytest_bdd import scenario, given, when, then
from time import sleep
from conftest import PathwayDetails, ServerEndpoints
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from conftest import change_url
from selenium.webdriver.remote.webelement import WebElement

@pytest.fixture
def create_pathway_details():
    return PathwayDetails(
        name="create_pathway_test",
        clinical_requests=["Referral letter"]
    )


@pytest.fixture
def update_pathway_details():
    return PathwayDetails(
        name="update_pathway_test",
        clinical_requests=["Referral letter"]
    )


###########################
###########################
###########################
###########################


@scenario(
    "pathway_management.feature",
    "A pathway needs to be created"
)
def test_create_new_pathway():
    pass


@given("the user is logged in")
def log_user_in_for_create_pathway(driver: webdriver.Remote, login_user: None):
    sleep(1)
    assert_that(driver.get_cookie("SDSESSION"), is_(not_none()))


@given("the user is on the pathway creation page")
def set_to_pathway_create_page(
    driver: webdriver.Remote, endpoints: ServerEndpoints
):
    change_url(driver, f"{endpoints.app}admin")
    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Pathway management')]"
    ).click()

    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Create pathway')]"
    ).click()


@then("the user fills the form in with valid data")
def populate_create_pathway_form(
    driver: webdriver.Remote,
    create_pathway_details: PathwayDetails
):
    driver.find_element(By.NAME, "name").send_keys(
        create_pathway_details.name
    )

    requests_section = driver.find_element(
        By.XPATH, "//*[contains(text(), 'Clinical request types')]/../div"
    )

    for request in create_pathway_details.clinical_requests:
        requests_section.click()

        requests_section.find_element(
            By.XPATH, f".//div/*[contains(text(), '{request}')]"
        ).click()


@when("the user submits the create form")
def submit_create_pathway_form(driver: webdriver.Remote):
    submit = driver.find_element(
        By.XPATH, "//button[contains(text(), 'Create pathway')]"
    )
    submit.click()


@then("the user should see the creation confirmation modal")
def check_create_pathway_modal_present(
    driver: webdriver.Remote, create_pathway_details: PathwayDetails
):
    success_text = driver.find_element(
        By.XPATH,
        "//div[contains(text(), 'Pathway created')]"
    )

    WebDriverWait(driver, 10).until(
        lambda d: success_text.is_displayed()
    )

    assert_that(
        success_text.is_displayed(),
        is_(True)
    )

    modal = driver.find_element(
        By.XPATH,
        "//div[contains(@class, 'modal-body')]"
    )

    modal.find_element(
        By.XPATH,
        f".//*[contains(text(), '{create_pathway_details.name}')]"
    )
    for request in create_pathway_details.clinical_requests:
        modal.find_element(
            By.XPATH,
            f".//*[contains(text(), '{request}')]"
        )


# ###################################
# ###################################
# ###################################
# ###################################


# @scenario(
#     "pathway_management.feature",
#     "A pathway needs to be updated"
# )
# def test_update_pathway():
#     pass


# @given("the user is logged in")
# def log_user_in_for_update_pathway(driver: webdriver.Remote, login_user: None):
#     sleep(1)
#     assert_that(driver.get_cookie("SDSESSION"), is_(not_none()))


# @given("a pathway to update exists")
# def generate_pathway_to_update(
#     driver: webdriver.Remote,
#     test_pathways: List[PathwayDetails]
# ):
#     pass


# @given("the user is on the pathway update page")
# def set_to_modify_pathway_page(
#     driver: webdriver.Remote, endpoints: ServerEndpoints
# ):
#     change_url(driver, f"{endpoints.app}admin")

#     driver.find_element(
#         By.XPATH,
#         "//li[contains(text(), 'Pathway management')]"
#     ).click()

#     driver.find_element(
#         By.XPATH,
#         "//li[contains(text(), 'Update pathway')]"
#     ).click()


# @then("the user selects an exiting pathway to update")
# def select_pathway_to_update(
#     driver: webdriver.Remote,
#     test_pathways: List[PathwayDetails]
# ):
#     selector = WebDriverWait(driver, 10).until(
#         lambda d: d.find_element(
#             By.NAME, "pathwayIndex"
#         )
#     )
#     select = Select(selector)
#     select.select_by_visible_text(test_pathways[0].name)
#     print(select.options)


# @then("the user clears and fills the form with valid data")
# def clear_and_populate_pathway_update_form(
#     driver: webdriver.Remote,
#     update_pathway_details: PathwayDetails
# ):
#     name_input = driver.find_element(By.NAME, "name")
#     name_input.clear()
#     name_input.send_keys(
#         update_pathway_details.name
#     )


# @when("the user submits the update form")
# def submit_update_pathway_form(driver: webdriver.Remote):
#     submit = driver.find_element(
#         By.XPATH, "//button[contains(text(), 'Update pathway')]"
#     )
#     submit.click()


# @then("the user should see the update confirmation modal")
# def check_edit_pathway_conf_modal_present(
#     driver: webdriver.Remote, update_pathway_details: PathwayDetails
# ):
#     success_text = driver.find_element(
#         By.XPATH, "//div[contains(text(), 'Pathway Updated')]"
#     )
    
#     WebDriverWait(driver, 10).until(
#         lambda d: success_text.is_displayed()
#     )

#     assert_that(
#         success_text.is_displayed(),
#         is_(True)
#     )

#     modal = driver.find_element(
#         By.XPATH,
#         "//div[contains(@class, 'modal-body')]"
#     )

#     modal.find_element(
#         By.XPATH,
#         f".//*[contains(text(), '{update_pathway_details.name}')]"
#     )


###################################
###################################
###################################
###################################


# @scenario(
#     "pathway_management.feature",
#     "A pathway needs to be deleted"
# )
# def test_delete_pathway():
#     pass


# @given("the user is logged in")
# def log_user_in_for_delete_pathway(driver: webdriver.Remote, login_user: None):
#     sleep(1)
#     assert_that(driver.get_cookie("SDSESSION"), is_(not_none()))


# @given("a pathway to delete exists")
# def generate_pathway_to_delete(
#     driver: webdriver.Remote,
#     test_pathways: List[PathwayDetails]
# ):
#     pass


# @given("the user is on the pathway delete page")
# def set_to_delete_pathway_page(
#     driver: webdriver.Remote, endpoints: ServerEndpoints
# ):
#     change_url(driver, f"{endpoints.app}admin")

#     driver.find_element(
#         By.XPATH,
#         "//li[contains(text(), 'Pathway management')]"
#     ).click()

#     driver.find_element(
#         By.XPATH,
#         "//li[contains(text(), 'Delete pathway')]"
#     ).click()


# @then("the user selects an existing pathway to delete")
# def select_pathway_to_delete(
#     driver: webdriver.Remote,
#     test_pathways: List[PathwayDetails]
# ):
#     selector = WebDriverWait(driver, 10).until(
#         lambda d: d.find_element(
#             By.NAME, "pathwayIndex"
#         )
#     )
#     select = Select(selector)
#     select.select_by_visible_text(test_pathways[0].name)
#     options: List[WebElement] = select.options
#     option_value = None
#     for option in options:
#         print(f"Checking {option.text} against {test_pathways[3].name}")
#         if option.text == test_pathways[3].name:
#             option_value = option.get_property("value")
#             break
#     select.select_by_value(option_value)


# @when("the user submits the delete form")
# def submit_delete_pathway_form(driver: webdriver.Remote):
#     submit = driver.find_element(
#         By.XPATH, "//button[contains(text(), 'Delete pathway')]"
#     )
#     submit.click()


# @then("the user should see the delete confirmation modal")
# def check_delete_pathway_conf_modal_present(
#     driver: webdriver.Remote
# ):
#     driver.find_element(
#         By.XPATH, "//div[contains(text(), 'Pathway deleted')]"
#     )

#     WebDriverWait(driver, 10).until(
#         lambda d: d.find_element(
#             By.XPATH, "//div[contains(text(), 'Pathway deleted')]"
#         ).is_displayed()
#     )

#     assert_that(
#         driver.find_element(
#             By.XPATH, "//div[contains(text(), 'Pathway deleted')]"
#         ).is_displayed(),
#         is_(True)
#     )


###################################
###################################
###################################
###################################


@scenario(
    "pathway_management.feature",
    "A pathway is added but that name already exists"
)
def test_create_duplicate_pathway():
    pass


@given("the user is logged in")
def log_user_in_for_create_pathway(driver: webdriver.Remote, login_user: None):
    sleep(1)
    assert_that(driver.get_cookie("SDSESSION"), is_(not_none()))


@given("a pathway exists")
def create_pathway(
    driver: webdriver.Remote,
    test_pathways: List[PathwayDetails]
):
    pass


@given("the user is on the pathway create page")
def set_to_pathway_creation_page(
    driver: webdriver.Remote, endpoints: ServerEndpoints
):
    change_url(driver, f"{endpoints.app}admin")
    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Pathway management')]"
    ).click()

    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Create pathway')]"
    ).click()


@when("the user fills the form in with the duplicate name")
def populate_create_with_duplicate_name(
    driver: webdriver.Remote,
    test_pathways: List[PathwayDetails]
):
    driver.find_element(By.NAME, "name").send_keys(
        test_pathways[2].name
    )

    requests_section = driver.find_element(
        By.XPATH, "//*[contains(text(), 'Clinical request types')]/../div"
    )

    for request in test_pathways[0].clinical_requests:
        requests_section.click()

        requests_section.find_element(
            By.XPATH, f".//div/*[contains(text(), '{request}')]"
        ).click()


@when("the user submits the creation form")
def submit_create_pathway_form(driver: webdriver.Remote):
    submit = driver.find_element(
        By.XPATH, "//button[contains(text(), 'Create pathway')]"
    )
    submit.click()


@then("the user should be presented with a duplication error")
def check_error_present(
    driver: webdriver.Remote
):
    assert_that(
        driver.find_element(
            By.XPATH,
            "//*[contains(text(), 'A pathway with this name already exists')]"
        ).is_displayed(),
        is_(True)
    )


# ###################################
# ###################################
# ###################################
# ###################################


# @scenario(
#     "pathway_management.feature",
#     "A pathway is updated with a name that already exists"
# )
# def test_update_duplicate_pathway():
#     pass


# @given("the user is logged in")
# def log_user_in_for_update_pathway(driver: webdriver.Remote, login_user: None):
#     sleep(1)
#     assert_that(driver.get_cookie("SDSESSION"), is_(not_none()))


# @given("a pathway exists")
# def create_pathway(driver: webdriver.Remote, test_pathways: List[PathwayDetails]):
#     pass


# @given("the user is on the pathway update page")
# def set_to_pathway_update_page(
#     driver: webdriver.Remote, endpoints: ServerEndpoints
# ):
#     change_url(driver, f"{endpoints.app}admin")
#     driver.find_element(
#         By.XPATH,
#         "//li[contains(text(), 'Pathway management')]"
#     ).click()

#     driver.find_element(
#         By.XPATH,
#         "//li[contains(text(), 'Update pathway')]"
#     ).click()


# @given("a pathway is selected")
# def select_pathway(
#     driver: webdriver.Remote,
#     test_pathways: List[PathwayDetails]
# ):
#     selector = WebDriverWait(driver, 10).until(
#         lambda d: d.find_element(
#             By.NAME, "pathwayIndex"
#         )
#     )
#     select = Select(selector)
#     select.select_by_visible_text(test_pathways[2].name)


# @when("the user fills the form in with the duplicate name")
# def populate_update_with_duplicate_name(
#     driver: webdriver.Remote,
#     test_pathways: List[PathwayDetails]
# ):
#     nameTxt = driver.find_element(By.NAME, "name")
#     nameTxt.clear()
#     nameTxt.send_keys(
#         test_pathways[3].name
#     )


# @when("the user submits the form to update the pathway")
# def submit_update_pathway_form(driver: webdriver.Remote):
#     submit = driver.find_element(
#         By.XPATH, "//button[contains(text(), 'Update pathway')]"
#     )
#     submit.click()


# @then("the user should be presented with a duplication error")
# def check_error_present(
#     driver: webdriver.Remote
# ):
#     assert_that(
#         driver.find_element(
#             By.XPATH,
#             "//*[contains(text(), 'A pathway with this name already exists')]"
#         ).is_displayed(),
#         is_(True)
#     )
