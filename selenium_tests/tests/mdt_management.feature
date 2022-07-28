Feature: MDT implementations
    Scenario: a new MDT needs to be created
        Given the user is logged in
        Given the user is on the MDT list page 
        When the user clicks the create MDT button
        Then a modal to create an MDT is shown
        When the create form is populated correctly
        When the create form is submitted
        Then a creation confirmation modal is shown

    # Scenario: an MDT needs to be updated
    #     Given the user is logged in
    #     Given the user is on the MDT list page
    #     Given an MDT exists to update
    #     When the user clicks the edit link
    #     Then a modal to update the MDT is shown
    #     When the edit form is populated correctly
    #     When the edit form is submitted
    #     Then an edit confirmation modal is shown