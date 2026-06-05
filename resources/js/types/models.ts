export interface Tenant {
    id: string;
    name: string;
    slug: string;
    plan: string;
    status: 'active' | 'trialing' | 'suspended';
    abn: string | null;
    ndis_provider_number: string | null;
    contact_email: string;
    contact_phone: string | null;
    trial_ends_at: string | null;
    created_at: string;
}

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    phone: string | null;
    is_active: boolean;
    last_login_at: string | null;
    roles: string[];
    avatar_url: string | null;
    tenant_id: string | null;
}

export interface StaffProfile {
    id: string;
    user_id: string;
    employee_number: string | null;
    position: string | null;
    department: string | null;
    employment_type: string | null;
    employment_start: string | null;
    employment_end: string | null;
    hourly_rate: string | null;
    kms_rate: string | null;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export interface PaginatedResource<T> {
    data: T[];
    meta: PaginationMeta;
}
