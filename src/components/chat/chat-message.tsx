"use client"

import { useState } from "react"
import Image from "next/image"
import Balancer from "react-wrap-balancer"

import { formatTimestamp } from "@/lib/utils"
import { Typography } from "@/components/typography"

import { EmojiContainer } from "./chat-container"

type ChatMessageProps = {
  avatar: string
  fallbackAvatar: string
  author: string
  time: string
  content: string
}
export const ShortChatMessage = ({ content }: { content: string }) => {
  return (
    <li className="relative">
      <div className="py-0.5 pl-[72px] pr-12">
        <div className="static">
          <div className="relative  overflow-hidden ">
            <Balancer className="baseline">
              <ParsedMessage content={content} />
            </Balancer>
          </div>
        </div>
      </div>
    </li>
  )
}

export const ChatMessage = ({
  avatar,
  fallbackAvatar,
  author,
  time,
  content,
}: ChatMessageProps) => {
  const [error, setError] = useState<boolean>()
  // TODO: Message parsing, emojis, etc..
  return (
    <li className="relative">
      <div className="mt-4 min-h-[44px] py-0.5 pl-[72px] pr-12">
        <div className="static">
          <Image
            className="absolute left-4 mt-0.5 cursor-pointer rounded-full"
            onError={(e) => setError(true)}
            src={error ? fallbackAvatar : avatar}
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
              <ParsedMessage content={content} />
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
const ParsedMessage = ({ content }: { content: string }) => {
  const specialSplit = /\<(.*?)\>/g
  const gifEmotes = /<(a:[A-Za-z0-9_]+:\d+)>/g
  const webpEmotes = /<(:[A-Za-z0-9_]+:\d+)>/g

  const segments = content.split(specialSplit).filter(Boolean)

  const parsedContent = (
    <>
      {segments.map((segment, index) => {
        if (webpEmotes.test(`<${segment}>`)) {
          const size = segments.length == 1 ? 48 : 22
          return (
            <EmojiContainer size={size} key={index} emoji={segment} alt="" />
          )
        } else if (gifEmotes.test(`<${segment}>`)) {
          const size = segments.length == 1 ? 48 : 22
          return (
            <EmojiContainer
              size={size}
              key={index}
              emoji={segment}
              isAnimated={true}
              alt=""
            />
          )
        } else {
          return <span key={index}>{segment}</span>
        }
      })}
    </>
  )
  return <>{parsedContent}</>
}
