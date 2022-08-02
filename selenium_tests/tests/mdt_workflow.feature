Feature: Patient on an MDT workflow
    Scenario: Adding a patient to an MDT
        Given the user is logged in
        And an MDT exists
        And the user is on the home page
        When the user clicks on a patient row
        Then the user should see the decision point modal
        Given the user fills the text boxes
        And the user checks an MDT checkbox
        Then a page extension asking for details should be displayed
        When this is filled and submitted
        Then the user should see a pre-submission confirmation window containing the MDT request
        When the user submits the pre-submission confirmation
        Then the user should see the server confirmation window containing the MDT request
        When the user submits the server confirmation
        Then it should close the modal
        When the user clicks on the MDT nav link
        Then the user should be presented with a list of MDTs
        When the user clicks on an MDT
        Then the user should be presented with a list of patients