# Data loaders

## /src/dataloaders
  
A dataloader is a class in and of itself for batching and caching data, designed by Facebook. The Python implementation/port of this is [aiodataloader](https://pypi.org/project/aiodataloader/). The dataloader object is stored in the request context, so it can persist over a user's session.  
The dataloader works by caching results of queries. This is useful where the same data can be pulled multiple times (ie, this prevents calling the database needlessly). Data is cached automatically when using `load_from_id`, `load_many_from_id`, and `load_all` (not implemented everywhere). Data can be cached manually by using the `prime` method.  
  
The dataloaders are designed so each method call is a class method that will instanciate the class in the request context. This is done effectively as a wrapper around the internal dataloader methods, `load` and `load_many`.
  
This can somewhat help with scalability by reducing the load on backend/database services.