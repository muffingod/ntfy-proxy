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
  incomingTopic: "jellyseerDEV",
  outgoingTopics: [
    {
      matcherKey: "title",
      matcherValue: "Movie Request Automatically Approved - ",
      matchType: "startsWith",
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