import { cn } from "@/lib/utils"

import { ScrollArea } from "../ui/scroll-area"
import { Separator } from "../ui/separator"
import ServerList from "./server-list-client"
import ServerListItem from "./server-list-item"

const ServerTree = ({ className }: { className?: string }) => {
  return (
    <nav className={cn("w-[72px] bg-tertiary-background", className)}>
      <ul role="server-tree" className="flex h-full flex-col pt-3">
        <div className="flex flex-col">
          <ServerListItem id="DMs" label="Direct Messages" type="DISCORD" />
        </div>
        <Separator className="mx-auto my-2 h-[2px] w-8 rounded bg-background" />
        <ScrollArea>
          <ServerList />
        </ScrollArea>
      </ul>
    </nav>
  )
}

export default ServerTree
