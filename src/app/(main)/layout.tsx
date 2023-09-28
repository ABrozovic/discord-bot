import ServerList from "@/components/sidebar/server-list"

const IndexLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full ">
      <Sidebar>
        <ServerList />
      </Sidebar>

      {children}
    </div>
  )
}

export default IndexLayout

const Sidebar = ({ children }: { children: React.ReactNode }) => <>{children}</>
