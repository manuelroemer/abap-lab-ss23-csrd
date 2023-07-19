# CSRD Reporting

This repository contains the CSRD Reporting application, written with ABAP and UI5.

## Background

This project was written as part of the _"Master-Praktikum - Enterprise Software Engineering am Beispiel von SAP"_ course at the [TUM](https://www.tum.de/).

We were tasked by Capgemini to develop an application that assist a consultant in consulting a customer on their CSRD reporting requirements. The CSRD is a law that was passed by the European Union on January 5th, 2023 and will take full effect starting at the end of 2024, gradually ramping up until 2028, when all listed companies in the EU will be forced to hand in detailed reports about their company's specific, sustainability related matters. This is a considerable effort for companies, eating up a lot of hours and money.

Our application should, therefore, do the following:

- ❓ Provide the ability for a consultant to collect CSRD-related information about a customer.
- 📃 Query the information via an interactive questionnaire, similar to tax reporting applications or online forms.
- ✔️ Provide the user with a checklist tha gives information about _what_ reports his specific company needs to deliver.

We further defined the following points that we wanted to fulfill ourselves:

- 🔧 Make the application easily extensible.
- 👩🏻‍💻 Build a WYSIWYG editor that assists in the creation of the questionnaire.

From the university's perspective, we had the following requirements:

- The application needs to consist of a frontend and backend.
- The frontend must be built in SAPUI5 and the backend with ABAP.

## Documentation

As part of the course, we had to hand in a document which documents the project. We uploaded a PDF version of that document inside this repository at [./doc/Project Documentation.pdf](./doc/Project%20Documentation.pdf). This is an extensive documentation about the project's architecture and internal implementation details. If you are interested in the project's details, we heavily recommend reading that documentation, especially the _Implementation_ chapter.

## Getting Started

> **⚠️ Important:**  
> You will, most likely, not be able to run the project yourself. The application requires our backend OData services to run properly. Since those are/were hosted by our university's [SAP UCC](https://ucc.tum.de/) behind a password-protected gateway, it is not possible to access them without an account.  
> This means that the only option to properly run the project is to **self-host and/or replace** the OData services manually. We provided the ABAP code in the [`./backend`](./backend) directory. The directory also contains the structures of the tables that you might need to create. If done properly, you should be able to recreate those OData services. All that's left is reconfiguring the URLs within the frontend - a simple find and replace should be enough here. For reference, all API calls are contained in the [`./webapp/api`](./webapp/api) directory. You might also have to update the proxy config in [`./ui5.yaml`](./ui5.yaml) depending on how you run/deploy the app.

Apart from the above, this is a normal SAPUI5/web project that uses NPM with a few specialities like code generation built in. To get started, clone the repository and run the following commands to start a local dev server:

```sh
npm i     # To install dependencies.
npm start # To start a local dev server.

# A browser window should automatically open on localhost:8080.
```

To function correctly, the app must connect to the above mentioned OData service(s). We were using the infrastructure hosted by the TUM's UCC.
If you have access to that infrastructure, you can use it by creating a `.env` file in the repository's root with the following content:

```ini
# For deployment.
S72_USER=YOUR_USERNAME
S72_PASSWORD=YOUR_PASSWORD

# For local development.
FIORI_TOOLS_USER=YOUR_USERNAME
FIORI_TOOLS_PASSWORD=YOUR_PASSWORD
```

If you are using a self-hosted version, replace the values accordingly.

### Debugging

For development, you need to use VS Code. The project contains a [`launch.json`](./.vscode/launch.json) file for debugging the app in Edge/Chrome.  
**⚠️ Important:** When using these debug config, you **must** close any running Edge or Chrome process. Otherwise, the debugger **cannot be launched**. See the `launch.json` file for details.

### Formatting

This project uses [prettier](https://prettier.io/) for formatting the code. You can format the entire project by running `npm run format`.

We recommend installing the [Prettier VS Code extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) when working on this codebase.

### Linting

This project uses [ESLint](https://eslint.org/) for linting the code. You can lint the entire project by running `npm run lint`.

We recommend installing the [ESLint VS Code extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) when working on this codebase.

### TypeScript

The entire project is heavily frontend-based, meaning that most development effort is put into the frontend's codebase. Therefore, we develop the UI in [TypeScript](https://www.typescriptlang.org/). This drastically reduces the potential errors that we can make and gives us more time to actively focus on developing the _project_.

For details about how SAPUI5 integrates with TypeScript, see [this link](https://sap.github.io/ui5-typescript/).
For the project setup, we followed [this official guide](https://github.com/SAP-samples/ui5-typescript-helloworld/blob/22c61f51647f397784f5a66ddfa63031fe96aac8/step-by-step.md).

## Issues

The project was created during four sprints, each taking ~2 weeks. For our team organization, we used GitHub Issues to plan and schedule user stories. These can be seen in [the project's issues](https://github.com/manuelroemer/abap-lab-ss23-csrd/issues). We managed the issues in a GitHub project board and will not close them, so that they remain easily accessible for future reference.

## Contributing

This was a project done during a university course. We do not expect future development. We will, very likely, not make or accept any modifications of this project.

If you are interested in it and have some questions, feel free to create issues or discussions though. 😊

## License

We release the code under the AGPL license. See [./LICENSE](./LICENSE) for details.
