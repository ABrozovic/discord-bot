import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useBoundStore } from "@/store/slices"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { Separator } from "@radix-ui/react-separator"
import type { APIEmoji, APIGuild, APIMessage } from "discord-api-types/v10"

import { createWsMessage } from "@/lib/ws-messages"
import useChatMessages from "@/hooks/use-chat-messages"
import { useQueryWrapper } from "@/hooks/use-query-wrapper"
import useScrollToBottomEffect from "@/hooks/use-scroll"
import { useStreamingMessages } from "@/hooks/use-streaming-messages"

import Icons from "../icons"
import { Typography } from "../typography"
import { ChatMessage, ShortChatMessage } from "./chat-message"

export const ChatContainer = () => {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="fixed z-50 hidden h-full w-full items-center justify-center">
        {/* TODO: Upload area */}
      </div>
      <ChatHeader />

      <ChatRoom>
        <ChatMessages />
      </ChatRoom>
      <ChatTextBox />
    </div>
  )
}

const ChatRoom = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-1 items-stretch justify-stretch">
      <div className="relative flex h-full w-full">
        <div className="absolute h-full w-full">
          <main className="relative flex h-full flex-1 flex-col">
            <span className="sr-only">
              <h2>Chat Room Title</h2>
            </span>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

const ChatMessages = () => {
  // const { activeGuild, activeChannel } = useSlug()
  const activeChannel = useBoundStore((state) => state.zactiveChannel)
  const activeGuild = useBoundStore((state) => state.zactiveGuild)

  const chatMessages = useChatMessages({ channelId: activeChannel })

  const newMessages = useStreamingMessages<
    Array<APIMessage & { member: { nick: string } }>
  >(activeGuild as string)

  const { scrollAreaRef } = useScrollToBottomEffect(newMessages.data)

  return (
    <div className="relative flex flex-1  ">
      <div className="absolute flex h-full w-full flex-1 flex-col justify-end">
        <ScrollArea
          ref={scrollAreaRef}
          className="flex  flex-col items-stretch justify-end"
        >
          <div className="flex h-full w-full flex-1 flex-col justify-end">
            <ol role="list" className="overflow-hidden">
              <button onClick={() => chatMessages.fetchNextPage()}>TODO</button>
              {chatMessages.data?.map((message, i) => {
                return chatMessages.data[i - 1]?.author.id ===
                  message.author.id ? (
                  <ShortChatMessage
                    key={message.id}
                    content={message.content}
                  />
                ) : (
                  <ChatMessage
                    key={message.id}
                    avatar={`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=80`}
                    fallbackAvatar={`https://cdn.discordapp.com/avatars/${message.author.id}/a_${message.author.avatar}.webp?size=80`}
                    author={
                      message.member.nick.length > 0
                        ? message.member?.nick
                        : message.author?.username
                    }
                    content={message.content}
                    time={message.timestamp}
                  />
                )
              })}
              {newMessages.data
                ?.filter((msg) => msg.channel_id === activeChannel)
                .map((message, i) => {
                  return newMessages.data[i - 1]?.author.id ===
                    message.author.id ? (
                    <ShortChatMessage
                      key={message.id}
                      content={message.content}
                    />
                  ) : (
                    <ChatMessage
                      key={message.id}
                      avatar={`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=80`}
                      fallbackAvatar={`https://cdn.discordapp.com/avatars/${message.author.id}/a_${message.author.avatar}.webp?size=80`}
                      author={
                        message.member.nick.length > 0
                          ? message.member?.nick
                          : message.author?.username
                      }
                      content={message.content}
                      time={message.timestamp}
                    />
                  )
                })}
            </ol>
          </div>
          {/* spacer */}
          <div className="h-6 w-[1px]"></div>
          {/* spacer */}
        </ScrollArea>
      </div>
    </div>
  )
}

const ChatHeader = () => {
  // const { activeChannel } = useSlug()
  const activeChannel = useBoundStore((state) => state.zactiveChannel)

  //TODO: fix colors
  return (
    <div className="z-40 flex h-12 w-full flex-none flex-col justify-center border-b-[1px] border-tertiary ">
      <div className="flex flex-1">
        <div className="flex flex-1 items-center p-2">
          <Icons.hash className="mx-2 h-6" />
          <Typography variant="p" as="h1" className="mr-2">
            channel name - {activeChannel}
          </Typography>
          <Separator orientation="vertical" />
          {/* TODO: Add the rest of the icons */}
        </div>
      </div>
    </div>
  )
}

type EmojiContainerProps = {
  emoji: string
  alt: string
  size?: number
  isAnimated?: boolean
}
export const EmojiContainer = ({
  emoji,
  alt,
  size = 22,
  isAnimated,
}: EmojiContainerProps) => {
  const emote = emoji.split(":")
  const [error, setError] = useState(false)
  const src = `https://cdn.discordapp.com/emojis/${emote[2]}.${
    isAnimated ? "gif" : "webp"
  }?size=${size}&quality=lossless`
  return (
    <span className="inline-block cursor-pointer object-contain align-bottom">
      {error ? (
        <span>{emoji}</span>
      ) : (
        <Image
          height={size}
          width={size}
          src={src}
          alt={alt}
          onError={() => setError(true)}
        />
      )}
    </span>
  )
}

interface EmojiLookup {
  [guildId: string]: {
    guildName: string
    emojis: APIEmoji[]
  }
}

type EmojiResult = {
  guildId: string
  guildName: string
} & APIEmoji
const ChatTextBox = () => {
  const websocket = useBoundStore((state) => state.websocket)
  const {
    inputRef,
    evaluateInput,
    emotesFound,
    text,
    setText,
    emoteToComplete,
  } = useTextBox()
  const [activeIndex, setActiveIndex] = useState(0)

  // const { activeChannel } = useSlug()
  const activeChannel = useBoundStore((state) => state.zactiveChannel)

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault()
        setActiveIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : emotesFound.length - 1
        )
        break
      case "ArrowDown":
        event.preventDefault()
        setActiveIndex((prevIndex) =>
          prevIndex < emotesFound.length - 1 ? prevIndex + 1 : 0
        )
        break
      case "Tab":
        // case "Enter":
        event.preventDefault()
        const activeEmote = emotesFound[activeIndex]
        if (activeEmote) {
          handleEmoteSelection(activeEmote)
        }
        break
      case "Enter":
        event.preventDefault()
        websocket?.send(
          createWsMessage({
            action: "guild_message",
            messageId: activeChannel,
            message: text,
          })
        )
        setText("")
      default:
        break
    }
  }

  const handleEmoteSelection = (emote: EmojiResult) => {
    const updatedText = text.replace(
      `:${emoteToComplete}`,
      `<${emote.animated ? "a" : ""}:${emote.name}:${emote.id ?? ""}>`
    )
    setText(updatedText)
    console.log(emote)
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
    evaluateInput()
  }

  return (
    <form className="relative px-4">
      <div className="relative mb-6 h-11 w-full rounded-sm bg-red-700">
        <ScrollArea className="max-h-[50vh]">
          <div className="relative flex pl-4">
            <div className="sitcky flex-none self-stretch">
              <div className="sticky -ml-4 flex h-11 w-11 items-center justify-center px-2.5 py-4">
                <Icons.plus size={33} />
              </div>
            </div>
            <div className="relative w-full break-words  p-[11px] ">
              <input
                ref={inputRef}
                value={text}
                onKeyDown={handleKeyDown}
                onClick={evaluateInput}
                onSelect={evaluateInput}
                onChange={handleOnChange}
                className="w-full appearance-none border-none bg-transparent focus:outline-none"
                type="text"
              />
            </div>
          </div>
        </ScrollArea>
        <EmojiAutocomplete emotes={emotesFound} activeEmote={activeIndex} />
      </div>
    </form>
  )
}
const EmojiAutocomplete = ({
  emotes,
  activeEmote,
}: {
  emotes: EmojiResult[]
  activeEmote: number
}) => {
  const emoteRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    emoteRefs.current = emoteRefs.current.slice(0, emotes.length)
  }, [emotes])

  if (emotes.length < 1) return <></>

  return (
    <div className="absolute bottom-[calc(100%+8px)] z-30 w-full whitespace-nowrap bg-slate-900 shadow-sm">
      <div>
        <div className="p-2">
          <Typography className="py-1" as="h3">
            Emoji matching: ....
          </Typography>
        </div>
        <ScrollArea className="px-2">
          <div className="cursor-pointer rounded-sm px-1 py-2 ">
            {emotes.map((emote, index) => (
              <div
                key={emote.id}
                ref={(element) => (emoteRefs.current[index] = element)}
                className={`${
                  index === activeEmote
                    ? "rounded-sm bg-gray-200/10 px-1 py-2"
                    : "rounded-sm px-1 py-2"
                }`}
              >
                <EmoteSuggestion
                  src={emote.id ?? ""}
                  name={emote.name ?? ""}
                  server={emote.guildName}
                  isAnimated={emote.animated ?? false}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

type EmoteSuggestionProps = {
  src: string
  name: string
  server: string
  isAnimated: boolean
}

const EmoteSuggestion = ({
  src,
  name,
  server,
  isAnimated,
}: EmoteSuggestionProps) => (
  <div className="min-h-4 flex items-center">
    <Image
      className="mr-2 object-contain"
      width={20}
      height={20}
      src={
        isAnimated
          ? `https://cdn.discordapp.com/emojis/${src}.gif?size=20&quality=lossless`
          : `https://cdn.discordapp.com/emojis/${src}.webp?size=20&quality=lossless`
      }
      alt={name}
    />
    <div className="shrink-0 grow-0 basis-auto overflow-hidden">
      <Typography className="w-full truncate">{name}</Typography>
    </div>
    <div className="ml-4 flex-1 truncate text-right">{server}</div>
  </div>
)

const useTextBox = () => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [text, setText] = useState("")
  const { data } = useQueryWrapper<Record<string, APIGuild>>("getGuilds")
  const [emotesFound, setEmotesFound] = useState<EmojiResult[]>([])
  const [emoteToComplete, setEmoteToComplete] = useState("")

  const evaluateInput = () => {
    const newCursorPosition = inputRef.current?.selectionStart ?? 0
    const word = extractWordAtIndex(newCursorPosition)

    if (
      word &&
      word.length >= 3 &&
      word.startsWith(":") &&
      !word.endsWith(":")
    ) {
      setEmoteToComplete(word.substring(1))
    } else {
      setEmoteToComplete("")
    }
  }

  const extractWordAtIndex = (index: number) => {
    const words = (inputRef.current?.value ?? "").split(" ")
    let currentPos = 0

    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      const wordLength = word?.length ?? 0

      if (index >= currentPos && index <= currentPos + wordLength) {
        return word
      }

      currentPos += wordLength + 1
    }
    return ""
  }

  const searchEmojisByName = useCallback(
    (searchString: string) => {
      if (!data || searchString.length < 3) {
        emotesFound.length > 0 && setEmotesFound([])
        return
      }

      const flatMapResult: EmojiResult[] = []

      for (const guildId in data) {
        const guild = data[guildId]
        if (!guild) continue

        guild.emojis.forEach((emoji) => {
          if (emoji.name?.toLowerCase().startsWith(searchString)) {
            const emojiResult: EmojiResult = {
              guildId,
              guildName: guild.name,
              ...emoji,
            }
            flatMapResult.push(emojiResult)
          }
        })
      }

      setEmotesFound(flatMapResult)
    },
    [data, emotesFound.length]
  )

  useEffect(() => {
    searchEmojisByName(emoteToComplete)
  }, [emoteToComplete, searchEmojisByName])

  return {
    inputRef,
    text,
    setText,
    evaluateInput,
    emotesFound,
    emoteToComplete,
  }
}
