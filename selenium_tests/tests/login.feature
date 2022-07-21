Feature: Login
    Scenario: Logging the user in with valid credentials
        Given the login page is displayed
        When I insert a correct username and password and submit
        Then I should be assigned a session cookie
        Then I should not be on the login page

    Scenario: Logging the user in with invalid credentials
        Given the login page is displayed
        When I insert an incorrect username and password and submit
        Then I should not be assigned a session cookie
        And I should still be on the login page