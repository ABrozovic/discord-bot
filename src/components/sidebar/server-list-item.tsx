import { cn } from "../../lib/utils"
import Icons from "../icons"
import NavTooltip from "../nav-tooltip"

type ServerItem = {
  id: string
}

const ServerListItem = ({ id }: ServerItem) => {
  const selectedId = "10"
  const isSelected = id === selectedId
  return (
    <>
      <NavTooltip label="something" side="left" align="center">
        <li className="group">
          <div
            className={cn(
              "mx-3 h-12 w-12 overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-primary",
              { "bg-primary rounded-[16px]": isSelected }
            )}
          >
            <Icons.discord
              className={cn(
                "m-auto h-full text-gray-300 transition-colors group-hover:text-white",
                { "text-white": isSelected }
              )}
            />
          </div>
        </li>
      </NavTooltip>
    </>
  )
}

export default ServerListItem
