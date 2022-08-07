Feature: Logout
    Scenario: Logging the user out from the home page
        Given the user is logged in
        And the user is on the home page
        When the user presses the logout button
        Then the user should remain on the login page