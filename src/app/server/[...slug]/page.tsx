"use client"

import { useSlug } from "@/hooks/use-slug"
import { ChatContainer } from "@/components/chat/chat-container"
import ServerContainer from "@/components/chat/server-container"
import ServerInfo from "@/components/chat/server-information"

const ServerPage = () => {
  const _ = useSlug()
  return (
    <ServerContainer>
      <ServerInfo />
      <ChatContainer />
    </ServerContainer>
  )
}

export default ServerPage
