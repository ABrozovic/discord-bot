import React, { useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import ReconnectingWebSocket from "reconnecting-websocket"

import { snakeToCamel } from "@/lib/utils"

export type WsJsonMessage = {
  sender: string
  action: string
  message: string
  messageId: string
}

export const useWebSocketSubscription = () => {
  const queryClient = useQueryClient()

  const websocketRef = useRef<ReconnectingWebSocket | null>(null)

  React.useEffect(() => {
    const websocket = new ReconnectingWebSocket(
      "ws://127.0.0.1/ws?type=CLIENT",
      undefined,
      { debug: true, minReconnectionDelay: 3000 }
      // "wss://discord-go.onrender.com/ws?type=CLIENT"
    )
    websocketRef.current = websocket
    websocket.onopen = () => {
      console.log("connected to webscoket")
    }

    websocket.onmessage = (event) => {
      const data: WsJsonMessage = snakeToCamel<WsJsonMessage>(
        JSON.parse(event.data)
      )
      const queryKey = [data.action, data.messageId].filter(Boolean)
      queryClient.setQueryData(queryKey, data.message)
    }

    return () => {
      websocket.close()
    }
  }, [queryClient])
  return websocketRef.current
}
