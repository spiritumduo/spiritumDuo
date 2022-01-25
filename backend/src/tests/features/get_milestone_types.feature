Feature: Get milestone types via GraphQL
    Scenario: getMilestoneTypes is executed
      Given MilestoneTypes are in the system
      When We run getMilestoneTypes query
      Then We get the MilestoneTypes in the system