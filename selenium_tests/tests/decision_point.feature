Feature: Decision points
    Scenario: Creating a decision point
        Given the user is logged in
        And the home page is displayed
        When I click on a patient row
        Then I should see the decision point modal
        Given I fill the text boxes
        When I submit the form
        Then I should see a confirmation of no requests selected
        When I go back, select a request and resubmit
        Then I should see a pre-submission confirmation window
        When I submit the pre-submission confirmation
        Then I should see the server confirmation window
        When I submit the server confirmation
        Then it should close the modal