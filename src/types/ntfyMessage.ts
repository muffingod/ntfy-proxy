export type NTFYMessageEvent = 'open' | 'keepalive' | 'message' | 'poll_request';

enum NTFYActionType {
  'view',
  'broadcast',
  'http'
}

type NTFYViewAction = {
  url: URL,
} & NTFYMessageAction

type NTFYBroadcastAction = {
  intent?: string,
  extras?: Map<string, string>
} & NTFYMessageAction

type NTFYHttpAction = {
  url: URL,
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
  headers?: Map<string, string>,
  body?: string
}

type NTFYMessageAction = {
  action: NTFYActionType,
  label: string,
  clear?: boolean
}

type NTFYAttachment = {
  name: string,
  url: URL,
  type?: string,
  size?: number,
  expires?: Date | number
}

export type NTFYMessage = {
  id: string,
  time: Date | number,
  expires: Date | number,
  event: NTFYMessageEvent,
  topic: string,
  message?: string,
  title?: string,
  tags?: Array<string>,
  priority?: '1' | '2' | '3' | '4' | '5',
  click?: URL,
  actions?: Array<NTFYViewAction | NTFYBroadcastAction | NTFYHttpAction>,
  attachment?: NTFYAttachment
}

export type NTFYResponse = {
  attach?: URL
} & NTFYMessage