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
  align?: "start" | "center" | "end"
  delay?: number
}

const NavTooltip = ({
  label,
  side,
  align,
  delay = 50,
  children,
  ...props
}: NavTooltip) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delay}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align} {...props}>
          <Typography
            className={cn(
              "before:absolute ",
              side === "right" &&
                "before:left-[-4px] before:top-1/2 before:-translate-y-1/2 before:border-y-[5px] before:border-l-0 before:border-r-[5px] before:border-solid before:border-y-transparent before:border-r-popover",
              side === "top" &&
                "before:bottom-[-4px] before:left-1/2 before:-translate-x-1/2 before:border-x-[5px] before:border-b-0 before:border-t-[5px] before:border-solid before:border-x-transparent before:border-t-popover "
            )}
          >
            {label}
          </Typography>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default NavTooltip
