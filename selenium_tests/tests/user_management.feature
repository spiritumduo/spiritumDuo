Feature: User management
    Scenario: A new user needs to be created
        Given the user is logged in
        Given we are on the user creation page
        Then we fill the form in with valid data
        When we submit the form
        Then we should see the confirmation modal
    Scenario: A user needs to be updated
        Given the user is logged in
        Given we are on the users list page
        When we select a user
        Then we see a modal to edit the user
        Then we change values in this form
        When we submit the edit form
        Then we get a confirmation modal