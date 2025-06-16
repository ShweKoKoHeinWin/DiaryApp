import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpenText, Calendar, FileImageIcon, Grid2x2, House, Inbox, ListCheck, ListPlus, NotebookText, PackageOpen, SmilePlus, SquareArrowOutUpRight, Users } from 'lucide-react';
import AppLogo from './app-logo';

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];


const mainNavItems: NavItem[] = [
    {
        title: 'Home',
        href: 'home',
        icon: House,
    },
    {
        title: 'Calender',
        href: 'calendar',
        icon: Calendar,
    },
    {
        title: 'Diaries',
        href: 'diaries',
        icon: BookOpenText,
        children: [
            {
                title: 'Index',
                href: 'diaries.index',
                icon: ListCheck
            },
            {
                title: 'Create',
                href: 'diaries.create',
                icon: ListPlus
            },
        ],
    },
    {
        title: 'Collections',
        href: 'collections.index',
        icon: NotebookText,
    },
    {
        title: 'Categories',
        href: 'categories.index',
        icon: Grid2x2,
    },
    {
        title: 'Emotions',
        href: 'emotions.index',
        icon: SmilePlus,
    },
    // {
    //     title: 'Files',
    //     href: 'files.index',
    //     icon: FileImageIcon,
    // },
    {
        title: 'Inbox & Shares',
        href: 'inbox-shares',
        icon: PackageOpen,
        children: [
            {
                title: 'Users',
                href: 'inbox-shares.users',
                icon: Users,
            },
            {
                title: 'Inbox',
                href: 'inbox-shares.inbox',
                icon: Inbox
            },
            {
                title: 'Shares',
                href: 'inbox-shares.shares',
                icon: SquareArrowOutUpRight
            }
        ]
    }
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
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
