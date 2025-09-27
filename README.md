# NTFY-Proxy

This project is a message proxy for [ntfy.sh](ntfy.sh), which is a simple pub-sub notification service.
My initial problem was that some services (for example, Jellyseer) are compatible with this service; however, it pushes all its notifications into one topic. This could cause unnecessary notifications for most users, as they won't be interested, for example, when something broke; however, an admin would be.
As a solution, I created this project. It is a really simple proxy. It uses WebSockets for the incoming topics, and based on a match criterion, it would repost the message on an outgoing topic. This would result in multiple topics, but the user base could decide what topics they are really interested in.

## Configuration

The program can be configured via the `Config.ts` file. I included an example that you can check out.

```
import { Configuration } from "#types/config.js";

/* RENAME THIS FILE TO `Config.ts` */

let config: Configuration = {
  /* Replace this with your baseUrl if you self host */
  httpBaseUrl: new URL("https://ntfy.sh/"),
  /* Token for the Proxy User */
  ntfyToken: 'Token',
  handlers: []
}

/* Example configuration for Jellyseer */
/// Jellyseer notifications
config.handlers.push({
  /* The program will listen on this topic */
  incomingTopic: "jellyseerDEV",
  /* It will repost the incoming message based on the below settings */
  outgoingTopics: [
    {
      /* Which field are we listening to */
      matcherKey: "title",
      /* What should be the value of the field */
      matcherValue: "Movie Request Automatically Approved - ",
      /* How we would like to match the value with the field */
      matchType: "startsWith",
      /* On what channel should the program repost the message */
      outgoingTopic: "jellyseerMovieRequest"
    },
    {
      matcherKey: "title",
      matcherValue: "Movie Request Now Available - ",
      matchType: "startsWith",
      outgoingTopic: "jellyseerMovieAvailable"
    }
  ]
});

/* Example DEV config */
config.handlers.push({
  incomingTopic: 'devIn',
  outgoingTopics: [
    {
      matcherKey: "tags",
      matchType: "contains",
      matcherValue: "devA",
      outgoingTopic: 'devOutA'
    },
    {
      matcherKey: "title",
      matchType: "startsWith",
      matcherValue: "devB",
      outgoingTopic: 'devOutB'
    }
  ]
})

export default config;
```

## Run the program

First, let's install the dependencies:

```bash
pnpm i
```

Then, you can run the app in dev mode:

```bash
pnpm dev
```

In this mode, you can adjust the config as you like, and the app will restart every time you make a change.
