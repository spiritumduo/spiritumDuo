# Selenium testing suite

Some Selenium tests have been disabled (either commented or suffixed with `.disabled`). I've been working on Selenium tests for a couple of weeks now and I keep coming up against issues when running the tests on different browsers/platforms. All of these tests were designed on and pass on Firefox on Ubuntu 20.04.

## Running tests

### Requirements

NOTE: I've added these requirements into `backend/core/requirements.dev.txt`, it's probably easier to install them from this file using `python3 -m pip install -r ./backend/core/requirements.dev.txt`, however this will install all the project dependancies too.
- pytest
- selenium
- webdriver_manager
- pytest_bdd
- hamcrest

The tests are designed to pull the hostname from env `SELENIUM_HOSTNAME`, defaulting to localhost if that is not found. If you are running the Docker stack on your local machine you will not need to adjust this. If the web server you are running the tests on is different, set `SELENIUM_HOSTNAME` appropriately (`https://websitewebsite.com`).

It's important that the database has a fresh set of data when the tests are ran. You can do this by running `python3 manage-demo.py --clear-all` in the backend container.

## Issues
- On pathway and role update/delete where a pathway/role is selected from a dropdown, Safari's driver will not send the correct value from the select option in the GQL request. I've tried setting the value in JS using `driver.execute_script()` to no avail, yet the test passes on both Linux Chromium and Linux Firefox.
- Running Safari under a GitHub action doesn't work. The tests report `NoSuchFrameException`. I think this is because Safari doesn't have a headless mode, and running tests on MacOS without having a DWM/UI doesn't work generally. One thought I had was emulate a fake display using a driver (virtual display).
- MDT management tests are disabled too, Chromium is sporadically throwing errors that an element is stale - this test works perfectly well on Ubuntu/Firefox.