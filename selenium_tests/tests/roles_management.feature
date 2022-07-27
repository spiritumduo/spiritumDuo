Feature: Roles management
    Scenario: A role needs to be created
        Given the user is logged in
        Given we are on the role creation page
        Then we fill the form in with valid data
        When we submit the create form
        Then we should see the creation confirmation modal

    Scenario: A role needs to be updated
        Given the user is logged in
        Given a role to update exists
        Given we are on the role update page
        Then we select an exiting role to update
        Then we clear and fill the form with valid data
        When we submit the update form
        Then we should see the update confirmation modal

    Scenario: A role needs to be deleted
        Given the user is logged in
        Given a role to delete exists
        Given we are on the role delete page
        Then we select an existing role to delete
        When we submit the delete form
        Then we should see the delete confirmation modal