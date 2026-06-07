import type { PropsWithChildren } from 'react';

export function FormActions({ children }: PropsWithChildren) {
    return <div className="flex items-center justify-end gap-3 border-t pt-4">{children}</div>;
}
