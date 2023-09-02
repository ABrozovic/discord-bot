import { cn } from "@/lib/utils"

import ServerListItem from "./server-list-item"

const ServerList = ({ className }: { className?: string }) => {
  return (
    <nav
      className={cn(
        "fixed inset-y-0 hidden w-[72px] bg-tertiary-background py-2 md:block",
        className
      )}
    >
      <ServerListItem id="0" />
    </nav>
  )
}

export default ServerList
