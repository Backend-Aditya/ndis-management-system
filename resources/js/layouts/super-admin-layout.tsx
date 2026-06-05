import { Link } from '@inertiajs/react';
import { Building2, LayoutDashboard } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useCurrentUrl } from '@/hooks/use-current-url';

const navItems = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { title: 'Tenants', href: '/super-admin/tenants', icon: Building2 },
];

export default function SuperAdminLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="flex min-h-screen">
            <aside className="w-60 border-r bg-sidebar flex flex-col gap-1 p-3 shrink-0">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Super Admin
                </div>
                <Separator className="mb-2" />
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent transition-colors',
                            isCurrentOrParentUrl(item.href) &&
                                'bg-sidebar-accent text-sidebar-accent-foreground'
                        )}
                    >
                        <item.icon className="size-4" />
                        {item.title}
                    </Link>
                ))}
            </aside>
            <main className="flex-1 p-8 overflow-auto">{children}</main>
        </div>
    );
}
