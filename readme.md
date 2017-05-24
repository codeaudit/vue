# @versionone/ui
VersionOne UI is an open-source and community supported collection of common UI components built with React. As an open-sourced and community supported project, VersionOne UI is not formally supported by VersionOne.

## Getting Started
### Step 1: Prerequisites
Run `./gulp verify` to determine if you meet the above requirements. If there is an error, see below; otherwise 
proceed to Step 2.

**Required Software**
- node@>=6.10.0 <7.3.0
    - *tests will not work with node@7.3 or node@7.4*
- [yarn](https://yarnpkg.com/en/docs/install)@^0.23.2

### Step 2: Installing Dependencies
Run `yarn`. If there is an error, see the [Prerequisites](#Step-1-Prerequisites) section.

### Step 3: Running the Documentation Site Locally
Run `./gulp start/docs` and open your browser to **[http://localhost:3000](http://localhost:3000)**.

If there is an error, try running `yarn` again.

### Step 4: Running Storybook Locally
Run `./gulp start` and open your browser to **[http://localhost:9001](http://localhost:9001)**.

If there is an error, try running `yarn` again.

#### Running Tests and Linting
- Optionally use WallabyJS
- `./gulp test` will run all tests
- `./gulp lint` will lint all src and test files


- `./gulp test/src` will run all VersionOne UI src tests (excluding tests from `packages/*`)
- `./gulp test/icons` will run all tests for icon builder package
- `./gulp lint/src` will lint src files in VersionOne UI src
- `./gulp lint/test` will lint all test files in VersionOne UI src

## Publishing
Do **NOT** simply use `npm publish` or `yarn publish`.

- Ensure you are logged in as versionone in the NPM CLI.
- Run `./gulp publish {version}` where {version} is one of (patch | minor | major | next)
    - see the [Semantic Versioning docs](http://semver.org/) for more info between the version types
    - the docs site will automatically be deployed on major and minor releases

## Other Resources
[LICENSE.md](./license.md) - License for source code and redistribution
