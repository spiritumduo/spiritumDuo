# Manage scripts

The manage scripts are Python scripts that wipe the existing database and insert new test data. This is useful for testing and development, but also for a test-production environment where test data needs to be reset.

By default, the script removes all data, and all users EXCEPT those with non-standard names (don't start with demo-). It will then create new test data, test user accounts, and assign non-standard users with random test data.

The scripts take two arguments:
    - --clearall - this clears ALL data from the database including non-standard user accounts
    - --onlyclear - this will clear all data except for the non-standard user accounts and will not create new test data
