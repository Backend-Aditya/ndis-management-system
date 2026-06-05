import { Link } from '@inertiajs/react';
import {
    Accessibility,
    BookOpen,
    Calendar,
    CreditCard,
    FileText,
    FolderGit2,
    LayoutGrid,
    MessageSquare,
    Shield,
    Users,
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
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    { title: 'Participants', href: '/participants', icon: Accessibility },
    { title: 'Scheduling', href: '/scheduling', icon: Calendar },
    { title: 'Plans & Funding', href: '/plans', icon: FileText },
    { title: 'Services', href: '/services', icon: BookOpen },
    { title: 'Billing & Claims', href: '/billing', icon: CreditCard },
    { title: 'Compliance', href: '/compliance', icon: Shield },
    { title: 'Staff', href: '/staff', icon: Users },
    { title: 'Communications', href: '/communications', icon: MessageSquare },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
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
        </Sidebar>
    );
}
