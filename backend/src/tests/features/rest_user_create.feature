Feature: testing all user operations via REST
    Scenario: a new user is created
        When we create their user account
        Then we get the user's ID