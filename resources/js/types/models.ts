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

export interface Participant {
    id: string;
    ndis_number: string;
    first_name: string;
    last_name: string;
    full_name: string;
    date_of_birth: string | null;
    gender: string | null;
    pronouns: string | null;
    address: string | null;
    suburb: string | null;
    state: string | null;
    postcode: string | null;
    primary_language: string | null;
    interpreter_required: boolean;
    communication_needs: string | null;
    cultural_background: string | null;
    participant_status: 'active' | 'inactive' | 'pending';
    created_at: string;
    contacts?: ParticipantContact[];
    goals?: ParticipantGoal[];
    diagnoses?: ParticipantDiagnosis[];
}

export interface ParticipantContact {
    id: string;
    participant_id: string;
    relationship: string | null;
    first_name: string;
    last_name: string;
    phone: string | null;
    email: string | null;
    is_emergency: boolean;
    is_authorised_rep: boolean;
}

export interface ParticipantGoal {
    id: string;
    participant_id: string;
    goal_text: string;
    category: string | null;
    status: 'active' | 'completed' | 'on_hold';
    target_date: string | null;
    progress_notes: string | null;
}

export interface ParticipantDiagnosis {
    id: string;
    participant_id: string;
    diagnosis_name: string;
    icd_10_code: string | null;
    diagnosed_date: string | null;
    is_primary: boolean;
}
