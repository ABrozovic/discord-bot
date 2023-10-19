import { useEffect, useRef } from "react"
import { useBoundStore } from "@/store/slices"

const useScrollToBottomEffect = (items: any[] | undefined) => {
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)
  const isScrollbarAtBottom = useRef(true)

  useEffect(() => {
    const container = scrollAreaRef.current
    if (!container) return

    const handleScroll = () => {
      const isAtBottom =
        container.scrollHeight - container.clientHeight <=
        container.scrollTop + 1

      const tolerance = 5
      isScrollbarAtBottom.current =
        isAtBottom || container.scrollHeight - container.scrollTop <= tolerance
    }

    container.addEventListener("scroll", handleScroll)
    container.scrollTo({ top: container.scrollHeight })
    return () => {
      container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    const container = scrollAreaRef.current
    if (!container || !isScrollbarAtBottom.current) return

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "instant",
    })
  }, [items])

  return { scrollAreaRef }
}

export default useScrollToBottomEffect
