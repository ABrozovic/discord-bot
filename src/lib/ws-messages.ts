const messages = {
  heartbeat: "heartbeat",
  join: "join",
  dmMessage: "dm_message",
  guildMessage: "guild_message",
  subscribeToGuild: "subscribe_to_guild",
} as const

type MessageKey = keyof typeof messages

type CreateWsMessageFn = <K extends MessageKey>({
  action,
  message,
  messageId,
}: {
  action: (typeof messages)[K]
  message?: string
  messageId?: string
}) => string

export const createWsMessage: CreateWsMessageFn = ({
  action,
  message,
  messageId,
}) => {
  return JSON.stringify({ action, message, message_id: messageId })
}

const clientMessages = ["get_guilds", "get_channels"] as const
