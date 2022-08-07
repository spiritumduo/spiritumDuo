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

    Scenario: A pathway is added but that name already exists
        Given the user is logged in
        Given a pathway exists
        Given the user is on the pathway create page
        When the user fills the form in with the duplicate name
        When the user submits the creation form
        Then the user should be presented with a duplication error

    Scenario: A pathway is updated with a name that already exists
        Given the user is logged in
        And a pathway exists
        And the user is on the pathway update page
        And a pathway is selected
        When the user fills the form in with the duplicate name
        When the user submits the form to update the pathway
        Then the user should be presented with a duplication error