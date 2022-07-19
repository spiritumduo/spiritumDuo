Feature: Login
    Scenario: Logging the user in with valid credentials
        Given the login page is displayed
        When I insert a correct username and password and submit
        Then I should be assigned a session cookie

    Scenario: Logging the user in with invalid credentials
        Given the login page is displayed
        When I insert an incorrect username and password
        And I press the submit button
        Then I should be assigned a session cookie