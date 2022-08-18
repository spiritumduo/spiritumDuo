# Trust adapter

## Trust Integration Engine

A TIE (trust integration engine) is a software that the majority of trusts use as a hub for all clinical softwares and platforms. All clinical systems should connect to the TIE to provide a single interface for other clinical systems to interoperate.

## Overview

The trust adapter is an [adapter design](https://refactoring.guru/design-patterns/adapter) that interfaces Spiritum Duo's backend and any prospective trust's backend systems. In this project, the trust adapter is interfacing SD and pseudotie (fake/mock TIE).  
  
The trust adaper provides SD with the same set of functions (loading patients + test results, requesting test results, etc) and parses the inputs in a way that a TIE could handle them, returning the resulting data in a way that SD can parse.  
  
The benefits of using this design is that SD's backend and frontend can stay the same, even in multiple installations. The only layer that must be altered is the trust adapter, making the deployment into different trusts more straight forward. This design also means that the backend isn't tightly coupled to a speciifc trust's TIE software.

## Dependancy injection

The trust adapter is a dependency injection design pattern. It's a way to inject dependencies into the trust adapter. This is useful for testing, as it allows us to mock the trust adapter and test the backend without having to install a TIE. Bearing this in mind, in resolvers where we need to inject dependencies, we use the `inject` function.

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
