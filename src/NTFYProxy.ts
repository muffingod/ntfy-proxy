import config from "#Config.js";
import { Handler, OutgoingTopic } from "#types/config.js";
import { NTFYMessage, NTFYResponse } from "#types/ntfyMessage.js";

class NTFYProxy {
  #socket: WebSocket;
  #outgoingTopics: Array<OutgoingTopic>;

  constructor(handler: Handler) {
    this.#outgoingTopics = handler.outgoingTopics;

    this.#socket = this.#initSocket(handler.incomingTopic);
  }

  #initSocket(incomingTopic: string) {
    let websocketUrl = new URL(config.httpBaseUrl);
    websocketUrl.protocol = "wss"
    websocketUrl.pathname = `${incomingTopic}/ws`;

    const socket = new WebSocket(websocketUrl);

    socket.addEventListener('error', (event) => {
      console.error(event);
      console.error(event.error)
    });

    socket.addEventListener('message', async (event) => {
      let message: NTFYMessage = JSON.parse(event.data);
      await this.#handleMessage(incomingTopic, message);
    });

    socket.addEventListener('close', async (event) => {
      console.error(event);
      setTimeout(() => {
        console.log('Reconnecting...');
        this.#socket = this.#initSocket(incomingTopic);
      }, 2000)
    })

    return socket;
  }

  async #handleMessage(incomingTopic: string, message: NTFYMessage) {
    if (message.event !== "message") return;
    let match: boolean = false;
    for await (const outgoingTopic of this.#outgoingTopics) {
      if (this.#matches(message, outgoingTopic)) {
        await this.#sendMessageToTopic(message, outgoingTopic.outgoingTopic);
        match = true;
      }
    }

    if (!match) {
      console.error(`Unknown message in topic ${incomingTopic}`);
      console.error(message);
    }
  }

  #matches(message: NTFYMessage, topic: OutgoingTopic): boolean {
    const field = message[topic.matcherKey];
    switch (topic.matchType) {
      case "startsWith":
        if (typeof field === 'string') return field.startsWith(topic.matcherValue);
        console.error("startsWith only works on string fields");
        return false;

      case "contains":
        if (typeof field === 'string') return field.includes(topic.matcherValue);
        if (Array.isArray(field) && field.every(item => typeof item === 'string')) return field.includes(topic.matcherValue);
        console.error('Contains only works on string or array fields');
        return false;

      default:
        console.error(`Unknown matchtype: ${topic.matchType}`);
        return false;
    }
  }

  async #sendMessageToTopic(message: NTFYMessage, topic: string) {
    let body: NTFYResponse = {
      ...message,
      topic
    };

    if (message.attachment) {
      body.attach = message.attachment.url
    }

    await fetch(config.httpBaseUrl, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Authorization': `Bearer ${config.ntfyToken}`
      }
    });
  }

}

export default NTFYProxy;