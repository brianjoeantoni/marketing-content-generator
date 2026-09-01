"use client"

import * as React from "react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  HistoryIcon,
  ImagePlusIcon,
  LayoutDashboardIcon,
  WavesIcon,
} from "lucide-react"

const data = {
  teams: [
    {
      name: "MCG",
      logo: (
        <WavesIcon
        />
      ),
      plan: "Marketing workspace",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <LayoutDashboardIcon
        />
      ),
      isActive: true,
    },
    {
      title: "Create Poster",
      url: "/create-poster",
      icon: (
        <ImagePlusIcon
        />
      ),
    },
    {
      title: "History",
      url: "/history",
      icon: (
        <HistoryIcon
        />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
