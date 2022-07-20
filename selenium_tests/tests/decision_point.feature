Feature: Decision points
    Scenario: Opening a patient's decision point page
        Given the user is logged in
        And the home page is displayed
        When I click on a patient row
        Then I should see the decision point modal
        When I press the close button
        Then it should close the modal