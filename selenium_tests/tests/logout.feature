Feature: Logout
    Scenario: Logging the user out from the home page
        Given the user is logged in
        And the user is on the home page
        When I press the logout button
        Then I should not be assigned a session cookie
        Then I should be on the login page