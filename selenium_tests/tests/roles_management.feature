Feature: Roles management
    Scenario: A role needs to be created
        Given the user is logged in
        Given the user is on the role creation page
        Then the user fills the form in with valid data
        When the user submits the create form
        Then the user should see the creation confirmation modal

    Scenario: A role needs to be updated
        Given the user is logged in
        Given a role to update exists
        Given the user is on the role update page
        Then the user selects an exiting role to update
        Then the user clears and fills the form with valid data
        When the user submits the update form
        Then the user should see the update confirmation modal

    Scenario: A role needs to be deleted
        Given the user is logged in
        Given a role to delete exists
        Given the user is on the role delete page
        Then the user selects an existing role to delete
        When the user submits the delete form
        Then the user should see the delete confirmation modal

    Scenario: A user attempted to create a role by a name that already exists
        Given the user is logged in
        Given a role already exists
        Given the user is on the role creation page
        When the user fills the form in with the name of the existing role
        When the user submits the form
        Then the user should be presented with an error message