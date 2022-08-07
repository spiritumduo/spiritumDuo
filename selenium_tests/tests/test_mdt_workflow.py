from hamcrest import assert_that, equal_to, greater_than, is_, is_not
from selenium import webdriver
from selenium.webdriver.common.by import By
from pytest_bdd import scenario, given, when, then
from time import sleep
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.remote.webelement import WebElement
from conftest import MdtDetails, ServerEndpoints
from selenium.webdriver.support import (
    expected_conditions as ExpectedConditions,
)
from conftest import change_url
from selenium.common.exceptions import NoSuchElementException


SELECTED_MDT_DATE = ""


@scenario(
    "mdt_workflow.feature",
    "Adding a patient to an MDT"
)
def test_create_decision_point_with_mdt():
    pass


@given("the user is logged in")
def log_user_in(driver: webdriver.Remote, login_user: None):
    sleep(1)
    assert_that(driver.get_cookie("SDSESSION"), is_not(None))


@given("an MDT exists")
def add_mdt(
    driver: webdriver.Remote,
    test_mdt: MdtDetails
):
    pass


@given("the user is on the home page")
def set_on_homepage(driver: webdriver.Remote, endpoints: ServerEndpoints):
    change_url(driver, endpoints.app)


@when("the user clicks on a patient row")
def click_patient_row(driver: webdriver.Remote):
    patient_list = driver.find_elements(By.CLASS_NAME, 'sd-hidden-button')
    assert_that(len(patient_list), is_(greater_than(0)))

    for patient_button in patient_list:
        if patient_button.get_property("disabled") is False or None:
            patient_button.click()
            break


@then("the user should see the decision point modal")
def check_modal_present(driver: webdriver.Remote):
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


@given("the user fills the text boxes")
def populate_text_boxes(driver: webdriver.Remote):
    clinical_history: WebElement = WebDriverWait(driver, 10).until(
        lambda d: d.find_element(By.NAME, "clinicHistory")
    )
    clinical_history.clear()
    clinical_history.send_keys("clinical_history")

    comorbidities: WebElement = WebDriverWait(driver, 10).until(
        lambda d: d.find_element(By.NAME, "comorbidities")
    )
    comorbidities.clear()
    comorbidities.send_keys("comorbidities")


@given("the user checks an MDT checkbox")
def check_mdt_checkbox(driver: webdriver.Remote):
    checkbox = driver.find_element(
        By.XPATH,
        "//*[contains(text(), 'Add to MDT')]/input"
    )
    checkbox.click()


@then("a page extension asking for details should be displayed")
def populate_mdt_details(driver: webdriver.Remote):
    reasonTxt = driver.find_element(By.NAME, 'mdtReason')
    assert_that(reasonTxt.is_displayed(), is_(True))

    mdtSelector = driver.find_element(By.NAME, 'mdtSessionId')
    assert_that(mdtSelector.is_displayed(), is_(True))


@when("this is filled and submitted")
def populate_and_submit_form(driver: webdriver.Remote):
    # https://stackoverflow.com/questions/46738214/selenium-select-value-from-dropdown-not-working-in-edge-safari-but-works-in-othe
    # https://stackoverflow.com/questions/42575464/selenium-with-safari-cant-select-option-from-select-input

    global SELECTED_MDT_DATE

    WebDriverWait(driver, 10).until(
        ExpectedConditions.element_to_be_clickable(
            driver.find_element(By.NAME, 'mdtReason')
        )
    )

    driver.find_element(By.NAME, 'mdtSessionId').click()

    mdtSelection = Select(driver.find_element(By.NAME, 'mdtSessionId'))

    Select(WebDriverWait(driver, 10).until(
        ExpectedConditions.element_to_be_clickable(
            driver.find_element(By.NAME, 'mdtSessionId')
        )
    )).select_by_index(1)

    SELECTED_MDT_DATE = mdtSelection.first_selected_option.text

    reasonTxt = driver.find_element(By.NAME, 'mdtReason')
    reasonTxt.clear()
    reasonTxt.send_keys("reasons go here")

    driver.find_element(
        By.XPATH,
        "//button[contains(text(), 'Submit')]"
    ).click()


@then("the user should see a pre-submission confirmation window containing the MDT request")
def check_presub_modal(driver: webdriver.Remote):
    assert_that(
        driver.find_element(
            By.XPATH,
            "//h2[contains(text(), 'Submit these requests')]"
        ).is_displayed(),
        is_(True)
    )

    assert_that(
        driver.find_element(
            By.XPATH,
            "//*[contains(text(), 'Add to MDT')]"
        ).is_displayed(),
        is_(True)
    )


@when("the user submits the pre-submission confirmation")
def submit_presub_modal(driver: webdriver.Remote):
    driver.find_element(By.XPATH, "//button[contains(text(), 'OK')]").click()


@then("the user should see the server confirmation window containing the MDT request")
def check_sub_modal(driver: webdriver.Remote):
    assert_that(
        driver.find_element(
            By.XPATH,
            "//h2[contains(text(), 'Decision Submitted')]"
        ).is_displayed(),
        is_(True)
    )

    assert_that(
        driver.find_element(
            By.XPATH,
            "//*[contains(text(), 'Add to MDT')]"
        ).is_displayed(),
        is_(True)
    )


@when("the user submits the server confirmation")
def submit_sub_modal(driver: webdriver.Remote):
    driver.find_element(By.XPATH, "//button[contains(text(), 'OK')]").click()


@then("it should close the modal")
def close_sub_modal(driver: webdriver.Remote):
    assert_that(
        len(driver.find_elements(By.CSS_SELECTOR, '.modal-body')),
        equal_to(0)
    )


@when("the user clicks on the MDT nav link")
def click_on_mdt_nav(driver: webdriver.Remote):
    driver.find_element(By.XPATH, "//a[contains(text(), 'MDT')]").click()

    sleep(1)
    WebDriverWait(
        driver, 10,
        ignored_exceptions=[NoSuchElementException]
    ).until(
        ExpectedConditions.visibility_of(
            driver.find_element(By.ID, "root")
        )
    )


@then("the user should be presented with a list of MDTs")
def check_list_of_mdts(driver: webdriver.Remote):
    table_body = driver.find_element(By.CLASS_NAME, "nhsuk-table__body")
    mdts = table_body.find_elements(By.CLASS_NAME, "nhsuk-table__row")

    assert_that(
        len(mdts),
        greater_than(0)
    )


@when("the user clicks on an MDT")
def select_mdt(
    driver: webdriver.Remote,
):
    print(SELECTED_MDT_DATE)
    row: WebElement = WebDriverWait(driver, 10).until(
        ExpectedConditions.element_to_be_clickable(
            driver.find_element(
                By.XPATH,
                f"//*[contains(text(), '{SELECTED_MDT_DATE}')]"
            )
        )
    )
    print(row.get_attribute("class"))
    row.click()


@then("the user should be presented with a list of patients")
def check_patient_list(driver: webdriver.Remote):
    table_body = driver.find_element(By.CLASS_NAME, "nhsuk-table__body")
    patients = table_body.find_elements(By.CLASS_NAME, "nhsuk-table__row")

    assert_that(
        len(patients),
        greater_than(0)
    )
