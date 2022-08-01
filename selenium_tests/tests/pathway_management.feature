Feature: Pathway management
    Scenario: A pathway needs to be created
        Given the user is logged in
        Given the user is on the pathway creation page
        Then the user fills the form in with valid data
        When the user submits the create form
        Then the user should see the creation confirmation modal

    Scenario: A pathway needs to be updated
        Given the user is logged in
        Given a pathway to update exists
        Given the user is on the pathway update page
        Then the user selects an exiting pathway to update
        Then the user clears and fills the form with valid data
        When the user submits the update form
        Then the user should see the update confirmation modal

    Scenario: A pathway needs to be deleted
        Given the user is logged in
        Given a pathway to delete exists
        Given the user is on the pathway delete page
        Then the user selects an existing pathway to delete
        When the user submits the delete form
        Then the user should see the delete confirmation modal