from hamcrest import assert_that, equal_to, greater_than, is_, not_none
from selenium import webdriver
from selenium.webdriver.common.by import By
from pytest_bdd import scenario, given, when, then
from time import sleep


@scenario("decision_point.feature", "Opening a patient's decision point page")
def test_show_decision_point_modal():
    pass


@given("the user is logged in")
def log_user_in(driver: webdriver.Remote, login_user: None):
    sleep(1)
    assert_that(driver.get_cookie("SDSESSION"), is_(not_none()))


@given("the home page is displayed")
def check_is_on_homepage(driver: webdriver.Remote, login_user: None):
    assert_that(driver.current_url.endswith("/app/"), is_(equal_to(True)))


@when("I click on a patient row")
def insert_correct_credentials(driver: webdriver.Remote):
    patient_list = driver.find_elements(By.CLASS_NAME, 'sd-hidden-button')
    assert_that(len(patient_list), is_(greater_than(0)))

    for patient_button in patient_list:
        if patient_button.get_property("disabled") is False or None:
            patient_button.click()
            break


@then("I should see the decision point modal")
def check_modal_present(driver: webdriver.Remote):
    driver.find_element(By.CSS_SELECTOR, '.modal-body')


@when("I press the close button")
def close_modal(driver: webdriver.Remote):
    driver.find_element(By.NAME, 'Close').click()


@then("it should close the modal")
def check_close_modal(driver: webdriver.Remote):
    assert_that(
        len(driver.find_elements(By.CSS_SELECTOR, '.modal-body')),
        equal_to(0)
    )
