import { NTFYMessage } from "./ntfyMessage.js"

export type OutgoingTopic = {
  matcherKey: keyof NTFYMessage,
  matcherValue: string,
  matchType: "startsWith" | "contains",
  outgoingTopic: string
}

export type Handler = {
  incomingTopic: string,
  outgoingTopics: Array<OutgoingTopic>
}

export type Configuration = {
  httpBaseUrl: URL,
  ntfyToken: string,
  handlers: Array<Handler>
}