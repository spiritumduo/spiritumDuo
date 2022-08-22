# Trust adapter

## Trust Integration Engine

A TIE (trust integration engine) is software that the majority of trusts use as a hub/central point for all clinical softwares and platforms. All clinical systems should connect to the TIE to provide a single interface for other clinical systems to interoperate.

## Overview

The trust adapter is an [adapter design](https://refactoring.guru/design-patterns/adapter) that interfaces Spiritum Duo's backend and any prospective trust's backend systems. In this project, the trust adapter is interfacing SD and pseudotie (fake/mock TIE).  
  
The trust adapter provides SD with the same set of functions (loading patients + test results, requesting test results, etc) and parses the inputs in a way that a TIE could handle them, returning the resulting data in a way that SD can parse.  
  
The benefits of using this design is that SD's backend and frontend can stay the same, even in multiple installations. The only layer that must be altered is the trust adapter, making the deployment into different trusts more straight forward. This design also means that the backend isn't tightly coupled to a specific trust's TIE software.
