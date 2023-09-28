import { WsJsonMessage } from "@/hooks/use-websocket"

const messages = {
  join: "join",
  send: "send",
} as const

type MessageKey = keyof typeof messages

export const wsMessage: {
  [K in MessageKey]: WsJsonMessage
} = {
  join: { action: messages.join },
  send: { action: messages.send },
}

type CreateWsMessage<K extends MessageKey> = {
  action: (typeof messages)[K]
}

export const createWsMessage = <K extends MessageKey>({
  action,
  ...rest
}: CreateWsMessage<K> & Omit<WsJsonMessage, "action">) => {
  const wsMsg: WsJsonMessage = { ...rest, action }
  return JSON.stringify(wsMsg)
}
