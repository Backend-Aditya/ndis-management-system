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

export interface NdisPlan {
    id: string;
    participant_id: string;
    plan_number: string | null;
    plan_start_date: string | null;
    plan_end_date: string | null;
    plan_type: string | null;
    management_type: 'agency_managed' | 'plan_managed' | 'self_managed';
    core_total: string | null;
    capacity_total: string | null;
    capital_total: string | null;
    total_funding: string | null;
    status: 'active' | 'expired' | 'pending';
    ndia_contact_name: string | null;
    ndia_contact_phone: string | null;
    participant?: { id: string; full_name: string; ndis_number: string };
    support_categories?: PlanSupportCategory[];
    managers?: PlanManager[];
    created_at: string;
}

export interface PlanSupportCategory {
    id: string;
    plan_id: string;
    support_purpose: string;
    category_name: string;
    allocated_amount: string;
    spent_amount: string;
    items?: PlanSupportItem[];
}

export interface PlanSupportItem {
    id: string;
    support_item_number: string | null;
    support_item_name: string;
    unit_of_measure: string | null;
    unit_price: string;
    quantity_allocated: string;
    quantity_used: string;
}

export interface PlanManager {
    id: string;
    manager_type: string;
    company_name: string | null;
    contact_name: string | null;
    email: string | null;
    abn: string | null;
}

export interface ServiceType {
    id: string;
    ndis_support_item_number: string | null;
    name: string;
    support_category: string | null;
    unit_of_measure: string | null;
    standard_rate: string;
    weeknight_rate: string | null;
    saturday_rate: string | null;
    sunday_rate: string | null;
    public_holiday_rate: string | null;
    is_active: boolean;
}

export interface ServiceAgreement {
    id: string;
    participant_id: string;
    plan_id: string;
    agreement_start: string | null;
    agreement_end: string | null;
    status: string;
    signed_by_participant: string | null;
    signed_date: string | null;
    participant?: { id: string; full_name: string };
    items?: ServiceAgreementItem[];
}

export interface ServiceAgreementItem {
    id: string;
    service_type_id: string;
    service_type_name: string | null;
    quantity_agreed: string;
    unit_price: string;
    frequency: string | null;
}
