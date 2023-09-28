"use client"

import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { useWebSocketSubscription } from "@/hooks/use-websocket"

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [reactqueryclient, _] = React.useState<QueryClient>(
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: Infinity,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
          refetchInterval: Infinity,
        },
      },
    })
  )
  return (
    <QueryClientProvider client={reactqueryclient}>
      <WebsocketProvider />
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default Providers

const WebsocketProvider = () => {
  useWebSocketSubscription()
  return <></>
}
