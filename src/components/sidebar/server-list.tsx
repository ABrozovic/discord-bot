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
      <ul role="server-tree" className="flex flex-col">
        <ServerListItem id="0" />
      </ul>
    </nav>
  )
}

export default ServerList
