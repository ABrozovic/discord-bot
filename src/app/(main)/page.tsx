"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useBoundStore } from "@/store/slices"
import {
  type APIEmoji,
  type APIGuild,
  type APIMessage,
} from "discord-api-types/v10"

import { createWsMessage } from "@/lib/ws-messages"
import useChatMessages from "@/hooks/use-chat-messages"
import useScrollToBottomEffect from "@/hooks/use-scroll"
import { useStreamingMessages } from "@/hooks/use-streaming-messages"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ChatContainer } from "@/components/chat/chat-container"
import { ChatMessage, ShortChatMessage } from "@/components/chat/chat-message"
import ServerContainer from "@/components/chat/server-container"
import ServerInfo from "@/components/chat/server-information"
import Icons from "@/components/icons"
import { Typography } from "@/components/typography"

import { useQueryWrapper } from "../../hooks/use-query-wrapper"

const MainPage = () => {
  const router = useRouter()
  useEffect(() => {
    router.push("server/602887413819506700")
  }, [router])
  return (
    <ServerContainer>
      <ServerInfo />
      <ChatContainer />
    </ServerContainer>
  )
}

export default MainPage
