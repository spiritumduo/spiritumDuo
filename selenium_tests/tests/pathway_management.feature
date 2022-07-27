Feature: Pathway management
    Scenario: A pathway needs to be created
        Given the user is logged in
        Given we are on the pathway creation page
        Then we fill the form in with valid data
        When we submit the create form
        Then we should see the creation confirmation modal

    Scenario: A pathway needs to be updated
        Given the user is logged in
        Given a pathway to update exists
        Given we are on the pathway update page
        Then we select an exiting pathway to update
        Then we clear and fill the form with valid data
        When we submit the update form
        Then we should see the update confirmation modal

    Scenario: A pathway needs to be deleted
        Given the user is logged in
        Given a pathway to delete exists
        Given we are on the pathway delete page
        Then we select an existing pathway to delete
        When we submit the delete form
        Then we should see the delete confirmation modal