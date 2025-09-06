"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import React from "react"
import { BsLaptop, BsMoon, BsSun } from "react-icons/bs"

export function ThemeToggle(): React.ReactElement {
  const [mounted, setMounted] = React.useState(false)
  const { setTheme, theme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-10 w-[108px] border rounded-full p-1" />
  }

  const themes = [
    { name: "light", icon: BsSun },
    { name: "system", icon: BsLaptop },
    { name: "dark", icon: BsMoon },
  ]

  return (
    <div className="border rounded-full p-1 flex items-center gap-1">
      {themes.map((t) => (
        <Button
          key={t.name}
          variant="ghost"
          size="icon"
          className={cn(
            "rounded-full h-8 w-8",
            // Hide the System option on small screens to shorten the control
            t.name === "system" && "hidden sm:inline-flex",
            theme === t.name && "bg-accent text-accent-foreground",
          )}
          onClick={() => setTheme(t.name)}
          aria-label={`Switch to ${t.name} mode`}
        >
          <t.icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  )
}
