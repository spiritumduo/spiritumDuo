from selenium import webdriver
from selenium.webdriver.common.keys import Keys 
from time import sleep
from selenium.webdriver.common.by import By

def test_login(firefox_driver: webdriver.Firefox):
    firefox_driver.get("http://sd.foxtrot-titan.co.uk/app")

    # username field
    firefox_driver.find_element(By.NAME, "username").send_keys("demo-1-2")

    # password field
    firefox_driver.find_element(By.NAME, "password").send_keys("22password1")    

    # submit button
    firefox_driver.find_element(By.ID, "submit").send_keys(Keys.ENTER)

    # we wait what we think is a timely amount of time
    sleep(1)

    # check session cookie has been set  
    assert firefox_driver.get_cookie("SDSESSION") is not None
