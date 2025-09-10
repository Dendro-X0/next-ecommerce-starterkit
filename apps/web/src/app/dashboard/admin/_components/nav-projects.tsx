"use client"

import { Folder, Forward, type LucideIcon, MoreHorizontal, Trash2 } from "lucide-react"
import { AppLink } from "../../../../../modules/shared/components/app-link"
import type React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@components/ui/sidebar"

/**
 * NavProjects renders the Settings & Tools sidebar group.
 * Disabled items are hidden. If all are disabled, the group is omitted.
 */
export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
    disabled?: boolean
  }[]
}): React.ReactElement {
  const { isMobile } = useSidebar()

  const enabled: { name: string; url: string; icon: LucideIcon; disabled?: boolean }[] =
    projects.filter((p) => !p.disabled)
  if (enabled.length === 0) return <></>

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Settings & Tools</SidebarGroupLabel>
      <SidebarMenu>
        {enabled.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <AppLink href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </AppLink>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Reset to Default</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
