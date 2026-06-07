import type { PropsWithChildren, ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { cn } from '@/lib/utils';

interface FormFieldProps {
    label: string;
    htmlFor?: string;
    error?: string;
    required?: boolean;
    /** Span both columns */
    full?: boolean;
    hint?: ReactNode;
}

export function FormField({ label, htmlFor, error, required, full, hint, children }: PropsWithChildren<FormFieldProps>) {
    return (
        <div className={cn('space-y-2', full && 'sm:col-span-2')}>
            <Label htmlFor={htmlFor}>
                {label}
                {required && <span className="ml-0.5 text-destructive">*</span>}
            </Label>
            {children}
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
            <InputError message={error} />
        </div>
    );
}
