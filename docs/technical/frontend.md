# Frontend Docs

# Introduction

Spiritum Duo is a single page application implemented using the [React](https://reactjs.org/) component system from Facebook. It communications with the backend using a [GraphQL](https://graphql.org/) schema. In order to facilitate this, we use the [Apollo GraphQL](https://www.apollographql.com/) library.  We also use [Storybook](https://storybook.js.org/) to preview and test our components as we build them.

This documentation assumes understanding of TypeScript, software design, and software testing.

# Setup

The frontend development build can be run either in a Docker container or natively on your host system. The container is guaranteed to work however bind mount performance can be very poor on Docker for Windows and macOS. Installing the required version of Node is very straightforward on both macOS and Windows, so this is the recommended option for local development.

Ensure you have renamed the `docker-compose.dev.yml.example` in the root `spiritumDuo` directory to `docker-compose.dev.yml` as this is required in any case to start the rest of the stack. 

### Native

As our frontend is based on [create-react-app](https://create-react-app.dev/), we depend on Node 14+. For macOS/Linux [nvm](https://github.com/nvm-sh/nvm#installation) can be used to ensure the correct version is available, and [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) can be used for Windows. Node is also available via [homebrew](https://brew.sh/) and [MacPorts](https://www.macports.org/) on macOS.

Remove or comment out the sections of your `docker-compose.dev.yml` for `sd-frontend` and `sd-frontend-sb`

```yaml
# ********** FRONTEND SERVICES ********** #
#  sd-frontend:
#    container_name: sd-frontend
#    image: sd-frontend
#    build:
#
# ....
#
#  sd-frontend-sb:
#    container_name: sd-frontend-sb
#    image: sd-frontend-sb
#    build:
```

### Docker

This will bind mount the `frontend` directory into `/src/app` in the container.

The poor bind mount performance can be mitigated in macOS 12.2+ and recent versions of Docker Desktop by ensuring `Enable VirtioFS accelerated directory sharing` is enabled in the `Experimental Features` tab of Docker Desktop options. For Windows, it might be preferable to host the files inside WSL2 if running Docker.

## Yarn

We use [yarn](https://yarnpkg.com/) as our package manager. To install project dependancies, run `yarn install` in either the `frontend` folder or the `sd-frontend` container.

## Running

If you’re using the Docker configuration, then the frontend contains will start with the rest of the system. If you’re running node natively, then run `yarn start` to start the app in development mode with hot reload and `yarn storybook` to start Storybook.

The app will be available via `[http://localhost/app](http://localhost/app)` and Storybook will be available via `[http://localhost:6006](http://localhost:6006/)`.

# React

SD depends on React 18. For guidance on React if it is new to you, refer to the official [getting started](https://reactjs.org/docs/getting-started.html) documentation. If you are new to JavaScript, or returning after a long break, then this [re-introduction to JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) on MDN should be helpful. React also has a very good [tutorial](https://reactjs.org/tutorial/tutorial.html) that is helpful if you are new to the library.

## Component Design Pattern

React supports two approaches to creating components - [functions and classes](https://reactjs.org/docs/components-and-props.html). SD is built entirely from function components. This means that all state and side effects have to be managed with hooks. The official docs on [hooks](https://reactjs.org/docs/hooks-intro.html) provide a good starting point.

We prefer declaring our function components in the arrow style to eliminate any ambiguity around `this`. This is enforced via linter settings.

```tsx
// MyComponent.tsx

import React, { useState } from 'react';

export interface MyComponentProps {
 thing: string;
}

const MyComponent = ({ thing }: MyComponentProps) => {
  const [count, setCount] = useState<number>(0);

  const clickCallback = () => setCount(count + 1);

  return (
    <div>
      <button
        type="button"
        onClick={ clickCallback }
      >
        {thing}
      </button> has been clicked {count} times!
    </div>
  );
};

export default MyComponent;
```

All components should be implemented in this style.

# Storybook

Each component has an associated story file. Storybook has extensive [tutorials](https://storybook.js.org/tutorials/) that are well worth reading.

```tsx
// MyComponent.stories.tsx

import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import MyComponent from './MyComponent';

export default {
	title: 'Components/MyComponent',
	component: MyComponent,
} as ComponentMeta<typeof MyComponent>;

const Template: ComponentStory<typeof MyComponent> = (args) => <MyComponent { ...args } />;

export Default = Template.bind({});
Default.args = {
	thing: 'MyThing',
};
```

This is for the typical case of a component that takes props as arguments. In this situation, all the stories we want to test can be copied from the same template and just rendered with new arguments. Sometimes components might depend on the presence of a parent component existing in the tree, such as a context. These cases can be handled with decorators.

```tsx
export default {
	title: 'Components/MyComponent',
	component: MyComponent,
	decorators: [
		(Story) => (
			<MyContext>
				<Story />
			</MyContext>
		),
	],
} as ComponentMeta<typeof MyComponent>;
```

Stories are functions, and can be written similarly to React components. This means that for more complex cases we can provide bespoke logic for each story.

```tsx
// Login.stories.tsx

/**
 * Default login page - results in successful login
 */
export const Default: Story = () => {
  fetchMock.restore().mock('end:/rest/login/', successfulLoginMock);
  return <LoginPage />;
};
```

## Preview.js

We have some global decorators in `.storybook/preview.js`. These are `Provider` for Redux and `MockConfigProvider` for our application configuration. We also have `apolloClient` configuration in here that enables the use of the Apollo `MockedProvider` as some stories make use of this. However, we are in the process of migrating away from this to our `NewMockSdApolloProvider` which is based on `[mock-apollo-client](https://www.npmjs.com/package/mock-apollo-client)` so all new work should make use of that where possible.

# Testing

Our testing approach is based on a combination of Jest, Storybook, and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) (RTL). We re-use our stories in our Jest tests, and we use RTL to select and interact with elements based on ARIA selectors. This approach ensures we are automatically testing what we see in Storybook and that our components are implemented in an accessible fashion. This should ensure that we are compatible with accessible technology such as screen readers.

## Jest

Each component has an associated spec file. The test runner will traverse the `src` directory recursively and run all spec files.

```tsx
// MyComponent.spec.tsx

import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from './MyComponent.stories';

const { Default } = composeStories(stories);

test('It should render correctly', () => {
	render(<Default />);
	expect(screen.getByText('MyThing has been clicked 0 times!').toBeInTheDocument();
});
```

## React Testing Library

RTL is designed around the concept of interacting with DOM nodes in the same way a user would - e.g. finding an input text box via it’s associated label, the same way a user would. To do this, it’s necessary to use the correct selectors to ensure accessibility is being tested.

```tsx
// MyComponent.spec.tsx

import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, userEvent, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from './MyComponent.stories';

const { Default } = composeStories(stories);

test('Clicking the button should increment the counter', async () => {
	const { click } = userEvent.setup();
	render(<Default />);

	// Bad
	const badSelector = screen.getByText('MyThing');

	// Better
	const betterSelector = screen.getByLabel('MyThing');

	// Best 
	const bestSelector = screen.getByRole('button', { name: 'MyThing' });

	await waitFor(() => click(bestSelector));

	expect(screen.getByText('MyThing has been clicked 1 times!').toBeInTheDocument();
});
```

All three selectors will get the button from `MyComponent`for us to click on, however only `getByRole` will ensure that the element has the correct role and label. RTL provides documentation about the [queries](https://testing-library.com/docs/queries/about) it supports. Particular attention should be paid to [query priority](https://testing-library.com/docs/queries/about#priority) to ensure accessibility is actually being tested.

# Components

We split our components into three types - components, features, and pages. We settled on this approach midway through development, so there are legacy components that don’t neatly fit into this pattern and should be refactored. An example would be `PatientList` and `WrappedPatientList` - this could be refactored into a `PatientList` feature, with a cleaner API for how to wrap it with a provider component to support all the use cases where we display a list of patients.

## Components

Components are components that can be re-used anywhere. For example, we have `LoadingSpinner` that we use throughout the frontend to indicate our loading states.

A component should be placed in its own subdirectory of `/src/components`, e.g. `/src/components/LoadingSpinner/`. It should export from an `index.ts`so that consumers can import directly from that directory:

```tsx
// /src/components/LoadingSpinner/index.ts

import LoadingSpinner from './LoadingSpinner';

// if a component has named exports, consider bulk export, e.g.:
// export * from './LoadingSpinner';

export default LoadingSpinner;
```

```tsx
import 'React' from 'react';
import LoadingSpinner from 'components/LoadingSpinner';

const MyComponent = () => (
	<LoadingSpinner>
		<div>Hi!</div>
	</LoadingSpinner>
);

export default MyComponent;
```

If a component has private child components as part if its implementation, these should be placed in a `components` subdirectory.

## Features

 Features are components that enable application functionality. They can be composed of multiple private components. For example, we have `AdminUser` that contains all the user administration features, with `AdminUser`, `AdminUserCreate` , and `AdminUserUpdate` exported. `DecisionPoint` is our form for creating and submitting decisions, and so all logic and components are in there.

Similarly to our components, features should have private child components in a `components` subdirectory and export from an `index.ts`.

## Pages

Pages are top level container components, e.g. `HomePage` shows `WrappedPatientList`and the tabs to switch between the lists. Pages should never have private child components. If you find you need them, stop. You’re probably making a component or feature, and should break that out of the top level page component.

# Apollo GraphQL

We use [Apollo Client](https://www.apollographql.com/docs/react/) to interact with the backend via GraphQL. The docs are reasonably comprehensive, with the most relevant being the sections on [queries](https://www.apollographql.com/docs/react/data/queries) and [mutations](https://www.apollographql.com/docs/react/data/mutations).

As we use TypeScript, we can provide generic parameters to the `userQuery` and `userMutation` hooks to provide type safety to both the variables we pass in and the returned `data` object.

## Generated Types

Apollo provides a tool to generate the TS type definitions from our GraphQL schema. We need to scrape the schema from the backend. In order to do this, we need a GQL endpoint on our backend that doesn’t require authentication, so temporarily add this to `backend/api.py`:

```python
from gql.graphql import graphql, ws_graphql, _graphql

starlette_routes = [
    Route("/graphql", endpoint=graphql, methods=["POST", "GET"]),
    WebSocketRoute("/subscription", endpoint=ws_graphql()),
		Route("/gql", endpoint=_graphql, methods=["POST", "GET"]), # ADD THIS
]
```

Next we require a Node 14 environment. The most convenient way to get this is to run a Node 14 container:

```bash
docker run --rm -it -v "${PWD}:/app" node:14-slim bash
```

Inside the node container, change to `/app/src` and run these commands:

```bash
npx apollo service:download --endpoint=http://host.docker.internal:8080/gql graphql-schema.json
npx apollo codegen:generate --localSchemaFile=graphql-schema.json --target=typescript --tagName=gql
```

This will generate type definitions for all queries and mutations, and report any errors caused by mismatches between the queries in the frontend and the schema returned from the backend. They will be placed in `__generated__` subdirectories alongside the files in which the queries are located.

We can then simply use these types as follows:

```tsx
// Example query
import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { MyQuery, MyQueryVariables } from './__generated__/MyQuery';

const MY_QUERY = gql`
	query MyQuery(thingId: ID!) {
		getThing(thingId: $thingId) {
			id
			name
		}
	}
`;

const DoQuery = ({ id }: MyQueryVariables) => {
	const { loading, error, data } = useQuery<MyQuery, MyQueryVariables>(
		MY_QUERY,
		{ variables: { id: id } }
	);

	return (
		<div>
			Loading: { loading } <br />
			Error: { error?.message } <br />
			Data: ID: { data?.id }, Name: { data?.name } <br />
		</div>
	);
};
```

```tsx
// Example mutation
import React, { useEffect } from 'react';

import { gql, useMutation } from '@apollo/client';
import { MyMutation, MyMutationVariables } from './__generated__/MyMutation';

const MY_MUTATION = gql`
	mutation MyMutation(input: MyMutationInput) {
		updateThing(input: $input) {
			id
			name
		}
	}
`;

const DoMutation = ({ id, name }: MyMutationVariables) => {
	const [ myMutation, { loading, error, data }] = useQuery<MyMutation, MyMutationVariables>(
		MY_MUTATION,
		{ variables: { input: { id: id, name: name } } }
	);
	useEffect(() => myMutation(), [myMutation]);
	return (
		<div>
			Loading: { loading } <br />
			Error: { error?.message } <br />
			Data: ID: { data?.id }, Name: { data?.name } <br />
		</div>
	);
};
```

Use of both generic parameters to the query and mutation hooks provides type checking to both the object provided to `variables` and the returned `data` object.

## Serialisation

GraphQL supports five basic [scalar types](https://graphql.org/learn/schema/#scalar-types). While most objects can be constructed from these types, sometimes it is desirable to support custom scalars. The most obvious candidate is `Date`. However, Apollo does not have native support for custom scalers, so we use `apollo-link-scalars` to (de)serialise scalars at the link level.

The code for this is in `src/app/scalars.ts`. The key thing to note is that this requires a current copy of the schema to be present in `src/app/schema.graphql`. This should be copied directly from the backend source tree. If this is not done custom scalar (de)serialisation will not occur correctly, and this will present as ISO-8601 date strings appearing where you would expect properly constructed `Date` objects.

# Hooks

We have two app-wide custom hooks in our application. A generic REST hook, and a hook that returns a function to format patient identifiers.

## REST

Our REST hook is modelled after the Apollo `useQuery` hook, and allows us to type both the variables supplied and the returned data object. So, we can use it like this:

```tsx
import useRestSubmit from 'app/hooks/rest-submit';
import User from 'types/Users';
import { ConfigInterface } from 'components/ConfigContext';

interface LoginData {
  user?: User;
  config?: ConfigInterface;
  error?: string;
}

interface LoginFormInputs {
  username: string;
  password: string;
}

const [loading, error, data, doLogin] = useRESTSubmit<LoginData, LoginFormInputs>('/api/rest/login/');
```

This gives us type safety and standardised error handling across all uses of our REST endpoints.

## Format Patient Identifier

We have two hooks in `format-identifier.ts` that allow us to consistently display patient identifiers in the correct format. They require `ConfigContext`, but that should be provided at the top level of our component tree and is configured on user login.

```tsx
import React from 'react';
import { useHospitalNumberFormat, useNationalNumberFormat } from 'app/hooks/format-identifier';

/**
* hospital number format: "MRN: @@@@@++"
* national number format: "NHS: @@@-@@@-@+++"
*/

const hospitalNumber1 = '1234567';
const hospitalNumber2 = '12345';

const nationalNumber1 = '1234567890';
const nationalNumber2 = '1234567';

const FormatExample = () => {
	const formatHospitalNumber = useHospitalNumberFormat();
	const formatNationalNumber = useNationalNumberFormat();
	return (
		<div>
			MRN: 1234567      - { formatHospitalNumber(hospitalNumber1) } <br />
			MRN: 12345        - { formatHospitalNumber(hospitalNumber2) } <br />
			NHS: 123-456-7890 - { formatNationalNumber(nationalNumber1) } <br />
			NHS: 123-456-7    - { formatNationalNumber(nationalNumber2) } <br />
		</div>
	)
};
```

# State

We use two approaches to transmit state between components - Context and Redux. As per [the docs](https://reactjs.org/docs/context.html), Context is good for sharing state that can be considered global for a tree of components, whereas Redux is more appropriate for dynamic communication between otherwise unrelated components. Components are free to create their own local context providers.

## Redux

### modalPatient

```tsx
interface ModalPatientState {
    isTabDisabled: boolean;
}
```

This should be refactored into a local context. Its sole use is so that `DecisionPoint` can disable tabs in `ModalPatient`, which is a parent of `DecisionPoint`.

### searchBar

```tsx
interface SearchBarState {
  query?: string;
}
```

This is populated by `SearchBar`, and if this value exists then `AllPatients` will instead show the results of this query.

## Global Context

### AuthContext

```tsx
// /src/app/context.tsx

interface AuthContextInterface {
    user?: User;
    updateUser: (user: User | undefined) => void;
}
```

This is populated by `LoginPage`. It provides the currently logged in user.

### PathwayContext

```tsx
// /src/app/context.tsx

interface PathwayContextInterface {
    currentPathwayId?: string;
    updateCurrentPathwayId: (id: string) => void;
}
```

This is populated by `LoginPage`. It is used anywhere the currently selected pathway is required, e.g. submitting decisions or retrieving lists of patients.

### ConfigContext

```tsx
// /src/components/ConfigContext/ConfigContext.tsx

interface ConfigInterface {
  hospitalNumberFormat: string;
  nationalNumberFormat: string;
}
```

This is populated by `LoginPage`. It is for system configuration. It currently just contains the format strings for rendering patient identifiers.

# Improvements

Here are suggestions /  notes for future improvement. 

## Dependencies

### React 18

We use React 18, however we haven’t moved the project over to the new `createRoot` API. As such, it will still behaves like React 17.

In order to migrate to `createRoot`all dependancies need to be compatible with React 18. The most notable blocking dependancy was `react-beautitful-dnd` which we use for our drag and drop lists, however that now supports v18 as of `v13.1.1`.

So, it would be worthwhile experimenting with `createRoot` to see if anything else is blocking the migration to full React 18.

### Peer Dependencies

We have quite a few Yarn warnings around incorrect peer dependancies, however these are mostly for dev dependancies and don’t actually cause any issues. However it would be good to go over these and see if the warnings can be removed by upgrading dependancies. 

## Separating provider / presentation

Currently our components are built with the queries that provide data written inside them. This means that all tests and stories for our presentational components also have to mock out the GraphQL queries.

So, it might be worth pulling all the provider logic out of components and having all visual components be purely presentational and only take data as props. Then we can have tests of our visual components just provide data, and then test the providers separately with our GQL mocks.

In most cases, a provider will still be coupled to a presentational component. Therefore it would make sense to locate them together and export the combination so consumers don’t have to worry about integrating them.

### Break test mocks out

Currently our test mocks are inside our components `stories` files. This means we end up attaching them to a story to export them when other stories or tests need them - e.g. `Default.paramaters.mocks`. It would be better to have a `mocks` file for components that require them, then all stories and tests can just import from there.

## Remix Router

[Remix](https://remix.run/) is a framework for making modern React applications. We don’t use it, however we do use React Router v6 and it turns out most of the data and async UI management from Remix is [coming to React Router](https://remix.run/blog/remixing-react-router).

This ties into the suggestion above for separating out provider and presentation components. This new design for React Router would allow us to attach data providers to routes with `<Route loader />`, thereby permitting async loading of nested routes. This will greatly improve page load times.

This is still pre-release, however it seems to be something worth keeping an eye on.

## Localisation

Currently, we don’t localise the frontend. All our strings are English, and for dates we just depend on the current browser locale setting.

### Language

For language localisation, we should probably be using [react-i18next](https://react.i18next.com/). This would permit us to store all our localised strings separately from our application, update strings as required, etc. This should be pretty straightforward to integrate.

### Dates

Currently we depend on the browser locale to correctly render dates. However, this causes problems when the browser locale is incorrectly configured. So, this would require two modifications. Firstly, the backend would need to be updated to send the correct locale on login. This could be stored in `ConfigContext`. Secondly, we require a system to ensure that the correct localisation is always used throughout the frontend. For that, [date-fns](https://date-fns.org/) looks to be a promising candidate. It’s based on native JS Date objects. There are alternatives such as [moment.js](https://momentjs.com/), however that is [no longer recommended](https://momentjs.com/docs/#/-project-status/) for new projects.

## DecisionPoint

`DecisionPoint` is quite a large component, and will likely be a focus for future feature work and refactoring. It has already been split into some sub-components, however it could probably be pared down some more into more testable units.

### Generic request type handling

One big feature we’re missing is per-request metadata for request types. For example, an x-ray might want specific information regarding the patient so we would have to show input boxes for that particular request type when it’s selected.

As we use [react-hook-form](https://react-hook-form.com/), we would have to build a new `[fieldArray](https://react-hook-form.com/api/usefieldarray)`for each request type. This would have to be based on per request type metadata being served from the backend, e.g. the x-ray might require a text field, a checkbox, a set of radio options, etc. So, a generic system for building and rendering the required inputs based on that metadata would have to be designed and implemented.

## Polyfills

SD is based on create-react-app, and so supports all modern browsers. If we wish to support older browsers, then [polyfills are required](https://create-react-app.dev/docs/supported-browsers-features/). The most straightforward way to achieve this would be to include [react-app-polyfill](https://github.com/facebook/create-react-app/blob/main/packages/react-app-polyfill/README.md).

## Migrate away from Apollo MockedProvider

Initially we used Apollo’s `MockedProvider` for our GQL mocks. However this proved to be limited, as `MockedProvider` only allows mocks using arrays of statically defined returned values. This makes it hard to test subscriptions, or assert that queries were called with expected variables. So, we now use [mock-apollo-client](https://github.com/mike-gibson/mock-apollo-client) for our GQL mocks. We have a `NewMockSdApolloProvider` component that we can use in tests. This allows us to provide a function that will be called to return the data for our queries / mutations, and so permits us to use a standard `jest.fn()` mock.

Any work that is done on older stories or tests that uses the old `MockedProvider` should be used as an opportunity to refactor away and use `NewMockSdApolloProvider`.

## Global Storybook Decorators

Currently we have global decorators for our Storybook stories in `preview.js`. Unfortunately, `composeStories` does not include global decorators in the same way that it includes decorators defined in story files, so we end up having to include them manually when a Jest test requires them. Ideally the decorators would be pulled out of `preview.js`and instead put somewhere in `/src/tests` so they can just be imported into `preview.js` and any Jest tests that require them.