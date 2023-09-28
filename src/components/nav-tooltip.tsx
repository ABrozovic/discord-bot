"use client"

import { cn } from "@/lib/utils"

import { Typography } from "./typography"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"

type NavTooltip = {
  children: React.ReactNode
  label: string
  side?: "top" | "bottom" | "right" | "left"
  sideOffset?: number
  align?: "start" | "center" | "end"
  delay?: number
}

const NavTooltip = ({
  label,
  side,
  align,
  delay = 50,
  sideOffset,
  children,
}: NavTooltip) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delay}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          sideOffset={sideOffset}
          side={side}
          align={align}
          className={cn("animate-none border-0 duration-0 before:absolute", {
            "before:left-[-4px] before:top-1/2 before:-translate-y-1/2 before:border-y-[5px] before:border-l-0 before:border-r-[5px] before:border-solid before:border-y-transparent before:border-r-popover":
              side === "right",
            "before:bottom-[-4px] before:left-1/2 before:-translate-x-1/2 before:border-x-[5px] before:border-b-0 before:border-t-[5px] before:border-solid before:border-x-transparent before:border-t-popover":
              side === "top",
          })}
        >
          <Typography>{label}</Typography>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default NavTooltip
