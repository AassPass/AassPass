import { useEffect, useState } from "react"

export function useDrawerDirection() {
  const [direction, setDirection] = useState("right")

  useEffect(() => {
    const updateDirection = () => {
      setDirection(window.innerWidth < 640 ? "bottom" : "right") // Tailwind 'sm' breakpoint = 640px
    }

    updateDirection() // set on first render
    window.addEventListener("resize", updateDirection)
    return () => window.removeEventListener("resize", updateDirection)
  }, [])

  return direction
}
