# GraphQL

## Subscriptions

A [subscription](https://dgraph.io/docs/graphql/subscriptions/) is a bi-directional websocket connection between the client and GraphQL server for live updates on data. The client can subscribe to a specific query, and the server will send updates to the client as they occur. Using this, we can update patient data in real time as it changes. This will also enable us to implement push notifications. A subscription can also be wrapped in an authorization wrapper (see [here](../graphql.md)).
