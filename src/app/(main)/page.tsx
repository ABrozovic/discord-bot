"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useBoundStore } from "@/store/slices"
import {
  type APIEmoji,
  type APIGuild,
  type APIMessage,
} from "discord-api-types/v10"
import Balancer from "react-wrap-balancer"

import { formatTimestamp } from "@/lib/utils"
import { createWsMessage } from "@/lib/ws-messages"
import { useMyQuery } from "@/hooks/use-my-query"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import ServerContainer from "@/components/chat/server-container"
import ServerInfo from "@/components/chat/server-information"
import Icons from "@/components/icons"
import { Typography } from "@/components/typography"

const MainPage = () => {
  const params = useParams()
  // const server = useMyQuery<
  return (
    <ServerContainer>
      <ServerInfo />
      <Chat />
    </ServerContainer>
  )
}

export default MainPage

export const Chat = () => {
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

export const ChatHeader = () => {
  //TODO: fix colors
  return (
    <div className="z-40 flex h-12 w-full flex-none flex-col justify-center border-b-[1px] border-tertiary ">
      <div className="flex flex-1">
        <div className="flex flex-1 items-center p-2">
          <Icons.hash className="mx-2 h-6" />
          <Typography variant="p" as="h1" className="mr-2">
            channel name
          </Typography>
          <Separator orientation="vertical" />
          {/* TODO: Add the rest of the icons */}
        </div>
      </div>
    </div>
  )
}

export const ChatRoom = ({ children }: { children: React.ReactNode }) => {
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

export const ChatMessages = () => {
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "auto",
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [])

  const activeChannel = useBoundStore((state) => state.activeChannel)
  const [chatMessages, setChatMessages] = useState<APIMessage[]>([])
  const newChatMessage = useMyQuery<APIMessage>([
    "channel_message",
    activeChannel,
  ])

  useEffect(() => {
    if (!newChatMessage.data || !newChatMessage.data.content) return
    setChatMessages((oldMessages) => [...oldMessages, newChatMessage.data])
  }, [newChatMessage.data])

  return (
    <div className="relative flex flex-1  ">
      <div className="absolute flex h-full w-full flex-1 flex-col justify-end">
        <ScrollArea
          ref={scrollAreaRef}
          className="flex  flex-col items-stretch justify-end"
        >
          <div className="flex h-full w-full flex-1 flex-col justify-end">
            <ol role="list" className="overflow-hidden">
              {chatMessages.map((message) => (
                <ChatMessage
                  key={message.id}
                  avatar={`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=80`}
                  author={message.author?.username}
                  content={message.content}
                  time={message.timestamp}
                />
              ))}
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

type ChatMessageProps = {
  avatar: string
  author: string
  time: string
  content: string
}
export const ChatMessage = ({
  avatar,
  author,
  time,
  content,
}: ChatMessageProps) => {
  const parsedMessage = content
  // TODO: Message parsing, emojis, etc..
  return (
    <li className="relative">
      <div className="mt-4 min-h-[44px] py-0.5 pl-[72px] pr-12">
        <div className="static">
          <Image
            className="absolute left-4 mt-0.5 cursor-pointer rounded-full"
            src={avatar}
            alt="user avatar"
            height={40}
            width={40}
          />
          <Typography className="relative overflow-hidden" as="h3">
            <span className="mr-1">
              <span>{author}</span>
            </span>
            <span>
              <time>
                <i className="absolute inline-block opacity-0">—</i>
                <Typography as="span" className="text-xs">
                  {formatTimestamp(time)}
                </Typography>
              </time>
            </span>
          </Typography>
          <div className="relative  overflow-hidden ">
            <Balancer className="baseline">
              {parsedMessage}
              {/* <EmojiContainer
                src="https://cdn.discordapp.com/emojis/781006285494943775.webp?size=44&quality=lossless"
                alt=""
              /> */}
            </Balancer>
          </div>
        </div>
      </div>
    </li>
  )
}

type EmojiContainerProps = {
  src: string
  alt: string
}
export const EmojiContainer = ({ src, alt }: EmojiContainerProps) => {
  return (
    <span className="inline-block cursor-pointer object-contain align-bottom">
      <Image height={22} width={22} src={src} alt={alt} />
    </span>
  )
}

interface EmojiLookup {
  [guildId: string]: {
    guildName: string
    emojis: APIEmoji[]
  }
}
/*const createEmojiLookup = (guilds: Record<string, APIGuild>|undefined): EmojiLookup|undefined => {
  if(!guilds) return;
  const emojiLookup: EmojiLookup = {}

  for (const guildId in guilds) {
    const guild = guilds[guildId]
    if (!guild) continue
    emojiLookup[guildId] = {
      guildName: guild.name ?? "",
      emojis: guild.emojis,
    }
  }

  return emojiLookup
}*/
//const emojiLookup = useMemo(()=>createEmojiLookup(data),[data])

/*const searchEmojisByName = (searchString: string): Array<[string, string, string, string]> | undefined => {
    if (!emojiLookup) return;
    
    const flatMapResult: Array<[string, string, string, string]> = [];
    const guilds = emojiLookup;
  
    for (const guildId in guilds) {
      const guild = guilds[guildId];
      if (!guild) continue;
  
      guild.emojis.forEach((emoji) => {
        if (emoji.name?.toLowerCase().startsWith(searchString)) {
          flatMapResult.push([emoji.id??"-", emoji.name, guildId, guild.guildName ?? '']);
        }
      });
    }
  
    return flatMapResult;
  };*/

type EmojiResult = {
  guildId: string
  guildName: string
} & APIEmoji
export const ChatTextBox = () => {
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
            action: "dm_message",
            messageId: "376203962204028939",
            message: text,
          })
        )
        setText("")
      default:
        break
    }
  }
  const test = createWsMessage({
    action: "dm_message",
    messageId: "376203962204028939",
    message: text,
  })

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

export const EmojiAutocomplete = ({
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
  const { data } = useMyQuery<Record<string, APIGuild>>(["list_guilds"])
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

// const useTextBox = () => {
//   const inputRef = useRef<HTMLInputElement | null>(null)
//   const { data } = useMyQuery<Record<string, APIGuild>>(["list_guilds"])
//   const [emotesFound, setEmotesFound] = useState<EmojiResult[]>([])
//   const [emoteSuggest, setEmoteSuggest] = useState("")

//   const evaluateInput = () => {
//     const newCursorPosition = inputRef.current?.selectionStart ?? 0
//     const word = extractWordAtIndex(newCursorPosition)

//     if (
//       word &&
//       word.length >= 3 &&
//       word.startsWith(":") &&
//       !word.endsWith(":")
//     ) {
//       setEmoteSuggest(word.substring(1))
//     } else {
//       setEmoteSuggest("")
//     }
//   }

//   const extractWordAtIndex = (index: number) => {
//     const words = (inputRef.current?.value ?? "").split(" ")
//     let currentPos = 0

//     for (let i = 0; i < words.length; i++) {
//       const word = words[i]
//       const wordLength = word?.length ?? 0

//       if (index >= currentPos && index <= currentPos + wordLength) {
//         return word
//       }

//       currentPos += wordLength + 1
//     }
//     return ""
//   }

//   const searchEmojisByName = useCallback(
//     (searchString: string) => {
//       if (!data || searchString.length < 3) {
//         emotesFound.length > 0 && setEmotesFound([])
//         return
//       }

//       const flatMapResult: EmojiResult[] = []

//       for (const guildId in data) {
//         const guild = data[guildId]
//         if (!guild) continue

//         guild.emojis.forEach((emoji) => {
//           if (emoji.name?.toLowerCase().startsWith(searchString)) {
//             const emojiResult: EmojiResult = {
//               guildId,
//               guildName: guild.name,
//               ...emoji,
//             }
//             flatMapResult.push(emojiResult)
//           }
//         })
//       }

//       setEmotesFound(flatMapResult)
//     },
//     [data, emotesFound.length]
//   )

//   useEffect(() => {
//     searchEmojisByName(emoteSuggest)
//   }, [emoteSuggest, searchEmojisByName])

//   return {
//     inputRef,
//     evaluateInput,
//     emotesFound,
//   }
// }
