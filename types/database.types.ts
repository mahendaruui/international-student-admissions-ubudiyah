export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    graphql_public: {
        Tables: {
            [_ in never]: never
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            graphql: {
                Args: {
                    operationName?: string
                    query?: string
                    variables?: Json
                    extensions?: Json
                }
                Returns: Json
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
    public: {
        Tables: {
            // Original Stripe tables
            customers: {
                Row: {
                    id: string
                    stripe_customer_id: string | null
                }
                Insert: {
                    id: string
                    stripe_customer_id?: string | null
                }
                Update: {
                    id?: string
                    stripe_customer_id?: string | null
                }
                Relationships: []
            }
            prices: {
                Row: {
                    active: boolean | null
                    currency: string | null
                    description: string | null
                    id: string
                    interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
                    interval_count: number | null
                    metadata: Json | null
                    product_id: string | null
                    trial_period_days: number | null
                    type: Database["public"]["Enums"]["pricing_type"] | null
                    unit_amount: number | null
                }
                Insert: {
                    active?: boolean | null
                    currency?: string | null
                    description?: string | null
                    id: string
                    interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
                    interval_count?: number | null
                    metadata?: Json | null
                    product_id?: string | null
                    trial_period_days?: number | null
                    type?: Database["public"]["Enums"]["pricing_type"] | null
                    unit_amount?: number | null
                }
                Update: {
                    active?: boolean | null
                    currency?: string | null
                    description?: string | null
                    id?: string
                    interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
                    interval_count?: number | null
                    metadata?: Json | null
                    product_id?: string | null
                    trial_period_days?: number | null
                    type?: Database["public"]["Enums"]["pricing_type"] | null
                    unit_amount?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "prices_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    },
                ]
            }
            products: {
                Row: {
                    active: boolean | null
                    description: string | null
                    id: string
                    image: string | null
                    live_mode: boolean | null
                    marketing_features: string[] | null
                    metadata: Json | null
                    name: string | null
                }
                Insert: {
                    active?: boolean | null
                    description?: string | null
                    id: string
                    image?: string | null
                    live_mode?: boolean | null
                    marketing_features?: string[] | null
                    metadata?: Json | null
                    name?: string | null
                }
                Update: {
                    active?: boolean | null
                    description?: string | null
                    id?: string
                    image?: string | null
                    live_mode?: boolean | null
                    marketing_features?: string[] | null
                    metadata?: Json | null
                    name?: string | null
                }
                Relationships: []
            }
            subscriptions: {
                Row: {
                    cancel_at: string | null
                    cancel_at_period_end: boolean | null
                    canceled_at: string | null
                    created: string
                    current_period_end: string
                    current_period_start: string
                    ended_at: string | null
                    id: string
                    metadata: Json | null
                    price_id: string | null
                    quantity: number | null
                    status: Database["public"]["Enums"]["subscription_status"] | null
                    trial_end: string | null
                    trial_start: string | null
                    user_id: string
                }
                Insert: {
                    cancel_at?: string | null
                    cancel_at_period_end?: boolean | null
                    canceled_at?: string | null
                    created?: string
                    current_period_end?: string
                    current_period_start?: string
                    ended_at?: string | null
                    id: string
                    metadata?: Json | null
                    price_id?: string | null
                    quantity?: number | null
                    status?: Database["public"]["Enums"]["subscription_status"] | null
                    trial_end?: string | null
                    trial_start?: string | null
                    user_id: string
                }
                Update: {
                    cancel_at?: string | null
                    cancel_at_period_end?: boolean | null
                    canceled_at?: string | null
                    created?: string
                    current_period_end?: string
                    current_period_start?: string
                    ended_at?: string | null
                    id?: string
                    metadata?: Json | null
                    price_id?: string | null
                    quantity?: number | null
                    status?: Database["public"]["Enums"]["subscription_status"] | null
                    trial_end?: string | null
                    trial_start?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "subscriptions_price_id_fkey"
                        columns: ["price_id"]
                        isOneToOne: false
                        referencedRelation: "prices"
                        referencedColumns: ["id"]
                    },
                ]
            }
            // International Admissions System Tables
            countries: {
                Row: {
                    id: string
                    code: string
                    name: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    code: string
                    name: string
                    id?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    code?: string
                    name?: string
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            study_programs: {
                Row: {
                    id: string
                    code: string
                    name: string
                    name_id: string | null
                    description: string | null
                    description_id: string | null
                    faculty: string | null
                    program_type: Database["public"]["Enums"]["program_type"]
                    duration_years: number
                    is_active: boolean
                    admission_requirements: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    code: string
                    name: string
                    program_type: Database["public"]["Enums"]["program_type"]
                    duration_years: number
                    name_id?: string | null
                    description?: string | null
                    description_id?: string | null
                    faculty?: string | null
                    is_active?: boolean
                    admission_requirements?: Json | null
                    id?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    code?: string
                    name?: string
                    name_id?: string | null
                    description?: string | null
                    description_id?: string | null
                    faculty?: string | null
                    program_type?: Database["public"]["Enums"]["program_type"]
                    duration_years?: number
                    is_active?: boolean
                    admission_requirements?: Json | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            admission_intakes: {
                Row: {
                    id: string
                    name: string
                    academic_year: string
                    semester: string
                    application_start_date: string
                    application_deadline: string
                    results_announcement_date: string | null
                    orientation_start_date: string | null
                    classes_start_date: string | null
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    name: string
                    academic_year: string
                    semester: string
                    application_start_date: string
                    application_deadline: string
                    results_announcement_date?: string | null
                    orientation_start_date?: string | null
                    classes_start_date?: string | null
                    is_active?: boolean
                    id?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    academic_year?: string
                    semester?: string
                    application_start_date?: string
                    application_deadline?: string
                    results_announcement_date?: string | null
                    orientation_start_date?: string | null
                    classes_start_date?: string | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    id: string
                    clerk_user_id: string
                    email: string
                    first_name: string
                    last_name: string
                    phone: string | null
                    date_of_birth: string | null
                    gender: string | null
                    nationality_id: string | null
                    passport_number: string | null
                    passport_expiry_date: string | null
                    residential_address: string | null
                    city: string | null
                    state_province: string | null
                    postal_code: string | null
                    country_id: string | null
                    emergency_contact_name: string | null
                    emergency_contact_phone: string | null
                    emergency_contact_relationship: string | null
                    role: string
                    profile_image_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    clerk_user_id: string
                    email: string
                    first_name: string
                    last_name: string
                    phone?: string | null
                    date_of_birth?: string | null
                    gender?: string | null
                    nationality_id?: string | null
                    passport_number?: string | null
                    passport_expiry_date?: string | null
                    residential_address?: string | null
                    city?: string | null
                    state_province?: string | null
                    postal_code?: string | null
                    country_id?: string | null
                    emergency_contact_name?: string | null
                    emergency_contact_phone?: string | null
                    emergency_contact_relationship?: string | null
                    role?: string
                    profile_image_url?: string | null
                    id?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    clerk_user_id?: string
                    email?: string
                    first_name?: string
                    last_name?: string
                    phone?: string | null
                    date_of_birth?: string | null
                    gender?: string | null
                    nationality_id?: string | null
                    passport_number?: string | null
                    passport_expiry_date?: string | null
                    residential_address?: string | null
                    city?: string | null
                    state_province?: string | null
                    postal_code?: string | null
                    country_id?: string | null
                    emergency_contact_name?: string | null
                    emergency_contact_phone?: string | null
                    emergency_contact_relationship?: string | null
                    role?: string
                    profile_image_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_nationality_id_fkey"
                        columns: ["nationality_id"]
                        isOneToOne: false
                        referencedRelation: "countries"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "profiles_country_id_fkey"
                        columns: ["country_id"]
                        isOneToOne: false
                        referencedRelation: "countries"
                        referencedColumns: ["id"]
                    },
                ]
            }
            educational_background: {
                Row: {
                    id: string
                    profile_id: string
                    institution_name: string
                    institution_city: string | null
                    institution_country_id: string | null
                    education_level: Database["public"]["Enums"]["education_level"]
                    field_of_study: string | null
                    start_date: string
                    end_date: string | null
                    graduation_date: string | null
                    gpa: number | null
                    gpa_scale: number
                    is_current: boolean
                    degree_certificate_url: string | null
                    transcript_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    profile_id: string
                    institution_name: string
                    education_level: Database["public"]["Enums"]["education_level"]
                    start_date: string
                    institution_city?: string | null
                    institution_country_id?: string | null
                    field_of_study?: string | null
                    end_date?: string | null
                    graduation_date?: string | null
                    gpa?: number | null
                    gpa_scale?: number
                    is_current?: boolean
                    degree_certificate_url?: string | null
                    transcript_url?: string | null
                    id?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    profile_id?: string
                    institution_name?: string
                    institution_city?: string | null
                    institution_country_id?: string | null
                    education_level?: Database["public"]["Enums"]["education_level"]
                    field_of_study?: string | null
                    start_date?: string
                    end_date?: string | null
                    graduation_date?: string | null
                    gpa?: number | null
                    gpa_scale?: number
                    is_current?: boolean
                    degree_certificate_url?: string | null
                    transcript_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "educational_background_profile_id_fkey"
                        columns: ["profile_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "educational_background_institution_country_id_fkey"
                        columns: ["institution_country_id"]
                        isOneToOne: false
                        referencedRelation: "countries"
                        referencedColumns: ["id"]
                    },
                ]
            }
            applications: {
                Row: {
                    id: string
                    application_number: string
                    profile_id: string
                    program_id: string
                    intake_id: string
                    status: Database["public"]["Enums"]["application_status"]
                    payment_status: Database["public"]["Enums"]["application_payment_status"]
                    submission_date: string | null
                    last_updated: string
                    admin_notes: string | null
                    admin_reviewer_id: string | null
                    rejection_reason: string | null
                    acceptance_conditions: string | null
                    application_fee_amount: number
                    stripe_payment_intent_id: string | null
                    stripe_payment_status: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    profile_id: string
                    program_id: string
                    intake_id: string
                    application_number?: string
                    status?: Database["public"]["Enums"]["application_status"]
                    payment_status?: Database["public"]["Enums"]["application_payment_status"]
                    submission_date?: string | null
                    last_updated?: string
                    admin_notes?: string | null
                    admin_reviewer_id?: string | null
                    rejection_reason?: string | null
                    acceptance_conditions?: string | null
                    application_fee_amount?: number
                    stripe_payment_intent_id?: string | null
                    stripe_payment_status?: string | null
                    id?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    application_number?: string
                    profile_id?: string
                    program_id?: string
                    intake_id?: string
                    status?: Database["public"]["Enums"]["application_status"]
                    payment_status?: Database["public"]["Enums"]["application_payment_status"]
                    submission_date?: string | null
                    last_updated?: string
                    admin_notes?: string | null
                    admin_reviewer_id?: string | null
                    rejection_reason?: string | null
                    acceptance_conditions?: string | null
                    application_fee_amount?: number
                    stripe_payment_intent_id?: string | null
                    stripe_payment_status?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "applications_profile_id_fkey"
                        columns: ["profile_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "applications_program_id_fkey"
                        columns: ["program_id"]
                        isOneToOne: false
                        referencedRelation: "study_programs"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "applications_intake_id_fkey"
                        columns: ["intake_id"]
                        isOneToOne: false
                        referencedRelation: "admission_intakes"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "applications_admin_reviewer_id_fkey"
                        columns: ["admin_reviewer_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            application_documents: {
                Row: {
                    id: string
                    application_id: string
                    document_type: Database["public"]["Enums"]["document_type"]
                    document_name: string
                    file_url: string
                    file_size: number
                    file_type: string
                    upload_date: string
                    is_verified: boolean
                    verification_notes: string | null
                    admin_reviewer_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    application_id: string
                    document_type: Database["public"]["Enums"]["document_type"]
                    document_name: string
                    file_url: string
                    file_size: number
                    file_type: string
                    is_verified?: boolean
                    verification_notes?: string | null
                    admin_reviewer_id?: string | null
                    upload_date?: string
                    id?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    application_id?: string
                    document_type?: Database["public"]["Enums"]["document_type"]
                    document_name?: string
                    file_url?: string
                    file_size?: number
                    file_type?: string
                    upload_date?: string
                    is_verified?: boolean
                    verification_notes?: string | null
                    admin_reviewer_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "application_documents_application_id_fkey"
                        columns: ["application_id"]
                        isOneToOne: false
                        referencedRelation: "applications"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "application_documents_admin_reviewer_id_fkey"
                        columns: ["admin_reviewer_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            requesting_user_id: {
                Args: Record<PropertyKey, never>
                Returns: string
            }
            generate_application_number: {
                Args: Record<PropertyKey, never>
                Returns: string
            }
        }
        Enums: {
            // Original Stripe enums
            pricing_plan_interval: "day" | "week" | "month" | "year"
            pricing_type: "one_time" | "recurring"
            subscription_status:
            | "trialing"
            | "active"
            | "canceled"
            | "incomplete"
            | "incomplete_expired"
            | "past_due"
            | "unpaid"
            | "paused"
            // International Admissions System enums
            application_status:
            | "draft"
            | "submitted"
            | "under_review"
            | "additional_documents_required"
            | "accepted"
            | "rejected"
            | "withdrawn"
            application_payment_status:
            | "pending"
            | "paid"
            | "failed"
            | "refunded"
            document_type:
            | "passport"
            | "transcript"
            | "certificate"
            | "recommendation_letter"
            | "english_proficiency"
            | "financial_proof"
            | "medical_certificate"
            | "portfolio"
            | "other"
            education_level:
            | "high_school"
            | "bachelor"
            | "master"
            | "doctorate"
            | "diploma"
            program_type:
            | "bachelor"
            | "master"
            | "doctorate"
            | "diploma"
            | "certificate"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never