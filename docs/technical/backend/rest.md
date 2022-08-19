# RESTful endpoints

The RESTful endpoints are using FastAPI. The FastAPI documentation can be found [here](https://fastapi.tiangolo.com/). These endpoints provide authentication and user specific operations, such as roles and user management. This is done so we can wrap the entirety of GraphQL in an authentication wrapper.

The REST API is also used or communication between the pseudotie (fake trust backend) and the project's backend. Ideally this should be moved into the [trust adapter](./trust_adapter.md). 

## Authorization

Authorization is handled the same as in GraphQL, using wrappers. The authorization wrapper is responsible for checking the user's permissions. Failure to meet authorization critera will result in a HTTP 403 (forbidden) response.
Failures in these RESTful endpoints are handled by returning HTTP codes.
  
For example

```python
class ConflictHTTPException(HTTPException):
    def __init__(self, detail: str):
        super().__init__(detail=detail, status_code=409)
```
