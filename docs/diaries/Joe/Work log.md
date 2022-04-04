## Work log

### 18th-22nd October 2021

This week was spent familiarising ourselves with the technologies that we were aiming to use (Python: Django, GraphQL; JS/TS: React; Docker). When were were happy with this we moved onto restructing the frontend using ReactJS. Time was also spent updating and improving the Docker container configuration. As I was familiar with Bootstrap (CSS framework) I took time to style some of the elements we developed.

### 25th-29th October 2021

This week I worked on GraphQL and investigated how other projects had implemented it. I made a start on a new backend using Django to replace the old backend (Django too, but we felt it would be easier to start afresh). This involved creating a new GraphQL schema and bringing its implementation up to scratch with what was required for the frontend. I also spent some time correcting the NGINX configuration due to an issue around the use of SSL certificates, as well as correcting the global docker compose configuration (to start frontend and backend services). 

### 1st-5th November 2021

This week we worked to develop data access objects (DAOs). This was done to simplify getting data from the database and from external sources (eventually hospital/trust systems for patient records). This implementation was rolled out for all data models. I worked to create a modular GraphQL design so managing a large implementation would be easier (large projects tend to get messy and become a pain to update). 

### 8th-12th November 2021

This week I continued to develop DAOs for the data models and integrate them with the GraphQL implementation. I developed search functionalities for the relevant GraphQL resolvers.

### 15th-19th November 2021

This week we had an issue with the GraphQL library we had chosen (Graphene) due to its syncronous nature. To use dataloaders (for batching and caching queries) the library should ideally be asyncronous. This week was spent migrating from Graphene to Ariadne - an asyncronous library. This involved updating all resolvers and mutation handlers, creating a new organisation structure, and creating dataloaders. 

### 22nd-26th November 2021

This week I designed the implementation for decision points and redesigned the patient resolvers so all data from a patient can be pulled from one query, whereas before you would have to request test results, decision points, pathways, etc individually. This is done as GraphQL allows a client to request the information it needs unlike a RESTful API. I further developed some dataloaders to allow for searching. 

### 29th November-3rd December 2021

This week we had issues using Django and its syncronous nature. Despite using the recommended resources and features to resolve this issue, database queries did not execute in an expected fashion, which resulted in incorrect data being returned to a client. As a result of this, this week was spent evaluating our other options (modifying Django or migrating to another framwork). After much deliberation we decided to migrate to Starlette, an asyncronous web framework. When we designed each component we chose to ensure that - should the need arise - it is easy for us to migrate it to other frameworks/platforms. This saved us a considerable amount of time when migrating the GraphQL implentation from Django to Starlette. The rest of this week was spent debugging and correcting errors.

### 6th-10th December 2021

This week was spent developing REST APIs for user operations. We decided to put these under REST APIs and not under GraphQL queries/mutations as they are actions that do not require authentication. This includes creating user accounts, logging in and logging out. This week I also developed an authentication mechanism which uses cookies to identify a user (Starlette does not have this inbuilt, unlike Django). The rest of the week was spent learning about agile methods and behaviour driven development and testing (BDD/BDT).

### 13th-17th December 2021

This week was spent doing various different tasks. To begin, we investigated good Python practises for the backend and decided we should implement static type checking where appropriate to help eliminate issues before runtime. This will make the software more reliable and safer. This was followed by diagnosing and fixing issues with the authentication system, implementing it on the remaining backend endpoints, and a catchup with my tutor. Finally, I started to investigate NGINX configurations and how we should best implement it to tie the frontend, backend, and landing page (wordpress) together.

### 20th-23rd December 2021

This week was spent further developing the authentication systems, as well as preparing the software for staging. This primarily involved developing the NGINX configurations and various bug fixes.

### 4th-7th January 2022

This week was spent developing the authorization system as well as continuing with staging configuration. I focused on migrating tests to a new test client and increasing our backend test coverage.

### 10th-14th January 2022

I had meetings with NHSx (now NHS England and Improvement) to discuss our application, and how they can help us with its development. I attended a course on Quality Improvement (identifying issues, developing solutions, etc), and worked on releasing an initial production system while bug fixing issues that arose.

### 17th-21st January 2022

This week we started on the development of a fake trust system. Most trusts have a server called a TIE (trust integration engine), since we don't yet have access to their development environment we've decided the best way to continue is develop our own that mimicks (mocks) the same behaviours as the real TIE. I also had the privelege of observing a multi-disciplinary team meeting (MDT) wherein patient care plans are discussed, and an outpatient lung cancer clinic. These were to help us see how the clinicians interact with the various IT systems, and to help us better understand the problems at hand. This week we also started working in week long sprints - although not proper sprints with a scrum master and daily standup. We effectively devise a list of what we want to be done by the end of the week and review how it worked at the end of the week. 

### 24th-28th January 2022

This week, we were working on developing tests and a mocking framework for the adapter between our software and our fake-TIE (pseudotie hereon in). Development continued on our pseudotie. 

### 31st January-4th February 2022

This week I worked on the pseudotie's test result functionality. I developed a mechanism in which it generates a fake test result for each test request. This is vital in giving clinicians who test this software an idea of how it would look like if it was to be used in an official capacity. I also developed functions for communication between our backend and the pseudotie that allow the pseudotie to notify the backend when a test result has come back (this is very important, one of the key functions of our software as it will allow the system to notify a user when a patient/test result needs reviewing). Towards the end of this week I started to look into how the frontend works in closer details (up until this point I mainly stuck with working on the backend).

### 7th-10th February 2022

I spent some of this week bug fixing and refactoring some of the code I wrote at the start of the placement (I got more proficient and wanted to improve my earlier work). I also further developed some of the GraphQL models, with the aim to bring all of a patient's data onto the patient object (this worked, and will save us loads of time in the long run, and is the whole aim of using GraphQL). I also made adjustments to the frontend UI.

### 14th-18th Feburary 2022

This week was spent tweaking the UI and fixing bugs. On Thursday, I attended a stakeholder's meeting with staff from the trust and south west area to discuss the issues with the current system, as well as our potential solution. This meeting involved cancer patients, oncologists (incl. other specialities like physiotherapists, etc), and the trusts IT executives.

### 21st-24th February 2022

I spent this week working on the backend testing suite, as well as working with the information manager of OUH's clinical haemotology department to develop comprehensive build instructions. 

### 28th Feburary-4th March 2022

This is the first week I've worked solo. The aim of the week is to have a full, comprehensive backend testing suite, all build instructions complete, and the redesign of the frontend using NHS React components. This week was quite difficult and possibly my worst week progress wise, however I was supported by everyone and assured that it's normal to have a week where everything just doesn't go to plan.

### 7th-11th March 2022

We spent this week completing what didn't get done last week. The frontend refit was a bigger job than I expected.

### 14th-18th March 2022

On Friday we had a conference organised by the SWAG (Somerset, Wiltshire, Avon and Gloucestershire) cancer alliance. We plan to demo the app to people who attend (and let them play with it using demo user accounts). In light of this, this week has been spent fixing little things: some edge cases and UI oddities. It's been a light week, we haven't started anything new, we just corrected the current app. It was a great event, we met a lot of people interested in our work, as well as being able to see other efforts made into digital transformation in the NHS.

### 21st - 25th March 2022

This week I refactored a lot of the backend with flake8 (a linter). This just ensures that the code is easily read by other collaborators. I also worked on patient locking (it ensures that two clinicians can't edit/make requests for the same patient at the same time). This involved me learning Apollo (frontend GraphQL library).

### 28th March - 1st April 2022

This week was a continuation of patient locking. In the grand scheme of things it's a large - and quite important - function to get right, there are just a lot of edge cases and considerations. I also worked to ensure that the pseudotie persistently stores test result return times, meaning that we could run a small scale simulation wherein test results are returning in hours or days, as opposed to just a few minutes. 
