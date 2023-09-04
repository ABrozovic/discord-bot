import { cn } from "@/lib/utils"

import { Separator } from "../ui/separator"
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
        <div className="flex flex-col">
          <ServerListItem id="0" label="Direct Messages" type="DISCORD" />
        </div>
        <Separator className="mx-auto my-2 h-[2px] w-8 rounded bg-background" />
      </ul>
    </nav>
  )
}

export default ServerList
