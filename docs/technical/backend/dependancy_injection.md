# Dependancy injection

The [trust adapter](./trust_adapter.md), email adapter, and pubsub mechanism are dependency injection design patterns. This is useful for testing, as it allows us to mock the trust adapter and test the backend without having to install another backend-dependant service.
  
Where functions requre these dependencies, we use the `inject` wrapper and add a reference to the function in `src/containers.py`.

```python
@inject
async def CreateDecisionPoint(
    context: dict = None,
    on_pathway_id: int = None,
    clinician_id: int = None,
    decision_type: DecisionTypes = None,
    clinic_history: str = None,
    comorbidities: str = None,
    clinical_request_resolutions: List[int] = None,
    clinical_request_requests: List[Dict[str, int]] = None,
    mdt: Dict[str, str] = None,
    from_mdt_id: int = None,
    trust_adapter: TrustAdapter = Provide[SDContainer.trust_adapter_service]
) -> DecisionPointPayload:
    pass
```

## Adding a new dependency

To add a new service, it must be added in `containers.py`

```python
    email = email_adapter.EmailAdapter
    email_client = providers.Singleton(email)
    email_service = providers.Factory(
        services.EmailService,
        email_client=email_client
    )
```

To reference the service, we can access it when injected into a function.

```python
async def test_email(
    email_service: EmailAdapter = Provide[SDContainer.email_service]
):
    await email_service.send_email(
        ...
    )
```
