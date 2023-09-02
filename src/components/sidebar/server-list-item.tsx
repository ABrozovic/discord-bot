import { cn } from "../../lib/utils"
import Icons from "../icons"

type ServerItem = {
  id: string
}

const ServerListItem = ({ id }: ServerItem) => {
  const selectedId = "0"
  const isSelected = id === selectedId
  return (
    <div className="flex flex-col ">
      <div className="group">
        <div
          className={cn(
            "mx-3  flex h-12 w-12 items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-primary",
            { "bg-primary rounded-[16px]": isSelected }
          )}
        >
          <Icons.discord
            className={cn(
              "m-auto text-gray-300 transition-colors group-hover:text-white",
              { "text-white": isSelected }
            )}
          />
        </div>
      </div>
    </div>
  )
}

export default ServerListItem
