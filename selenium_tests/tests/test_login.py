from selenium import webdriver
from selenium.webdriver.common.keys import Keys 
from selenium.webdriver.common.by import By
from pytest_bdd import scenario, given, when, then
from time import sleep

@scenario("login.feature", "Logging the user in with valid credentials")
def test_login_correct_creds():
    pass

@given("the login page is displayed")
def set_login_page(firefox_driver: webdriver.Firefox):
    firefox_driver.get("http://sd.foxtrot-titan.co.uk/app")

@when("I insert a correct username and password and submit")
def insert_correct_credentials(firefox_driver: webdriver.Firefox):
    # username field
    firefox_driver.find_element(By.NAME, "username").send_keys("demo-1-2")

    # password field
    firefox_driver.find_element(By.NAME, "password").send_keys("22password1")    

    # submit button
    firefox_driver.find_element(By.ID, "submit").send_keys(Keys.ENTER)

@then("I should be assigned a session cookie")
def check_cookie(firefox_driver: webdriver.Firefox):
    # we wait what we think is a timely amount of time
    sleep(1)

    # check session cookie has been set  
    assert firefox_driver.get_cookie("SDSESSION") is not None

@then("I should not be on the login page")
def check_url(firefox_driver: webdriver.Firefox):
    # check URL does not container /app/login  
    assert firefox_driver.current_url.find("/login") == -1


@scenario("login.feature", "Logging the user in with invalid credentials")
def test_login_incorrect_creds():
    pass

@given("the login page is displayed")
def set_login_page(firefox_driver: webdriver.Firefox):
    firefox_driver.get("http://sd.foxtrot-titan.co.uk/app")

@when("I insert an incorrect username and password and submit")
def insert_correct_credentials(firefox_driver: webdriver.Firefox):
    # username field
    firefox_driver.find_element(By.NAME, "username").send_keys("thisisincorrect")

    # password field
    firefox_driver.find_element(By.NAME, "password").send_keys("thisiswrongtoo")    

    # submit button
    firefox_driver.find_element(By.ID, "submit").send_keys(Keys.ENTER)

@then("I should not be assigned a session cookie")
def check_cookie(firefox_driver: webdriver.Firefox):
    # we wait what we think is a timely amount of time
    sleep(1)

    # check session cookie has been set  
    assert firefox_driver.get_cookie("SDSESSION") is None

@then("I should still be on the login page")
def check_url(firefox_driver: webdriver.Firefox):
    # check URL contains /app/login  
    assert firefox_driver.current_url.find("/login") != -1