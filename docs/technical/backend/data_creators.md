# Data creators

## /src/datacreators
  
The 'data creators' are functions designed to abstract the logic behind creating objects and related objects from the GraphQL mutations if there's ever a need to migrate to a new GraphQL library. This came in handy initially because we had to move from Graphene to Ariadne.  
  
If the datacreators are GraphQL oriented, they will return a class based off [`BaseMutationPayload`](../../../backend/src/common.py). This means that we can re-use the logic in this function in other places with a typed return value, rather than returning a dictionary. `UserErrors` is a field that takes a list of errors from a user's input. For example, if the user inputs a string that doesn't meet a Regex spec, or if the user inputs a pathway name that already exists. It doesn't cover systemic or API errors, such as a form returning an incorrect value. These should be exceptions so GraphQL can handle tham accordingly.