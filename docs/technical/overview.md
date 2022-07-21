# Digital Architecture 

## TL;DR 

The frontend is built in typescript as a single page application (SPA) and progressive web application (PWA). The frontend uses React, NHS React components, Apollo GraphQL and redux. A graphQL protocol is used to communicate with the backend. The backend is written in python and runs in Docker. The backend uses Starlette, Ariadne,  aiodataloaders, Gino and PostgreSQL. The Spiritum Duo app is decoupled from the trust’s backend via a ‘trust adaptor”. Requesting functionality is handled by the trust’s backend, usually a trust integration engine (TIE). 

## Don’t like text 

Here is a video describing the digital architecture, correct as of the 14th April 2022: Spiritum Duo - Clinical pathways, A to B but faster! 

<a href="https://youtu.be/5Fc-v3EE2Ws">NHS PyCom Webinar recording</a>

## Introduction 

Spiritum Duo is a new digital healthcare app, designed to speed up patient clinical pathways, improve staff workflows and reduce staff workloads. It has been built as a single page application (SPA) with progressive web app (PWA) features. The frontend communicates with the backend via graphQL. The backend is housed in separate Docker containers. An NGINX web server is used along with an Uvicorn ASGI webserver implementation for python. The Spiritum Duo backend is separated from the trust’s backend via a trust adaptor. The trust adaptor is unique to the trust and allows the Spiritum Duo frontend and backend to be decoupled from the inner workings of the trust it is operating within. This is to allow Spiritum Duo to be more modular. Spiritum Duo is built in an open source model, and all code is shared on GitHub (https://github.com/spiritumduo/spiritumDuo). 

![alt text](/_images/digitalArchitectureOverview.png "Overview diagram")

## Frontend 

The frontend is a single page application (https://en.wikipedia.org/wiki/Single-page_application) with progressive web application (https://web.dev/progressive-web-apps/) features. It is coded in typescript (https://www.typescriptlang.org/). By using typescript, typing (enforcing of variable types, eg integers, strings, decimals, Booleans) is ensured. Typescript is eventually transpiled into the final javascript app. The React library (https://reactjs.org/) is also used. The styling mirrors that of Government Digital Services (GDS) and NHS websites by using the NHS React Components library (https://github.com/NHSDigital/nhsuk-react-components). Creation and visualisation of frontend components was done by using Storybooks (https://storybook.js.org/). Redux (https://redux.js.org/) is used to manage some elements of state (variables) and Apollo GraphgQL is used to manage state and the graphQL protocol to the backend. 

## Communication protocol 

GraphQL (https://graphql.org/) is used to connect the frontend and backend of Spiritum Duo as this has a reduced waterfall API call. 

## Docker 

All of the backend side of Spiritum Duo is run within Docker containers (www.Docker.com). This makes it easier to start up instances of the web app by having tighter control of dependencies (what version of libraries are used). 

## Webserver 

The internet facing webserver is NGINX (https://www.nginx.com/). HTTPS (port 443) encryption certification is provided by LetsEncrypt (https://letsencrypt.org/). Following this a Uvicorn ASGI webserver (https://www.uvicorn.org/) communicates directly with the python-based backend of Spirtium Duo. Uvicorn serves the backend on HTTP port 80. 

## Spiritum Duo Backend 

The backend of Spiritum Duo is programmed in python with typing hints to help with typing. Testing before pushing to the Github repo (repository) is undertaken to check that typing is enforced (I think it will be anyway). Unfortunately, python does not naturally support typing, and so we have used the method above to enforce it. A Starlette ASGI framework is used for asynchonous web services (https://www.starlette.io/). This supports websockets. The Ariadne schema-first GraphQL server implementation (https://ariadnegraphql.org/) is used to create GraphQL schemas that communicate with the Spiritum Duo frontend. 

## Data storage 

For data that is not patient specific (pathway mapping, login credentials, etc) data is stored in a PostgreSQL database (https://www.postgresql.org/). The Gino python library (https://python-gino.org/) is used to communicate with PostgreSQL. 

## Trust adaptor 

To build Spiritum Duo so that it is modular, it was decided to make it agnostic to the underlying workings of the trust’s backend. To do this, a trust adaptor is used. This decouples Spiritum Duo and the trust’s backend, and is unique to each trust that Spiritum Duo is used at. The trust adaptor needs to be built for each trust. The adaptor ‘informs’ Spiritum Duo what data and what kind of requests (investigations, treatments, referrals, etc) are available from the trust. Whenever data is changed or requests made, Spiritum Duo sends these to the trust adaptor, which then in turn communicates with the trust backend. 

## Trust backend 

Most trusts use a trust integration engine (TIE). The TIE is basically a switch board, allowing different clinical systems to communicate with each other. Of course, different trusts have different types of TIES, use different types of communication protocols and also have different requests available. For this reason ‘plug and play’ is a difficult for any digital clinical system and so the trust adaptor helps to overcome this. 

## PseudoTIE 

To prove our API gateway concept, we use a simple FastAPI application server we call our ‘PseudoTIE’. This keeps us honest during development, and ensures we’re not developing an application silo that isn’t able to integrate with other systems.  

## Testing 

Unit testing is undertaken and these are tested within Github whenever code is pushed to the main repo. Both frontend and backend testing are performed. We use the React Testing Library (https://testing-library.com/docs/react-testing-library/intro/) for the frontend. We use ARIA (https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) selectors to ensure usability with assistive technologies. 

We use a python testing library, Pytest (https://pytest.org), for our backend services. This tests our backend GraphQL and REST endpoints. 

We intend to use Selenium soon to undertake browser based full app testing (https://www.selenium.dev/).	 

 