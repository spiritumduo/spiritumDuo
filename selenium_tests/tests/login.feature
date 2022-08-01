Feature: Login
    Scenario: Logging the user in with valid credentials
        Given the login page is displayed
        When the user inserts a correct username and password and submits
        Then the user should be assigned a session cookie
        Then the user should not be on the login page

    Scenario: Logging the user in with invalid credentials
        Given the login page is displayed
        When the user inserts an incorrect username and password and submits
        Then the user should not be assigned a session cookie
        And the user should still be on the login page