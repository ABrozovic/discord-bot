"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"

import { cn } from "@/lib/utils"
import Icons from "@/components/icons"
import NavTooltip from "@/components/nav-tooltip"
import { Typography } from "@/components/typography"

const serverItems = { DISCORD: "DISCORD", DM: "DM", SERVER: "SERVER" } as const

type KeyOfServerItems = keyof typeof serverItems

type ServerItemProps = {
  id: string
  label: string
  type: KeyOfServerItems
  src?: string
}

const ServerListItem = ({ id, label, type, src }: ServerItemProps) => {
  const { serverId } = useParams()

  const isSelected = id === serverId

  const itemOptions: Record<KeyOfServerItems, JSX.Element> = {
    DISCORD: (
      <Icons.discord
        className={cn(
          "text-gray-300 transition-colors group-hover:text-white",
          { "text-white": isSelected }
        )}
      />
    ),
    SERVER: src ? (
      <Image src={src} alt={`${label}'s server icon`} width={96} height={96} />
    ) : (
      <Typography variant="h5" as="h3">
        {label.charAt(0)}
      </Typography>
    ),
    DM: <></>,
  }
  const ServerListItem = itemOptions[type]
  return (
    <>
      <Link href={`/server/${id}`}>
        <NavTooltip label={label} side="right" align="center" sideOffset={7}>
          <li className="group relative">
            <div className="flex h-full items-center justify-start">
              <span
                className={cn(
                  "absolute -ml-1 h-2 w-2 rounded-r bg-primary transition-all dark:bg-white",
                  {
                    "h-10": isSelected,
                    "group-hover:h-5": !isSelected,
                  }
                )}
              />

              <div
                className={cn(
                  "mx-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-primary",
                  { "bg-primary rounded-[16px]": isSelected }
                )}
              >
                {ServerListItem}
              </div>
            </div>
          </li>
        </NavTooltip>
      </Link>
    </>
  )
}

export default ServerListItem
