import ServerTree from "@/components/sidebar/server-tree"

const IndexLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full w-full">
      <Sidebar>
        <ServerTree />
      </Sidebar>

      {children}
    </div>
  )
}

export default IndexLayout

const Sidebar = ({ children }: { children: React.ReactNode }) => (
  <div className="inset-y-0 z-30 flex h-full flex-row">{children}</div>
)
