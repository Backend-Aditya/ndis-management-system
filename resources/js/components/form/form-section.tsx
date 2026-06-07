import type { PropsWithChildren } from 'react';

interface FormSectionProps {
    title: string;
    description?: string;
}

export function FormSection({ title, description, children }: PropsWithChildren<FormSectionProps>) {
    return (
        <div className="space-y-4 rounded-lg border bg-card p-6">
            <div className="space-y-1">
                <h2 className="text-base font-semibold">{title}</h2>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">{children}</div>
        </div>
    );
}
