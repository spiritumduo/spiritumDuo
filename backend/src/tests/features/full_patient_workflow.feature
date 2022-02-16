Feature: all patient operations
    Scenario: a new patient needs to be added into the system
        Given a pathway exists 
        When we run the GraphQL mutation to add the patient onto the pathway
        Then we get the patient's record
    Scenario: a patient needs a decision point added and milestones requested
        When we run the GraphQL mutation to add the decision point and milestones
        Then the milestones are completed
    Scenario: we search for a patient
        When we run the query to search for the patient
        Then we get the patient's record with all created data