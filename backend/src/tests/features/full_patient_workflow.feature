Feature: all patient operations
    Scenario: a new patient needs to be added into the system
        Given a pathway exists 
        When we run the GraphQL mutation to add the patient
        Then we get the patient's record
    Scenario: a patient needs a decision point added
        When we run the GraphQL mutation to add the decision point
        Then we get the decision point record
    Scenario: we search for a patient
        When we run the query to search for the patient
        Then we get the patient's record with the decision point and pathway