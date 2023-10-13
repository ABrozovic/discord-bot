import React from "react"
import { useBoundStore } from "@/store/slices"
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
  const setWebsocket = useBoundStore((state) => state.setWebsocket)
  const activeGuild = useBoundStore((state) => state.activeGuild)

  const websocket = useBoundStore((state) => state.websocket)
  React.useEffect(() => {
    websocket?.send(
      createWsMessage({
        action: "subscribe_to_guild",
        message: activeGuild,
      })
    )
  }, [activeGuild, websocket])

  React.useEffect(() => {
    let websocket: ReconnectingWebSocket | null
    let heartbeatTimeout: NodeJS.Timeout | null

    const startHeartbeat = () => {
      heartbeatTimeout = setTimeout(() => {
        if (websocket && websocket.readyState === 1) {
          websocket.send(createWsMessage({ action: "heartbeat" }))
          startHeartbeat()
        }
      }, 55 * 1000)
    }

    const stopHeartbeat = () => {
      if (heartbeatTimeout) {
        clearTimeout(heartbeatTimeout)
        heartbeatTimeout = null
      }
    }

    const initializeWebSocket = () => {
      websocket = new ReconnectingWebSocket(
        // "ws://127.0.0.1/ws?type=CLIENT",
        "wss://discord-go.onrender.com/ws?type=CLIENT",
        undefined,
        { debug: true, minReconnectionDelay: 3000 }
      )
      setWebsocket(websocket)

      websocket.onopen = () => {
        startHeartbeat()
        websocket?.send(createWsMessage({ action: "join" }))
      }

      websocket.onmessage = (event) => {
        console.log(event)
        const data: WsJsonMessage = snakeToCamel<WsJsonMessage>(
          JSON.parse(event.data)
        )
        data.message = data.message && JSON.parse(data.message)
        const queryKey = [data.action, data.messageId].filter(Boolean)

        queryClient.setQueryData(queryKey, data.message)
      }

      websocket.onclose = () => {
        stopHeartbeat()
      }
    }

    initializeWebSocket()

    return () => {
      websocket?.close()
      stopHeartbeat()
    }
  }, [queryClient, setWebsocket])
}
