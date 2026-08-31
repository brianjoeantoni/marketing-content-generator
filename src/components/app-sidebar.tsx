"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  GalleryHorizontalEndIcon,
  HistoryIcon,
  ImagePlusIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  Settings2Icon,
  WavesIcon,
} from "lucide-react"

const data = {
  user: {
    name: "Demo User",
    email: "owner@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Poster Studio",
      logo: (
        <WavesIcon
        />
      ),
      plan: "Frontend prototype",
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
      items: [
        {
          title: "Create poster",
          url: "/dashboard",
        },
        {
          title: "Generation status",
          url: "/dashboard",
        },
        {
          title: "Poster history",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Posters",
      url: "/dashboard",
      icon: (
        <ImagePlusIcon
        />
      ),
      items: [
        {
          title: "Beach template",
          url: "/dashboard",
        },
        {
          title: "Generated image",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "History",
      url: "/dashboard",
      icon: (
        <HistoryIcon
        />
      ),
      items: [
        {
          title: "Previous generations",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard",
      icon: (
        <Settings2Icon
        />
      ),
      items: [
        {
          title: "Mock account",
          url: "/dashboard",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Template preview",
      url: "/dashboard",
      icon: (
        <GalleryHorizontalEndIcon
        />
      ),
    },
    {
      name: "Backend later",
      url: "/dashboard",
      icon: (
        <LifeBuoyIcon
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
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
