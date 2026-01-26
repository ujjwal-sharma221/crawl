import {
  DiscoverCircleIcon,
  Download02Icon,
  GroupLayersIcon,
} from '@hugeicons/core-free-icons'
import { Link, linkOptions } from '@tanstack/react-router'
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const primaryItems = linkOptions([
  {
    title: 'Items',
    to: '/dashboard/items',
    icon: GroupLayersIcon,
    activeOptions: { exact: false },
  },
  {
    title: 'Import',
    to: '/dashboard/import',
    icon: Download02Icon,
    activeOptions: { exact: false },
  },
  {
    title: 'Discover',
    to: '/dashboard/discover',
    icon: DiscoverCircleIcon,
    activeOptions: { exact: false },
  },
])

export function SidebarPrimary() {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {primaryItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild size="sm">
                <Link
                  to={item.to}
                  activeOptions={item.activeOptions}
                  activeProps={{
                    'data-active': true,
                  }}
                >
                  <Icon icon={item.icon} />
                  {item.title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

const Icon = ({ icon }: { icon: IconSvgElement }) => {
  return <HugeiconsIcon icon={icon} />
}
