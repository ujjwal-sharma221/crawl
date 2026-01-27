'use client'

import { type User } from 'better-auth'
import { Link } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import { Bookmark01Icon } from '@hugeicons/core-free-icons'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavUser } from '@/components/nav-user'
import { SidebarPrimary } from '@/modules/dashboard/components/sidebar-primary'

interface AppSidebarProps {
  user: User
}

export function AppSidebar({ user }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard" className="flex items-center gap-3">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <HugeiconsIcon className="size-4" icon={Bookmark01Icon} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font-medium">Crawl</span>
                  <span className="text-xs">Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarPrimary />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
