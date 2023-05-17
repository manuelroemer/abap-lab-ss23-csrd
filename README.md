# CSRD Reporting

This repository contains the CSRD Reporting application's frontend, written in SAPUI5.

## Getting Started

Overall, this is a normal SAPUI5/web project that uses NPM. To get started, clone the repository and run the following commands to start a local dev server:

```sh
npm i     # To install dependencies.
npm start # To start a local dev server.

# A browser window should automatically open on localhost:8080.
```

### Debugging

For development, you need to use VS Code. The project contains a [`launch.json`](./.vscode/launch.json) file for debugging the app in Edge/Chrome.  
**⚠️ Important:** When using these debug config, you **must** close any running Edge or Chrome process. Otherwise, the debugger **cannot be launched**. See the `launch.json` file for details.

### Formatting

This project uses [prettier](https://prettier.io/) for formatting the code. You can format the entire project by running `npm run format`.

We recommend installing the [Prettier VS Code extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) when working on this codebase.

### TypeScript

The entire project is heavily frontend-based, meaning that most development effort is put into the frontend's codebase. Therefore, we develop the UI in [TypeScript](https://www.typescriptlang.org/). This drastically reduces the potential errors that we can make and gives us more time to actively focus on developing the _project_.

For details about how SAPUI5 integrates with TypeScript, see [this link](https://sap.github.io/ui5-typescript/).
For the project setup, we followed [this official guide](https://github.com/SAP-samples/ui5-typescript-helloworld/blob/22c61f51647f397784f5a66ddfa63031fe96aac8/step-by-step.md).
