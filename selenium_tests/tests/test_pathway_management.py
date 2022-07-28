import pytest
from random import randint
from hamcrest import assert_that, is_, not_none
from selenium import webdriver
from selenium.webdriver.common.by import By
from pytest_bdd import scenario, given, when, then
from time import sleep
from selenium_tests.conftest import PathwayDetails, ServerEndpoints
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait


@pytest.fixture
def create_pathway_details():
    return PathwayDetails(
        name=f"custom pathway{randint(1, 100)}",
        clinical_requests=["Referral letter"]
    )


@pytest.fixture
def update_pathway_details():
    return PathwayDetails(
        name=f"custom pathway{randint(1, 100)}",
        clinical_requests=["Referral letter"]
    )


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


@given("we are on the pathway creation page")
def set_to_pathway_create_page(
    driver: webdriver.Remote, endpoints: ServerEndpoints
):
    driver.get(f"{endpoints.app}/admin")
    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Pathway management')]"
    ).click()

    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Create pathway')]"
    ).click()


@then("we fill the form in with valid data")
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


@when("we submit the create form")
def submit_create_pathway_form(driver: webdriver.Remote):
    submit = driver.find_element(
        By.XPATH, "//button[contains(text(), 'Create pathway')]"
    )
    submit.click()


@then("we should see the creation confirmation modal")
def check_create_pathway_modal_present(
    driver: webdriver.Remote, create_pathway_details: PathwayDetails
):
    assert_that(
        driver.find_element(
            By.XPATH,
            "//div[contains(text(), 'Pathway created')]"
        ).is_displayed(),
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


###################################
###################################
###################################
###################################


@scenario(
    "pathway_management.feature",
    "A pathway needs to be updated"
)
def test_update_pathway():
    pass


@given("the user is logged in")
def log_user_in_for_update_pathway(driver: webdriver.Remote, login_user: None):
    sleep(1)
    assert_that(driver.get_cookie("SDSESSION"), is_(not_none()))


@given("a pathway to update exists")
def generate_pathway_to_update(driver: webdriver.Remote, test_pathway):
    pass


@given("we are on the pathway update page")
def set_to_modify_pathway_page(
    driver: webdriver.Remote, endpoints: ServerEndpoints
):
    driver.get(f"{endpoints.app}/admin")
    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Pathway management')]"
    ).click()

    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Update pathway')]"
    ).click()


@then("we select an exiting pathway to update")
def select_pathway_to_update(
    driver: webdriver.Remote,
    test_pathway: PathwayDetails
):
    selector = WebDriverWait(driver, 10).until(
        lambda d: d.find_element(
            By.NAME, "pathwayIndex"
        )
    )
    select = Select(selector)
    select.select_by_visible_text(test_pathway.name)


@then("we clear and fill the form with valid data")
def clear_and_populate_pathway_update_form(
    driver: webdriver.Remote,
    update_pathway_details: PathwayDetails
):
    name_input = driver.find_element(By.NAME, "name")
    name_input.clear()
    name_input.send_keys(
        update_pathway_details.name
    )


@when("we submit the update form")
def submit_edit_pathway_form(driver: webdriver.Remote):
    submit = driver.find_element(
        By.XPATH, "//button[contains(text(), 'Update pathway')]"
    )
    submit.click()


@then("we should see the update confirmation modal")
def check_edit_pathway_conf_modal_present(
    driver: webdriver.Remote, update_pathway_details: PathwayDetails
):
    assert_that(
        driver.find_element(
            By.XPATH, "//div[contains(text(), 'Pathway Updated')]"
        ).is_displayed(),
        is_(True)
    )

    modal = driver.find_element(
        By.XPATH,
        "//div[contains(@class, 'modal-body')]"
    )

    modal.find_element(
        By.XPATH,
        f".//*[contains(text(), '{update_pathway_details.name}')]"
    )


###################################
###################################
###################################
###################################


@scenario(
    "pathway_management.feature",
    "A pathway needs to be deleted"
)
def test_delete_pathway():
    pass


@given("the user is logged in")
def log_user_in_for_delete_pathway(driver: webdriver.Remote, login_user: None):
    sleep(1)
    assert_that(driver.get_cookie("SDSESSION"), is_(not_none()))


@given("a pathway to delete exists")
def generate_pathway_to_delete(
    driver: webdriver.Remote, test_pathway: PathwayDetails
):
    pass


@given("we are on the pathway delete page")
def set_to_delete_pathway_page(
    driver: webdriver.Remote, endpoints: ServerEndpoints
):
    driver.get(f"{endpoints.app}/admin")
    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Pathway management')]"
    ).click()

    driver.find_element(
        By.XPATH,
        "//li[contains(text(), 'Delete pathway')]"
    ).click()


@then("we select an existing pathway to delete")
def select_pathway_to_delete(
    driver: webdriver.Remote,
    test_pathway: PathwayDetails
):
    index = WebDriverWait(driver, 10).until(
        lambda d: d.find_element(
            By.NAME, "pathwayIndex"
        )
    )
    select = Select(index)
    select.select_by_visible_text(test_pathway.name)


@when("we submit the delete form")
def submit_delete_pathway_form(driver: webdriver.Remote):
    submit = driver.find_element(
        By.XPATH, "//button[contains(text(), 'Delete pathway')]"
    )
    submit.click()


@then("we should see the delete confirmation modal")
def check_delete_pathway_conf_modal_present(
    driver: webdriver.Remote
):
    assert_that(
        driver.find_element(
            By.XPATH, "//div[contains(text(), 'Pathway deleted')]"
        ).is_displayed(),
        is_(True)
    )
