import React, { useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import ReconnectingWebSocket from "reconnecting-websocket"

import { snakeToCamel } from "@/lib/utils"
import { createWsMessage } from "@/lib/ws-messages"

export type WsJsonMessage = {
  sender?: string
  action: string
  message?: string
  messageId?: string
}

export const useWebSocketSubscription = () => {
  const queryClient = useQueryClient()

  const websocketRef = useRef<ReconnectingWebSocket | null>(null)

  React.useEffect(() => {
    const websocket = new ReconnectingWebSocket(
      "ws://127.0.0.1/ws?type=CLIENT",
      // "wss://discord-go.onrender.com/ws?type=CLIENT",
      undefined,
      { debug: true, minReconnectionDelay: 3000 }
    )
    websocketRef.current = websocket
    websocket.onopen = () => {
      websocket.send(createWsMessage({ action: "join" }))
    }

    websocket.onmessage = (event) => {
      const data: WsJsonMessage = snakeToCamel<WsJsonMessage>(
        JSON.parse(event.data)
      )
      data.message = data.message && JSON.parse(data.message)
      const queryKey = [data.action, data.messageId].filter(Boolean)

      queryClient.setQueryData(queryKey, data.message)
    }

    return () => {
      websocket.close()
    }
  }, [queryClient])
  return websocketRef.current
}
