import { Link } from '@inertiajs/react';
import {
    Accessibility,
    Banknote,
    BookOpen,
    CalendarDays,
    CalendarOff,
    ClipboardList,
    CreditCard,
    FileText,
    FolderGit2,
    LayoutGrid,
    Receipt,
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
import type { NavGroup, NavItem } from '@/types';

const navGroups: NavGroup[] = [
    {
        label: 'Platform',
        items: [{ title: 'Dashboard', href: dashboard(), icon: LayoutGrid }],
    },
    {
        label: 'Care Management',
        items: [
            { title: 'Participants', href: '/participants', icon: Accessibility },
            { title: 'NDIS Plans', href: '/plans', icon: FileText },
        ],
    },
    {
        label: 'Services',
        items: [
            { title: 'Service Types', href: '/service-types', icon: BookOpen },
            { title: 'Service Agreements', href: '/service-agreements', icon: ClipboardList },
        ],
    },
    {
        label: 'Scheduling',
        items: [
            { title: 'Shifts', href: '/shifts', icon: CalendarDays },
            { title: 'Leave Requests', href: '/leave', icon: CalendarOff },
        ],
    },
    {
        label: 'Billing & Claims',
        items: [
            { title: 'Invoices', href: '/invoices', icon: Receipt },
            { title: 'NDIS Claims', href: '/claims', icon: CreditCard },
            { title: 'Payments', href: '/payments', icon: Banknote },
        ],
    },
    {
        label: 'Team',
        items: [{ title: 'Staff', href: '/staff', icon: Users }],
    },
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
                <NavMain groups={navGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
