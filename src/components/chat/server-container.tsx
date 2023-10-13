"use client"

import type React from "react"

const ServerContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="relative flex flex-1 items-stretch justify-start">
        {children}
      </div>
    </div>
  )
}

export default ServerContainer
