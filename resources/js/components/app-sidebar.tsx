import { Link, usePage } from '@inertiajs/react';
import {
    Accessibility,
    Banknote,
    BookOpen,
    Building2,
    CalendarDays,
    CalendarOff,
    ClipboardCheck,
    ClipboardList,
    CreditCard,
    FileCheck,
    FileText,
    FileWarning,
    KeyRound,
    LayoutGrid,
    Megaphone,
    MessageSquare,
    Receipt,
    ScrollText,
    ShieldAlert,
    ShieldCheck,
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
import type { NavGroup } from '@/types';

const superAdminGroups: NavGroup[] = [
    {
        label: 'Platform',
        items: [{ title: 'Dashboard', href: '/dashboard', icon: LayoutGrid }],
    },
    {
        label: 'Super Admin',
        items: [
            { title: 'Organisations', href: '/super-admin/tenants', icon: Building2 },
            { title: 'Platform Admins', href: '/super-admin/platform-admins', icon: ShieldCheck },
            { title: 'Roles & Permissions', href: '/super-admin/roles', icon: KeyRound },
        ],
    },
];

const tenantGroups: NavGroup[] = [
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
        label: 'Compliance',
        items: [
            { title: 'Incidents', href: '/incidents', icon: ShieldAlert },
            { title: 'Risk Assessments', href: '/risk-assessments', icon: FileWarning },
            { title: 'Behaviour Plans', href: '/behaviour-support-plans', icon: ClipboardCheck },
            { title: 'Audits', href: '/audits', icon: FileCheck },
        ],
    },
    {
        label: 'Communications',
        items: [
            { title: 'Messages', href: '/messages', icon: MessageSquare },
            { title: 'Announcements', href: '/announcements', icon: Megaphone },
            { title: 'Audit Logs', href: '/audit-logs', icon: ScrollText },
        ],
    },
    {
        label: 'Team',
        items: [{ title: 'Staff', href: '/staff', icon: Users }],
    },
];

export function AppSidebar() {
    const page = usePage<{ auth: { roles: string[] } }>();
    const roles = page.props.auth?.roles ?? [];
    const isSuperAdmin = roles.includes('super_admin');
    const groups = isSuperAdmin ? superAdminGroups : tenantGroups;

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
                <NavMain groups={groups} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
