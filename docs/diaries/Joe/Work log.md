# Work log

## 18th - 22nd October 2021

This week was spent familiarising ourselves with the technologies that we were aiming to use (Python: Django; GraphQL; JS/TS: React; Docker). When were were happy with this we moved onto restructing the frontend using ReactJS. Time was also spent updating and improving the Docker container configuration. As I was familiar with Bootstrap (CSS framework) I took time to style some of the elements we developed.

## 25th - 29th October 2021

This week I worked on GraphQL and investigated how other projects had implemented it. I made a start on a new backend using Django to replace the old backend (Django too, but we felt it would be easier to start afresh). This involved creating a new GraphQL schema and bringing its implementation up to scratch with what was required for the frontend. I also spent some time correcting the NGINX configuration due to an issue around the use of SSL certificates, as well as correcting the global docker compose configuration (to start frontend and backend services).

## 1st - 5th November 2021

This week we worked to develop data access objects (DAOs). This was done to simplify getting data from the database and from external sources (eventually hospital/trust systems for patient records). This implementation was rolled out for all data models. I worked to create a modular GraphQL design so managing a large implementation would be easier (large projects tend to get messy and become a pain to update).

## 8th - 12th November 2021

This week I continued to develop DAOs for the data models and integrate them with the GraphQL implementation. I developed search functionalities for the relevant GraphQL resolvers.

## 15th - 19th November 2021

This week we had an issue with the GraphQL library we had chosen (Graphene) due to its syncronous nature. To use dataloaders (for batching and caching queries) the library should ideally be asyncronous. This week was spent migrating from Graphene to Ariadne - an asyncronous library. This involved updating all resolvers and mutation handlers, creating a new organisation structure, and creating dataloaders.

## 22nd - 26th November 2021

This week I designed the implementation for decision points and redesigned the patient resolvers so all data from a patient can be pulled from one query, whereas before you would have to request test results, decision points, pathways, etc individually. This is done as GraphQL allows a client to request the information it needs unlike a RESTful API. I further developed some dataloaders to allow for searching.

## 29th November - 3rd December 2021

This week we had issues using Django and its syncronous nature. Despite using the recommended resources and features to resolve this issue, database queries did not execute in an expected fashion, which resulted in incorrect data being returned to a client. As a result of this, this week was spent evaluating our other options (modifying Django or migrating to another framwork). After much deliberation we decided to migrate to Starlette, an asyncronous web framework. When we designed each component we chose to ensure that - should the need arise - it is easy for us to migrate it to other frameworks/platforms. This saved us a considerable amount of time when migrating the GraphQL implentation from Django to Starlette. The rest of this week was spent debugging and correcting errors.

## 6th - 10th December 2021

This week was spent developing REST APIs for user operations. We decided to put these under REST APIs and not under GraphQL queries/mutations as they are actions that do not require authentication. This includes creating user accounts, logging in and logging out. This week I also developed an authentication mechanism which uses cookies to identify a user (Starlette does not have this inbuilt, unlike Django). The rest of the week was spent learning about agile methods and behaviour driven development and testing (BDD/BDT).

## 13th - 17th December 2021

This week was spent doing various different tasks. To begin, we investigated good Python practises for the backend and decided we should implement static type checking where appropriate to help eliminate issues before runtime. This will make the software more reliable and safer. This was followed by diagnosing and fixing issues with the authentication system, implementing it on the remaining backend endpoints, and a catchup with my tutor. Finally, I started to investigate NGINX configurations and how we should best implement it to tie the frontend, backend, and landing page (wordpress) together.

## 20th - 23rd December 2021

This week was spent further developing the authentication systems, as well as preparing the software for staging. This primarily involved developing the NGINX configurations and various bug fixes.

## 4th - 7th January 2022

This week was spent developing the authorization system as well as continuing with staging configuration. I focused on migrating tests to a new test client and increasing our backend test coverage.

## 10th - 14th January 2022

I had meetings with NHSx (now NHS England and Improvement) to discuss our application, and how they can help us with its development. I attended a course on Quality Improvement (identifying issues, developing solutions, etc), and worked on releasing an initial production system while bug fixing issues that arose.

## 17th - 21st January 2022

This week we started on the development of a fake trust system. Most trusts have a server called a TIE (trust integration engine), since we don't yet have access to their development environment we've decided the best way to continue is develop our own that mimicks (mocks) the same behaviours as the real TIE. I also had the privelege of observing a multi - disciplinary team meeting (MDT) wherein patient care plans are discussed, and an outpatient lung cancer clinic. These were to help us see how the clinicians interact with the various IT systems, and to help us better understand the problems at hand. This week we also started working in week long sprints - although not proper sprints with a scrum master and daily standup. We effectively devise a list of what we want to be done by the end of the week and review how it worked at the end of the week.

## 24th - 28th January 2022

This week, we were working on developing tests and a mocking framework for the adapter between our software and our fake - TIE (pseudotie hereon in). Development continued on our pseudotie.

## 31st January - 4th February 2022

This week I worked on the pseudotie's test result functionality. I developed a mechanism in which it generates a fake test result for each test request. This is vital in giving clinicians who test this software an idea of how it would look like if it was to be used in an official capacity. I also developed functions for communication between our backend and the pseudotie that allow the pseudotie to notify the backend when a test result has come back (this is very important, one of the key functions of our software as it will allow the system to notify a user when a patient/test result needs reviewing). Towards the end of this week I started to look into how the frontend works in closer details (up until this point I mainly stuck with working on the backend).

## 7th - 10th February 2022

I spent some of this week bug fixing and refactoring some of the code I wrote at the start of the placement (I got more proficient and wanted to improve my earlier work). I also further developed some of the GraphQL models, with the aim to bring all of a patient's data onto the patient object (this worked, and will save us loads of time in the long run, and is the whole aim of using GraphQL). I also made adjustments to the frontend UI.

## 14th - 18th Feburary 2022

This week was spent tweaking the UI and fixing bugs. On Thursday, I attended a stakeholder's meeting with staff from the trust and south west area to discuss the issues with the current system, as well as our potential solution. This meeting involved cancer patients, oncologists (incl. other specialities like physiotherapists, etc), and the trusts IT executives.

## 21st - 24th February 2022

I spent this week working on the backend testing suite, as well as working with the information manager of OUH's clinical haemotology department to develop comprehensive build instructions.

## 28th Feburary - 4th March 2022

This is the first week I've worked solo. The aim of the week is to have a full, comprehensive backend testing suite, all build instructions complete, and the redesign of the frontend using NHS React components. This week was quite difficult and possibly my worst week progress wise, however I was supported by everyone and assured that it's normal to have a week where everything just doesn't go to plan.

## 7th - 11th March 2022

We spent this week completing what didn't get done last week. The frontend refit was a bigger job than I expected.

## 14th - 18th March 2022

On Friday we had a conference organised by the SWAG (Somerset, Wiltshire, Avon and Gloucestershire) cancer alliance. We plan to demo the app to people who attend (and let them play with it using demo user accounts). In light of this, this week has been spent fixing little things: some edge cases and UI oddities. It's been a light week, we haven't started anything new, we just corrected the current app. It was a great event, we met a lot of people interested in our work, as well as being able to see other efforts made into digital transformation in the NHS.

## 21st - 25th March 2022

This week I refactored a lot of the backend with flake8 (a linter). This just ensures that the code is easily read by other collaborators. I also worked on patient locking (it ensures that two clinicians can't edit/make requests for the same patient at the same time). This involved me learning Apollo (frontend GraphQL library).

## 28th March - 1st April 2022

This week was a continuation of patient locking. In the grand scheme of things it's a large - and quite important - function to get right, there are just a lot of edge cases and considerations. I also worked to ensure that the pseudotie persistently stores test result return times, meaning that we could run a small scale simulation wherein test results are returning in hours or days, as opposed to just a few minutes.

## 4th - 8th April 2022

This week I updated some of the documentation and looked into automated document generation software. After reading comparisons I ended up choosing to use Doxygen for our Python backend, and directing others to the storybook for frontend documentation - this seems to be common practice. I also did some more work on the installation instructions. To finish the week I worked on adding GraphQL subscriptions to the patient list on the home page, making it so it updates whenever the state of a patient changes. This involved me learning about GQL subscriptions and Apollo's implementation of them.

## 11th - 15th April 2022

This week I designed and implemented an administration page for pathway management - creating, updating and deleting pathways without having to manually edit the database.

## 18th - 22nd April 2022

Annual leave

## 25th - 29th April 2022

This week I was working on the administration interface for role management. This involved creating new graphql queries and adapting the frontend as appropriate, as well as creating new RESTful endpoints on the backend.

## 2nd - 6th May 2022

This week was a continuation of the last, working on the administration interface. I had to learn how Jest (frontend React testing library) worked wrt asynchrony and awaiting events. I also diagnosed and corrected an issue wherein our staging server would not upgrade enum definitions on the postgres database. I chose to remove the database volume on the CD workflow to circumvent this. In a production environment, we'll have to edit the migrations manually - to be expected using Alembic.

## 9th - 13th May 2022

This week I was tasked with adding mechanisms to give users access to pathways so they can take part in multiple pathways. This was a much bigger task than I expected. Backend modifications to this was minimal since permissions for this is a separate story (it's a very large task that will involve the development of a DAO layer). Frontend modifications, I had a lot to learn. I learnt about React contexts and how they should be used. This week was a hit to my confidence as I struggled more than I thought I would. I also had to discard some of my initial work on the backend as it was - rightly pointed out - a massive anti - pattern (adding authorization to dataloaders) so I lost about a day's worth of work. A learning experience if nothing else. Wrt the frontend, a large part of my issue stemmed from moving pathways from their own separate object onto the user object. This required large changes to both our user/auth and pathway contexts

I also added the ability to assign a user pathways on the user management tab in administration.

## 16th - 20th May 2022

I spent this week tidying up what we have completed so far. Coming into this placement I had much to learn, and so some of my work to the start had to be updated following proper and more efficient methods. For example, I updated some of our backend tests to use Pytest fixtures correctly. Futhermore, I was able to identify issues in our workflow. For example, the 'manage' scripts were often not updated completly inline with recent changes. Identifying this means I can ensure that these scripts are updated in a timely fashion inline with changes.

## 23rd - 27th May 2022

I spent this week making minor changes to frontend and backend to faciltiate for a patient's sex and to display it alongside the patient's date of birth. I also investigated a few different frontend component libraries to find a suitable multi - select dropdown menu. I tried three and found one that works very well, so I have implemented that and updated all appropriate frontend tests. As this was inline with updates to React 18 I had to find what changed in the testing library to update previous tests I had written before this migration.

## 30th May - 3rd June 2022

Annual leave, bank holidays

## 6th - 10th June 2022

This week I finished hwat I was doing my last working week by implementing the multi - select dropdown menu on the user administration pages. Once this was done I started work on a user feedback feature. Right clicking anywhere on the page will show a context menu where a user can send feedback. This is specifically implemented to avoid showing when right clicking on context elements because of copy and paste API limitations. The new clipboard API is not supported on all browsers, and the old API is deprecated so I chose not to go down this route and show the default controls on input elements (clipboard handled by browser/operating system).

## 13th - 17th June 2022

I spent this week catching up with administrative tasks that have built up over the course of my placement, working on coursework, etc.

## 20th - 24th June 2022

I spent this week working on the MDT functionality of the project. An MDT (multi-disciplinary team meeting) is a meeting wherein clinicians from different specialities discuss patients, appropriate care plans, and results. The aim is to be able to provide MDT management and recording in our project. This is an initial iteration and will largely change by the time we're happy with it. It's quite a big task so I'm happy to be trying to tackle it. I'll likely be taking some of, if not wholly, next week to continue working on this. There are a few implementation issues and technicalities I've had to work out, for example if there *could* be more than one MDT in a day.
