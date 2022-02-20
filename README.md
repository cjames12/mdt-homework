## Project setup and Requirements:

- Node 12 LTS or greater installed

Project is created using Expo CLI (https://reactnative.dev/docs/environment-setup)

    npm install -g expo-cli

If an error occured coming from the dependencies or modules, just run "npm install"

## Running the Project

- on the command line run this command (expo start). This will give you the list of options where you can run the project (android, ios, web) and the other commands that can be use during development.
- It is recommended to use your actual mobile device for running the project because of the issue I encountered on the emulator on my machine when connecting to the API where I still can't figure out.

## About the code

The project is built from React Native, an open-source JavaScript framework, designed for building apps on multiple platforms like iOS, Android, and also web applications, utilizing the very same code base and it is based on React. It is split into 4 main screens named:

- LoginScreen
- SignupScreen
- DashboardScreen
- TransferScreen

Navigating from different screen to another is operated from the combined components coming from react-navigation/native and react-navigation/native-stack.

- https://reactnavigation.org/docs/getting-started/
- https://reactnavigation.org/docs/native-stack-navigator/

For the API calls, axios is used on handling the requests. Axios is promise-based, which gives you the ability to take advantage of JavaScript's async and await for more readable asynchronous code. The main purpose of using Axios is to get support for request and response interception, conversion of data into JSON
format, and transform it. It also helps you in protecting XSRF forgery by default while you request cross-site access.

- https://github.com/axios/axios

For the state handling, redux is used to store data coming from API calls and can be used from differenct screens. Redux allows you to manage your app's state in a single place and keep changes in your app more predictable and traceable. It makes it easier to reason about changes occurring in your app.

- https://redux.js.org/

For unit testing, combined jest and react native testing library is used to cover every possible scenario while using the app. You will notice that there are some parts not yet covered for the reason that I need more time to look for well documented sources on how to cover those parts (eg. simulating change from react-native-picker/picker).

- https://jestjs.io/
- https://callstack.github.io/react-native-testing-library/
