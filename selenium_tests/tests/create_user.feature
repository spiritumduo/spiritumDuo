Feature: Create user
    Scenario: A new user needs to be created
        Given the user is logged in
        Given we are on the user administration page and tab
        Then we fill the form in with valid data
        When we submit the form
        Then we should see the confirmation modal