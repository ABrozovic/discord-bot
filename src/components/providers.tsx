"use client"

import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [reactqueryclient, _] = React.useState<QueryClient>(new QueryClient())
  return (
    <QueryClientProvider client={reactqueryclient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default Providers
