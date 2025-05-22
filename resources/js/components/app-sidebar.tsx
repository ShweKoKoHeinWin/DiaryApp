import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, BookOpenText, Calendar, Folder, Grid2x2, House, LayoutGrid, NotebookText, SmilePlus } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Home',
        href: route('home', undefined, false),
        icon: House,
    },
    {
        title: 'Calender',
        href: route('calendar', undefined, false),
        icon: Calendar,
    },
    {
        title: 'Diaries',
        href: route('diaries.index', undefined, false),
        icon: BookOpenText,
    },
    {
        title: 'Collections',
        href: '/',
        icon: NotebookText,
    },
    {
        title: 'Categories',
        href: route('categories.index', undefined, false),
        icon: Grid2x2,
    },
    {
        title: 'Emotions',
        href: route('emotions.index', undefined, false),
        icon: SmilePlus,
    },
];
console.log(mainNavItems);

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
