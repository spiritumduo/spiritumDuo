import os
import subprocess
import sys


def run_tests():
    subprocess.run("python3 -m pytest", shell=True)


if __name__ == "__main__":
    arg = (sys.argv[1] or "").lower()

    if arg == "firefox":
        print("Running Pytest/Selenium with Firefox browser client")
        os.environ['SELENIUM_BROWSER_CLIENT'] = 'firefox'
        run_tests()
    elif arg == "chromium":
        print("Running Pytest/Selenium with Chromium browser client")
        os.environ['SELENIUM_BROWSER_CLIENT'] = 'chromium'
        run_tests()
    elif arg == "safari":
        print("Running Pytest/Selenium with Safari browser client")
        os.environ['SELENIUM_BROWSER_CLIENT'] = 'safari'
        run_tests()
    elif arg == "edge":
        print("Running Pytest/Selenium with Edge browser client")
        os.environ['SELENIUM_BROWSER_CLIENT'] = 'edge'
        run_tests()
    else:
        print("Running Pytest/Selenium with Firefox browser client")
        os.environ['SELENIUM_BROWSER_CLIENT'] = 'firefox'
        run_tests()

        print("Running Pytest/Selenium with Chromium browser client")
        os.environ['SELENIUM_BROWSER_CLIENT'] = 'chromium'
        run_tests()
