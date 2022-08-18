# Data creators

## /src/datacreators
  
The 'data creators' are functions designed to abstract the logic behind creating objects and related objects from the GraphQL mutations if there's ever a need to migrate to a new GraphQL library. This came in handy initially because we had to move from Graphene to Ariadne (more info [here](./README.md)\).  
  
The data creators should return a class based off [`BaseMutationPayload`](../../../backend/src/common.py). This means that we can re-use the logic in this function in other places with a typed return value, rather than returning a dictionary. `UserErrors` is a field that takes a list of errors from a user's input. For example, if the user inputs a string that doesn't meet a Regex spec, or if the user inputs a pathway name that already exists. It doesn't cover systemic or API errors, such as a form sending incorrect data. These should be exceptions so GraphQL can handle tham accordingly.

While we could return a dictionary it's more robust returning a class, especially given the functions could be (and some are) used outside of the GraphQL mutations.
