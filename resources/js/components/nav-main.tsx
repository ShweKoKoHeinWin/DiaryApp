import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const routeName = usePage().props.routeName || '';
    
    return (
        <SidebarGroup className="">
            {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
            <SidebarMenu>
                {/* {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={(item.href === page.url || (page.url.startsWith(item.href)))} tooltip={{ children: item.title }}>
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                        {item.children && item.children.length > 0 && (
                            <div className="ml-4 border-l">
                                <NavMain items={item.children} />
                            </div>
                        )}
                    </SidebarMenuItem>
                ))} */}
                {items.map((item) => {
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={item.href === routeName || routeName.startsWith(item.href)}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={route(item.href, undefined, false)} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                            {/* Render children recursively if present */}
                            {item.children && item.children.length > 0 && (
                                <div className="ml-4 border-l">
                                    <NavMain items={item.children} />
                                </div>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
