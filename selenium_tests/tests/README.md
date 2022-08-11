# Selenium testing suite

Some Selenium tests have been disabled. I've been working on Selenium tests for a couple of weeks now and I keep coming up against issues when running the tests on different browsers/platforms. All of my tests were designed on and pass on Firefox on Ubuntu 20.04.

## Issues
- On pathway and role update/delete where a pathway/role is selected from a dropdown, Safari's driver will not send the correct value from the select option in the GQL request. I've tried setting the value in JS using `driver.execute_script()` to no avail, yet the test passes on both Linux Chromium and Linux Firefox.
- Running Safari under a GitHub action doesn't work. The tests report `FrameNotFoundException`. I think this is because Safari doesn't have a headless mode, and running tests on MacOS without having a DWM/UI doesn't work generally. One thought I had was emulate a fake display using a driver (virtual display) but I haven't got the time to look into this.