import { Link } from '@inertiajs/react';
import {
    Building,
    Car,
    FileStack,
    FileText,
    FolderGit2,
    GraduationCap,
    LayoutGrid,
    List,
    Timeline,
    User
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import {dashboard} from '@/routes/client';
import {index as templatesIndex} from '@/routes/client/templates';
import {index as documentsIndex} from '@/routes/client/documents';
import type { NavItem } from '@/types';
import FlashToaster from "@/components/flash-toaster";

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Document Templates',
        href: templatesIndex(),
        icon: FileStack,
    },
    {
        title: 'Documents',
        href: documentsIndex(),
        icon: FileText,
    },
    {
        title: 'Assets Register',
        href: '#',
        icon: List,
    },
    {
        title: 'Fleet Management',
        href: '#',
        icon: Car,
    },
    {
        title: 'Personnel',
        href: '#',
        icon: User,
    },
    {
        title: 'Sites',
        href: '#',
        icon: Building,
    },
    {
        title: 'Training',
        href: '#',
        icon: GraduationCap,
    },
    {
        title: 'Projects',
        href: '#',
        icon: Timeline,
    }
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/jam-esss/laravel-safety-portal',
        icon: FolderGit2,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
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

            <FlashToaster />
        </Sidebar>
    );
}
