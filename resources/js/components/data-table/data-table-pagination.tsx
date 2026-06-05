import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PaginationMeta } from '@/types/models';

export function DataTablePagination({ meta }: { meta: PaginationMeta }) {
    const base = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    const pageUrl = (page: number) => {
        const p = new URLSearchParams(params);
        p.set('page', String(page));
        return `${base}?${p.toString()}`;
    };

    return (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {meta.from}–{meta.to} of {meta.total}</span>
            <div className="flex items-center gap-1">
                {meta.current_page > 1 ? (
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={pageUrl(meta.current_page - 1)}><ChevronLeft className="size-4" /></Link>
                    </Button>
                ) : (
                    <Button variant="ghost" size="icon" disabled><ChevronLeft className="size-4" /></Button>
                )}
                <span className="px-2">Page {meta.current_page} of {meta.last_page}</span>
                {meta.current_page < meta.last_page ? (
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={pageUrl(meta.current_page + 1)}><ChevronRight className="size-4" /></Link>
                    </Button>
                ) : (
                    <Button variant="ghost" size="icon" disabled><ChevronRight className="size-4" /></Button>
                )}
            </div>
        </div>
    );
}
