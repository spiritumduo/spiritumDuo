# Placement Diary

# Initial Meetup - 14/10

Initial meeting with Joe and Mark. Mark gave us a presentation of the Spiritum Duo project, and explained to us the challenges he faced using the current IT solutions. He showed us the automation system he had developed, demonstrating that SD is possible, and expressed his hope we could develop it into a full system.

# Week 1 - w/c 18/10

This week we commenced work on the front end. None of us had experience developing a single page application using React, so I took it upon myself to develop a workflow. I discovered component building and testing tool called Storybook, which would allow us to develop, preview, and test components in isolation. So, we spent this week developing components and assembling them into pages.

This week Joe and I were able to develop initial versions of the login, home, decision point, and patient, pages. None of these pages are functional as we have to build client state, however we were able to demonstrate the functionality by using Storybook to preview all the desired states for the pages and components.

# Week 2 - w/c 25/10

Joe had expressed a desire to start working on the backend, so we agreed to split this week. He commenced work on the Django application server, while I investigated how we were going to deal with client state.

Initially, I investigated Redux. This is a popular state library for React applications developed by Facebook. However, the more I learned about it the less confident I felt it was a good fit for our application.

Redux works by binding components to the global redux store. It has a system for allowing React component classes to connect to the store, and a system of hooks to allow function components to hook into the store and interact with the state via side effects. This introduces significant complexity, as this style of developing can lead to disparate components all interacting with the same state in unpredictable ways. This is mitigated by React's rewind and time-travel debugging features, allowing developers to see exactly how the application ended up in a particular state when a defect is identified.

![[https://redux.js.org/faq/general#when-should-i-use-redux](https://redux.js.org/faq/general#when-should-i-use-redux)](nives-images/Untitled.png)

[https://redux.js.org/faq/general#when-should-i-use-redux](https://redux.js.org/faq/general#when-should-i-use-redux)

I identified two pieces of global state on the frontend - the selection of disease pathways, and the currently logged in user. Neither of these states are updated frequently. So, I decided on a different approach.

We had already decided to use a GraphQL API, and so had identified Apollo GraphQL as a potential client library to use. Apollo has a system of reactive variables that can be used for global state, however because they are stored in memory they are lost when the user refreshes the page. So, I decorated the reactive variables to use local storage persistence so they would survive a refresh. 

With that implemented, we now have functional client state that will detect if a user is logged in - however we still lack communication with the server!

# Week 3 - w/c 01/11

I started this week by helping Joe on the backend. He had implemented many resolvers for the GraphQL API, however these were tightly coupled to the Graphene GraphQL system. As a requirement for our system is that the data could come from many sources, it is necessary for us to have a data access layer that can return data from either our database or a hospital trust data source.

So, we settled on a design of what a suitable DAO should look like in our system. We also decided on a clearer project structure for the backend that would split data access and GraphQL resolvers into separate files.

# Week 4 - w/c 08/11

During this week, I worked on wiring up Apollo using React hooks. The design for the front end is that pages are composed of stateless React components, so the top-level page component is responsible for the GraphQL query and injecting data into components. 

By this point, login was working via GraphQL. So, I set about building a login page and then the home page. The login page functions simply by submitting the login form parameters as variables to a GraphQL mutation. It then saves the currently logged in user and the available pathways, and redirects to the home page.

The home page is based on a mockup provided by Mark. It is a list of patients awaiting triage and clinic decisions. These lists can be paginated. To implement this we use the Relay cursor specification.

However, during the work to implement this it became apparent that our data-access layer was not as flexible as we would like. Already we had started writing methods that did not neatly map onto resolvers, and there was also a bigger problem in that the way we had implemented them meant it would be hard for us to prevent over-fetching - the so-called 'N+1' problem.

The 'N+1' problem is a serious problem with GraphQL. Because clients can execute arbitrary queries against a schema, it's possible for them to request the same object multiple times nested within other objects. For example, in our schema a patient can be on many pathways; each pathway instance can have many decisions associated with it; each decision has a clinician; each clinician has decisions; those decisions have patients. While that is a contrived example and none of our frontend views currently require such complex queries, it would be remiss to implement our GraphQL system without considering this problem. So, I set about considering how to solve this problem.

It turned out that this problem was already solved by Facebook when they first implemented GraphQL. They have a system called Loader that batches and deduplicates data-loading per-request, and have released an open-source reference implementation called DataLoader. The current Python port of this is a project called aiodataloader. However, it is not possible to use this in combination  with the Graphene-Django library that we were using to use Graphene and Django together due to a technical limitation. Specifically, the Django ORM does not support asynchronous operation but provides a `sync_to_async` wrapper to allow it to be used in asynchronous contexts. Graphene-Django currently has issues with this mode of operation though, meaning it is incompatible with the use of aiodataloader. This would presumably not be an issue for many purely Django based projects as they could just not use DataLoader - the Django ORM will handily cache objects in the background to stop the database being hit with duplicate requests - but our system requires combining data from a local store and the hospital trust. So, DataLoader is required.

# Week 5 - w/c 15/11

Because of the issues integrating Django with Graphene, we decided to switch to an alternative library - Ariadne. This library is based on GraphQL-core, so it has exactly the same query parser as Graphene. However, we found it to be much easier to use than Graphene, particularly because it is schema-first. This means we can define our GraphQL schema using a schema-definition language, import it into Ariadne, and then be sure that the schema we are executing against is exactly what we have defined.

I then spent the rest of this week finishing off home page pagination and researching how exactly we would implement testing for the frontend.

# Week 6 - w/c 22/11

This week was mostly spent looking into testing solutions for the frontend, and considering how we would lay our routes out.

As we are developing a client-side single page application, this means we have to handle routing on the client side. We were already using react-router for this purpose. I noticed that a new version of react-router had been released so I eagerly upgraded to it, as it provided new syntax for defining nested routes. However, I quickly reverted it as it turned out to be a big breaking change. So, we shall stay on version 5 for the time being!

For testing, I identified react-testing-library as the most promising solution. This is because it is a very straightforward, lightweight, behaviour driven testing library. It works by running tests against actual DOM nodes, and the primary way of selecting nodes is by through queries on labels, text strings, or accessibility roles. So for example, we can instantiate a page containing a form and then assert that each input exists by querying for it based on the textarea role. This not only confirms the form has rendered correctly, but that it is also accessible.

# Week 7 - w/c 29/11

This week presented us with another new problem. We were building automated tests on the backend, and we had noticed that our login mutation was failing. This was surprising considered it appeared to be working fine during manual testing.

I investigated, and found the error was due to the user profile table not being able to find the record of the user inserted during the test. This was unexpected, and the only reason I could think that this might be occurring was that for some reason the user profile read was happening outside of the transaction that inserts the user in the test runner. This would be a serious issue, and also should never occur due to the fact that we were using the Django `sync_to_async` adapter to ensure that all our database requests happen on the same thread.

Unfortunately, I found that it was indeed the case. The thread safety guarantee of `sync_to_async` is broken when it is called from a nested task. In our system, we use nested asynchronous resolvers for our GraphQL which means `sync_to_async` cannot reliably find the parent thread. This is a known issue in the Django ASGIref library, however they do not consider it to be high priority and so has persisted for over a year.

This made us seriously reconsider whether Django is a good fit for our project. The only functionality we use from Django is its database ORM and user authentication. This is the second time that the synchronous nature of the ORM has caused us a serious problem. We made the choice that we should switch away from Django and instead use a lightweight async framework in combination with an async database adapter, and so we switched to using Starlette and GINO. The work to move our code over only took a couple of days, and it solved our problems - we now have an async connection pool that we can place in our resolvers' context, and there is no issue with database access.

# Week 8 - w/c 06/12

This week started with mandatory training! Monday morning was entirely taken up by our Trust induction and followed up by e-learning modules on topics such as health & safety, DSE, sharps, and safeguarding. While some of these topics might not be directly applicable to the work I am doing, it is helpful to me to understand the context in which I am working. Also, from a Trust perspective, I understand how important it is for every member of staff to have awareness of these issues. 

Testing was expanded on the frontend with the user-events library to simulate user input so we could test input into the Decision Point form.

# Week 9 - w/c 13/12

### Added React Context for Auth & Pathway

A problem with passing data around in React applications is how to transfer information down deeply nested component trees. If a child needs something like the currently logged in user, it can be cumbersome to have to pass it down through components using component props. To solve this problem, React has a context API.

We use the hook based version of the React context API. We have two contexts - the `AuthContext` and `PathwayContext`, and from these we wrap our application in the `AuthContext.Provider` and `PathwayContex.Provider` components. This allows us to retrieve information about the current user and selected pathway from any part of our application, while still retaining the convenience of only having to update it in a central location.

# Week 10 - w/c 20/12

### Initial Milestone models & queries

Now that we have a fake trust backend, we can make fake requests such as X-Rays and have them come back with fake results. So, initial work was done to create the database models required for that.

In the initial version each request just has a type identifier, the patient it is for, the clinician that requested it, and metadata relating to when it was created. In a real system it would be possible to add further type specific metadata for specific kinds of requests, e.g. certain investigations might need to know if a patient has diabetes or high blood pressure and these facts could be indicated.

# Week 11 & 12 - Xmas / NY

Most of the time between Christmas and New Year was taken up with tidying up and bugfixes. On our return, the main things implemented were a new development nginx configuration and updates to backend tests.

For nginx, our new configuration meant we were finally running nginx locally as a reverse proxy in a similar manner to how it was configured on our production server. This allows us to validate our configuration during development, and spot issues sooner.

For our backend automated tests, we started using Hamcrest matchers to give us more expressive assertions compared to the inbuilt Python `assert`. This allows us to clearly see the expected values when a test fails.

I also implemented automated test database fixtures on the backend. Previously the automated tests were just interacting with the dev database, so the tests weren’t idempotent - they could succeed or fail depending on the state of the dev database. Now the test runner creates a new DB based for each run, ensuring the automated tests will run reliably.

# Week 13 - w/c 10/01

### Met NHSx!

This week we were fortunate enough to gain the support of some new colleagues from NHSx (now NHS Digital). These were Rob who is a senior developer, Stephen who is a delivery manager, and Grant who is a UX designer. They gave us some great practical advice and assisted us in setting up a Jira, so going forward we would have clearer structure in terms of how we deliver our work.

### Created initial version of `manage.py`

Up until now we didn’t have a consistent way to add fake data to the system. So, I added a script to insert fake patients with milestone requests.

# Week 14 - w/c 17/01

### First sprint!

- Change homepage to reflect moqup

### Went to clinic & MDT

We attended a weekly lung MDT meeting and also attended a clinic with a local lung specialist. Here we were able to observe the clinical setting in which we are hoping to make improvements, giving us an understanding of how the clinicians interact with the current systems and why they want a new system to streamline those interactions.

### Initial pseudotie

This week we also started on the pseudo-TIE. This is a fake trust backend that is implemented as a simple FastAPI server to give our system fake data. This approach keeps us honest; if during this stage of development we ensure that information such as patient data is not stored within our system boundary then it means our system is not likely to become yet another silo of information.

# Week 15 - w/c 24/01

This week I worked on improving the Decision Point page. We added confirmation dialogues so that clinicians can see what requests they are making before submission. I also made the request checkboxes dynamic. This means the checkboxes will appear on the page based on the existence of types of requests present in the system, rather than being hardcoded into the page.

On the backend, we had issues with testability due to the fact that the adapter class to interface our system with the trust backend was hardcoded. This meant that testing in isolation was impossible as it required a running pseudotie service for tests to succeed, and tests could succeed or fail depending on the state of that service. I replaced this implementation and instead used a dependancy injection container so we can inject a mock trust adapter class into the backend when running tests.

# Week 16 - w/c 31/01

This week I added the outcome of previous requests to the decision page so all the information required to make a decision is visible. The results are collapsable so that they don’t take up too much space on the page

# Week 17 - w/c 7/02

This week I did further refinement of the Decision Point page. We now highlight new test results, and submitting a further decision will mark those new results as having been seen.

# Week 18 - w/c 14/02

This week was spent on bugfixing and polishing in preparation for a public discussion of the digital lung cancer pathway. In the end, we weren’t able to fully present the current state of the project during the meeting, but we were able to solicit some feedback 

# Week 19 - w/c 21/02

## Websockets / notifications

We had a requirement to be able to display real-time notifications to users, so this requires a websocket connection. So, I learned about and then implemented websockets on the backend.

## Mid-placement conference thurs

I attended a mid-placement conference at Uni to discuss my placement with other students.

# Week 21 - w/c 7/03

## Fix frontend tests

We had lots of warnings on our frontend tests, so I tidied them up to remove the warnings.

## Tidy up modal patient view in new UI design

We changed our UI to make it look and feel like an NHS app, but this left some outstanding issues. So, I tidied these up and made it look more like the designs and cleaned up how we navigate between components.

# Week 22 - w/c 14/03

### Lets Talk Digital

This week the focus was on polishing our prototype some more and creating a poster presentation for the Lets Talk Digital conference held at the UoG Park campus on the Friday of this week. At this conference we were able to meet more potential users of the system and we received generally positive feedback. Two notable items of feedback we received were that it would be good to see the state of ongoing requests and be able to cancel them, which could happen if the results of an investigation came back and indicated that another request would no longer be required.

# Week 23 - w/c 21/03

### CI/CD

I built a CI/CD pipeline using Github Actions. This set of actions runs our testing and build scripts on Github servers, and if successful it will push the container images to Docker hub and deploy them on our staging server.

### Locking

Joe did work on the locking backend, and we collaborated on the frontend. Specifically there were issues around how to implement the locking inside the `DecisionPoint` React component.

# Week 24 - w/c 28/03

### Finish locking frontend

Work on the locking frontend continued. The final implementation ended up with the lock in the parent `ModalPatient` component so that the lock could be retained during the decision confirmation dialogues.

### Frontend tests

Work was done to clean up frontend tests to remove warnings. I also refactored the tabs on `ModalPatient` to use Redux so that child components could dispatch state updates rather than perform state updates while rendering and generate React warnings.

# Week 25 - w/c 04/04

### WS auth

Up until now, we haven’t haven’t had authentication on our websocket connection. This is because a WS connection is long-lived, so we can’t do per-request authorisation like with a HTTP request. So, I added authorisation to the WS connection. 

# Week 26 - w/c 11/04

### Frontend a11y - specifically patient list

We didn’t have an accessible solution for our patient lists. To navigate to patients we just had a click handler on the table row, so many assistive technologies would not be able to navigate or click through to individual patients. To solve this, I placed a hidden button on the patient name so that assistive technologies would know that it’s possible to click through.

### Initial backend roles

Initial data models for `Role` and `UserRole`

# Week 27 - w/c 18/04

### Permissions system for backend

Added operation permissions, e.g. `DECISION_POINT_CREATE`, to each GQL/REST endpoint.

### Refactor `needsAuthorisation`

The previous decorator didn’t actually work with our FastAPI endpoints, so that was rectified.

### Associate permissions w/roles

The created permissions were associated with roles, which could be associated with users via `UserRole`.

### Initial patient search

As we cannot depend on any particular search implementation, this just assumes the existence of a search provider in the hospital trust and passes the query string along to that.

# Week 28 - w/c 25/04

### User management

We now have user management functionality on the frontend on the administration pages.

### Update user, add roles

Along with the user management, we can now add roles to users too - enabling us to use the previously added permissions functionality on the backend.

# Week 29 - w/c 02/05

### Multi-select - creating reusable component

We decided that we should try and create a re-usable multi-select component, so I started on the implementation and design of that.

# Week 30 - w/c 09/05

## Search filter all patients page

When searching for patients, we decided that we wanted input in the search box to switch to and then filter the all patients page. So, I implemented that and it behaved as expected.

## Finish multi-select

I finished the multi-select component from last week. Unfortunately it didn’t live up to expectations, and it seemed like supporting it could be challenging. So, we decided to abandon our development on this and instead investigate how easy it would be to style another multi-select component to our liking.

# Week 31 - w/c 16/05

## Update frontend dependancies

We hadn’t updated our frontend dependancies in a while, so that needed doing. A main blocker was that updating webpack seemed to break our build. This was isolated to a particular SVG animation we were using. The previous method of simply importing it as an object was failing, so instead we had to import it via the more standard React import path and then include the transpiled animation JavaScript as a side-effect in a wrapper React component.

# Week 32 - w/c 23/05

## Tour of notes

We visited the hospitals notes department. This is an archive of all patient records stored at the hospital. This helped us understand how patient information is currently distributed around the hospital.

# Week 33 - w/c 30/05

## Start on GRP

This week was the platinum jubilee, and I also had the Monday off. I started investigating solutions for the Graphical Representation Pathway.

# Week 34 - w/c 06/06

## GRP Initial demo

I investigated visualisations solutions for React and decided to use visx. This is a visualisation framework developed by Airbnb. It allows us to use visualisation primitives without being tied into a particular implementation of a visualisation. We want the GRP to look kind of like a horizontal stacked bar chart, so we use the visx `BarStackHorizontal` component which allows us to customise it to our requirements

# Week 35 - w/c 13/06

## Single patient GRP finished

We initially wanted the graphical representation to be visible on top of our `ModalPatient` component. So, this implementation was finished. This means that the GRP is now visible whenever viewing patient details or making decisions.

# Week 36 - w/c 20/06

## Multi-patient GRP

The full concept for the GRP is for a list of patients, so the user can easily see how far along each patient is for their pathway. This will permit the user to clearly see any patients experiencing delays. So, I carried on with the GRP and implementing it on our todo & all patient pages. 

# Week 37 - w/c 27/06

## Multi-patient GRP finished

The GRP is finished! The main challenge was making it responsive. As the design looks like a stacked bar chart, it is not readable on narrow screens such as small smartphones. So, we had to deal with how it should be presented on smaller screens. We settled on making it just show the current state of the patient, e.g. awaiting a decision, or waiting for a test result to come back.

Also, testing was somewhat problematic due to the fact that SVGs aren’t accessible, and our testing methodology is centred around accessibility and using ARIA roles as selectors in our tests. For the GRP, we decided to have a visually hidden table presenting the same information that screenreaders would be able to access - this means we can test based on that - and capture a snapshot of the GRP SVG for our test runner. This means we can visually confirm the GRP looks correct in all its desired states, and then automatically confirm in future tests that its appearance has not changed.