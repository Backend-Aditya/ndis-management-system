import { router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCurrentUrl } from '@/hooks/use-current-url';

interface DataTableToolbarProps {
    searchPlaceholder?: string;
}

export function DataTableToolbar({ searchPlaceholder = 'Search...' }: DataTableToolbarProps) {
    const { currentUrl } = useCurrentUrl();
    const fullUrl = typeof window !== 'undefined'
        ? window.location.href
        : `http://localhost${currentUrl}`;
    const initialSearch = new URL(fullUrl).searchParams.get('search') ?? '';
    const [search, setSearch] = useState(initialSearch);

    const doSearch = useCallback((value: string) => {
        router.get(
            currentUrl,
            value ? { search: value } : {},
            { preserveState: true, replace: true }
        );
    }, [currentUrl]);

    return (
        <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && doSearch(search)}
                    className="pl-9"
                />
            </div>
            {search && (
                <Button variant="ghost" size="sm" onClick={() => { setSearch(''); doSearch(''); }}>
                    <X className="size-4 mr-1" /> Clear
                </Button>
            )}
        </div>
    );
}
