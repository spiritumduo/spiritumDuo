Feature: Decision points
    Scenario: Creating a decision point
        Given the user is logged in
        And the home page is displayed
        When the user clicks on a patient row
        Then the user should see the decision point modal
        Given the user fills the text boxes
        When the user submits the form
        Then the user should see a confirmation of no requests selected
        When the user presses the back button, selects a request and resubmits
        Then the user should see a pre-submission confirmation window
        When the user submits the pre-submission confirmation
        Then the user should see the server confirmation window
        When the user submits the server confirmation
        Then it should close the modal
