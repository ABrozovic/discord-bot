"use client"

import Link from "next/link"
import { useBoundStore } from "@/store/slices"

import { cn } from "@/lib/utils"

import Icons from "../icons"

type ServerChannelProps = {
  id: string
  label: string
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLLIElement>, HTMLLIElement>

export const ServerChannel = ({ id, label, ...props }: ServerChannelProps) => {
  const activeChannel = useBoundStore((state) => state.zactiveChannel)

  const activeGuild = useBoundStore((state) => state.zactiveGuild)

  return (
    <li className="ml-2 py-[1px]" {...props}>
      <Link href={`/server/${activeGuild}/${id}`}>
        <div className="relative flex cursor-pointer items-center">
          <Icons.hash className="mr-2 h-4 w-4" />
          <div
            className={cn("truncate hover:text-pink-500", {
              "text-red-500": activeChannel === id,
            })}
          >
            {label}
          </div>
        </div>
      </Link>
    </li>
  )
}
