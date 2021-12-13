Feature: testing all user operations via REST
    Scenario: a new user is created
        Given we have valid user information
        When we create their user account
        Then we get the user's ID