# Manage scripts

The manage scripts are Python scripts that wipe the existing database and insert new test data. This is useful for testing and development, but also for a test-production environment where test data needs to be reset.

By default, the script removes all data, and all users EXCEPT those with non-standard names (don't start with demo-). It will then create new test data, test user accounts, and assign non-standard users with random test data.

The scripts take three arguments:

- --clearall - this clears ALL data from the database including non-standard user accounts
- --onlyclear - this will clear all data except for the non-standard user accounts and will not create new test data
- --data - this specifies the dataset used. The default (if not provided) is 'demo'. The available datasets are: 'twopathway' and 'bulk'.

## Datasets

Custom datasets are added by creating a Python file and function to create the data as-is. The main script will prepare the basics (clearing data, etc) and then call the function to create the data.
