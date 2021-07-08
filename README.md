# React/react-to-print API 

A web application which chatting between multiple users using a combination of JavaScript, Node.js, Socket.io and Bootstrap. The websocket API allows for multiple independent rooms. To view the app working, open up the app on two seperate tabs, making sure to enter the same chat room.

## Lessons Learned

During the lockdown that started in January 2021, Vodafone, my employer at the time, was unable to operate as non-essential retail shops had shut. At the time we had all been issued laptops to work from home as webchat agents. During this time the franchise owners across the north of England decided to take on more staff to accommodate the huge increase in sales coming through webchat. Traditionally staff would be trained on their sales and objection handling techniques face to face, but as we were now all remote this posed a challenge.

I took it on myself to find a solution for the three stores my franchise owner owned. Researching online I learnt about chat apps built using the websocket API, which lead me on to Socket.io. This was my first time using the API, it took me some time to put together a functional chat app. I then had to learn how to deploy this via Heroku. The app worked great for it's purpose, it was further introduced as part of the interview process. The popularity then spread to the other franchise owners and by the time the lockdown had finished it was being used by approximately 15 different stores.

## Potential Future Features

- As this was my first time using the various APIs a lot of the code was pulled from tutorials and Stack Overflow pages. I would love to rebuild this from scratch using the current API versions and ES6 features.

- It was requested from the franchise owners that they wanted a way to see historical chats, so that they can be referenced in the future to compare candidates. At the time my solution was to console.log every message, appending the messages with the chat room and username. This would then pulled from Heroku's server logs. I would like to implement a button during the chat which allows the current messages to be exported.

## Deployment

Deployed with [github pages](https://pages.github.com/).

## Get started

From your command line, first clone this repo:

```bash
# Clone this repository
$ git clone https://github.com/DurandalOne/InterviewChatApp

# Go into the repository
$ cd cv-generator

# Remove current origin repository
$ git remote remove origin
```
Then you can install the dependencies using NPM:

Using NPM:

```bash
# Install dependencies
$ npm install

# Start development server
$ npm start
```
You should now have a development server running in your default browser.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
