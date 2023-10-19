import { useEffect, useRef, useState } from "react"
import { useBoundStore } from "@/store/slices"
import {
  QueryClient,
  useQueryClient,
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

export const useStreamingMessages = <T>(
  guildId: string,
  options?: UseQueryOptions<T, Error, T, readonly string[]>
) => {
  const { socket, isEnabled } = useWebSocketConnection()
  const queryClient = useQueryClient()
  const subscriptionRef = useRef(false)

  const handleRef = useRef<Function>()

  const query = useReactQuery<T, Error, T, readonly string[]>({
    queryKey: ["messages", guildId],
    queryFn: () =>
      fetchFromSocket<T>(socket, ["messages"], "get_messages", guildId),
    enabled: isEnabled,
    ...options,
  })
  useEffect(() => {
    if (!query.data) return
    if (subscriptionRef.current == true) return
    subscriptionRef.current = true
    const handleNewMessages = UpdateMessages<T>(queryClient, guildId)
    handleRef.current = handleNewMessages
    socket?.subscribe(["messages"], handleNewMessages)
  }, [guildId, query, queryClient, socket])

  useEffect(() => {
    return () => {
      console.log("dismounted")
      socket?.unsubscribe(["messages"], handleRef.current!)
    }
  }, [socket])
  return query
}
function UpdateMessages<T>(
  queryClient: QueryClient,
  guildId: string
): Function {
  return (message: T) => {
    const oldData: T[] = queryClient.getQueryData(["messages", guildId]) ?? []
    queryClient.setQueryData(["messages", guildId], [...oldData, message])
  }
}
