import React from "react"
import { useBoundStore } from "@/store/slices"
import { useQueryClient } from "@tanstack/react-query"

import { WebSocketManager } from "@/lib/ws-manager"

export type WsJsonMessage = {
  sender?: string
  action: string
  message?: string
  messageId?: string
}

export const useWebSocketSubscription = () => {
  const queryClient = useQueryClient()
  const setWebsocket = useBoundStore((state) => state.setWebsocket)
  const addToMessageQueue = useBoundStore((state) => state.setMessageQueue)

  React.useEffect(() => {
    const wsman = new WebSocketManager(
      // "ws://127.0.0.1/ws?type=CLIENT"
      "wss://discord-go.onrender.com/ws?type=CLIENT"
    )
    setWebsocket(wsman)

    return () => {
      wsman.unsubscribeAll()
      wsman.disconnect()
    }
  }, [setWebsocket])
}
