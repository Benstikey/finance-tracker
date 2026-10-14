import * as React from "react"

import { cn } from "@/lib/utils"

const base =
  "transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)]"
const shown = "scale-100 opacity-100 blur-0"
const hidden = "scale-[0.25] opacity-0 blur-[4px]"

// Cross-fades between two icons. Both stay mounted so enter and exit animate.
function IconSwap({
  active,
  activeIcon,
  inactiveIcon,
  className,
}: {
  active: boolean
  activeIcon: React.ReactNode
  inactiveIcon: React.ReactNode
  className?: string
}) {
  return (
    <span className={cn("relative inline-flex", className)}>
      <span
        aria-hidden={!active}
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          base,
          active ? shown : hidden
        )}
      >
        {activeIcon}
      </span>
      <span
        aria-hidden={active}
        className={cn("flex items-center justify-center", base, active ? hidden : shown)}
      >
        {inactiveIcon}
      </span>
    </span>
  )
}

export { IconSwap }
