# Ariadne implementation

### Data type definitions (patient, decisionpoint, etc)
- Create data type definition
- Save in `gql/types`
- Add import to `gql/types/__init__.py`

### Queries (getPatient, etc)
- Create query definition
- Save in `gql/query`
- Add import to `gql/query/__init__.py`

### Mutations (createPatient, etc)
- Create mutation definition
- Save in `gql/mutation`
- Add import to `gql/mutation/__init__.py`

### Scalars (Date/DateTime, etc)
- Add definition in `gql/scalars.py`
- Add serialize function 
- Add to `type_list`