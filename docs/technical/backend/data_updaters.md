# Data updaters

## /src/dataupdaters
  
For a similar reason to the data creators, the logic behind these are abstracted in the event that the GraphQL server needs to be changed.

These data updaters will return a class based off [`BaseMutationPayload`](../../../backend/src/common.py), so it can be returned directly by the GraphQL server, and so it can be used programatically in a more robust way than just returning a dictionary.
