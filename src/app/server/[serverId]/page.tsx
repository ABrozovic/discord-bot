import ServerContainer from "@/components/chat/server-container"
import ServerInfo from "@/components/chat/server-information"
import { Chat } from "@/app/(main)/page"

const ServerPage = () => {
  return (
    <ServerContainer>
      <ServerInfo />
      <Chat />
    </ServerContainer>
  )
}

export default ServerPage
