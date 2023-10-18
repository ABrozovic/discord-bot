import { useEffect, useState } from "react"
import { useBoundStore } from "@/store/slices"
import {
  useQuery as useReactQuery,
  type UseQueryOptions,
} from "@tanstack/react-query"

import type { WebSocketManager } from "@/lib/ws-manager"

const useWebSocketConnection = () => {
  const socket = useBoundStore((state) => state.websocket)
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    if (!socket) return
    setIsEnabled(true)
    return () => {
      setIsEnabled(false)
    }
  }, [socket])

  return { socket, isEnabled }
}

const fetchFromSocket = async <T>(
  socket: WebSocketManager | undefined,
  queryKey: string[],
  action: string,
  actionMeta?: string
): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    if (!socket) {
      reject(new Error("WebSocket is not connected."))
      return
    }

    const handleWebsocketMessage = (message: T) => {
      resolve(message)
      socket.unsubscribe(queryKey, handleWebsocketMessage)
      clearTimeout(timeout)
    }

    const handleError = (error: Error) => {
      reject(error)
      socket.unsubscribe(queryKey, handleWebsocketMessage)
      clearTimeout(timeout)
    }

    socket.subscribe(queryKey, handleWebsocketMessage)

    const timeout = setTimeout(() => {
      handleError(new Error("WebSocket request timeout."))
    }, 5000)

    socket.send(JSON.stringify({ action, message: actionMeta }))
  })
}

type clientMessages = "getGuilds" | "getDMS" | "getMessages"
type MyQuery = {
  action: string
  query: string[]
  message?: string
}
const clientQueries: Record<clientMessages, MyQuery> = {
  getGuilds: { action: "get_guilds", query: ["guilds"] },
  getDMS: { action: "get_dms", query: ["dms"] },
  getMessages: { action: "get_messages", query: ["messages"] },
}

export const useQueryWrapper = <T>(
  queryKey: clientMessages,
  actionMeta?: string,
  options?: UseQueryOptions<T, Error, T, readonly string[]>
) => {
  const { socket, isEnabled } = useWebSocketConnection()

  return useReactQuery<T, Error, T, readonly string[]>({
    queryKey: clientQueries[queryKey].query,
    queryFn: () =>
      fetchFromSocket<T>(
        socket,
        clientQueries[queryKey].query,
        clientQueries[queryKey].action,
        actionMeta
      ),
    enabled: isEnabled,
    ...options,
  })
}
