# Authentication

All authentication and user operation endpoints are pulled out into the RESTful API (FastAPI), rather than in the GraphQL server. TIB we can lock down the entire GraphQL server behind an authentication wrapper, rather than exposing specific queries/mutations.

## Login

This function is only called on login via a RESTful API. When the user is authenticated, it will return a safe user object (user object without password), the session token (for WebSocket authentication), as well as certain configuration options. This is fine but if a considerable amount of configuration options need to be sent in the future it might not be the most ideal design.

## Sessions

Session tokens are issued on login and are encrypted using `itsdangerous` (key specified in backend .env). They're randomly generated strings issued on logon. On each request, the session token's expiry is reset.
  
This is great because it's simple, however ideally we should be looking into using [JWTs](https://jwt.io/introduction/) (SDB-135). Support for JWTs means that we should be able to use an OAuth2 provider ([LDAP](https://ldap.com/)/[ADFS](https://docs.microsoft.com/en-us/windows-server/identity/ad-fs/ad-fs-overview)). Note, JWTs are not officially a part of the OAuth2 spec, but most identity providers support them.