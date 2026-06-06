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

export interface Shift {
    id: string;
    participant_id: string;
    staff_id: string;
    service_type_id: string;
    scheduled_start: string | null;
    scheduled_end: string | null;
    actual_start: string | null;
    actual_end: string | null;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    location: string | null;
    requires_transport: boolean;
    kms_travelled: string | null;
    notes: string | null;
    participant?: { id: string; full_name: string };
    staff?: { id: string; full_name: string };
    service_type?: { id: string; name: string };
    cancellation?: ShiftCancellation | null;
    handover_notes?: ShiftHandoverNote[];
}

export interface ShiftCancellation {
    id: string;
    cancelled_by_type: string;
    reason_code: string | null;
    reason_notes: string | null;
    billable: boolean;
}

export interface ShiftHandoverNote {
    id: string;
    shift_id: string;
    staff_id: string;
    content: string;
    status: string;
    submitted_at: string | null;
    reviewed_by: string | null;
}

export interface LeaveRequest {
    id: string;
    staff_id: string;
    leave_type: 'annual' | 'sick' | 'personal' | 'unpaid';
    start_date: string | null;
    end_date: string | null;
    hours: string | null;
    reason: string | null;
    status: 'pending' | 'approved' | 'rejected';
    approved_by: string | null;
    staff?: { id: string; full_name: string };
}

export interface Invoice {
    id: string;
    participant_id: string;
    plan_id: string;
    invoice_number: string;
    invoice_date: string | null;
    due_date: string | null;
    subtotal: string;
    gst_amount: string;
    total_amount: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
    paid_at: string | null;
    participant?: { id: string; full_name: string; ndis_number: string };
    line_items?: InvoiceLineItem[];
    payments?: Payment[];
    claim?: NdisClaim | null;
}

export interface InvoiceLineItem {
    id: string;
    invoice_id: string;
    service_type_id: string;
    shift_id: string | null;
    description: string;
    support_item_number: string | null;
    service_date: string | null;
    quantity: string;
    unit_price: string;
    line_total: string;
}

export interface NdisClaim {
    id: string;
    invoice_id: string;
    claim_reference: string | null;
    claim_type: string;
    claim_period_start: string | null;
    claim_period_end: string | null;
    claim_amount: string;
    submission_status: 'pending' | 'submitted' | 'rejected' | 'paid';
    portal_response_code: string | null;
    submitted_at: string | null;
    invoice?: { id: string; invoice_number: string };
}

export interface Payment {
    id: string;
    invoice_id: string;
    amount: string;
    payment_method: string;
    reference_number: string | null;
    payer_name: string | null;
    payment_date: string | null;
    status: string;
    invoice?: { id: string; invoice_number: string };
}

export interface Incident {
    id: string;
    participant_id: string;
    reported_by: string;
    shift_id: string | null;
    incident_type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    occurred_at: string | null;
    description: string;
    immediate_actions: string | null;
    notified_participant: boolean;
    notified_ndis_commission: boolean;
    ndis_reportable_type: string | null;
    status: 'open' | 'investigating' | 'closed';
    participant?: { id: string; full_name: string };
    reporter?: { id: string; full_name: string };
    follow_ups?: IncidentFollowUp[];
}

export interface IncidentFollowUp {
    id: string;
    incident_id: string;
    staff_id: string;
    action_taken: string;
    is_resolved: boolean;
}

export interface RiskAssessment {
    id: string;
    participant_id: string;
    risk_area: string;
    risk_description: string;
    likelihood: string;
    impact: string;
    risk_level: 'low' | 'medium' | 'high' | 'extreme';
    mitigation_strategies: string | null;
    review_date: string | null;
    participant?: { id: string; full_name: string };
}

export interface BehaviourSupportPlan {
    id: string;
    participant_id: string;
    plan_date: string | null;
    review_date: string | null;
    triggers: string | null;
    strategies: string | null;
    uses_restrictive_practices: boolean;
    restrictive_practice_type: string | null;
    status: 'active' | 'under_review' | 'expired';
    participant?: { id: string; full_name: string };
}

export interface Audit {
    id: string;
    audit_type: string;
    auditor_name: string;
    audit_date: string | null;
    next_audit_date: string | null;
    outcome: string | null;
    status: 'scheduled' | 'in_progress' | 'completed';
}

export interface Message {
    id: string;
    sender_id: string;
    subject: string;
    body: string;
    message_type: 'general' | 'urgent' | 'reminder';
    is_broadcast: boolean;
    created_at: string;
    sender?: { id: string; full_name: string };
    recipient_count?: number;
}

export interface Announcement {
    id: string;
    created_by: string;
    title: string;
    content: string;
    audience: 'all_staff' | 'managers' | 'participants' | 'everyone';
    is_pinned: boolean;
    created_at: string;
    creator?: { id: string; full_name: string };
}

export interface AuditLog {
    id: string;
    user_id: string | null;
    action: string;
    resource_type: string;
    resource_id: string | null;
    old_values: Record<string, unknown> | null;
    new_values: Record<string, unknown> | null;
    ip_address: string | null;
    created_at: string;
    user?: { id: string; full_name: string } | null;
}
