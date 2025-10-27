import { createClient } from '@/utils/supabase/server'
import { Database, Tables, TablesInsert, TablesUpdate } from '@/types/database.types'

// Database type helpers
type Profile = Tables<'profiles'>
type Application = Tables<'applications'>
type EducationalBackground = Tables<'educational_background'>
type ApplicationDocument = Tables<'application_documents'>
type StudyProgram = Tables<'study_programs'>
type AdmissionIntake = Tables<'admission_intakes'>
type Country = Tables<'countries'>

// Profile operations
export async function getProfileByClerkId(clerkUserId: string): Promise<Profile | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

export async function createProfile(profile: TablesInsert<'profiles'>): Promise<Profile | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single()

  if (error) {
    console.error('Error creating profile:', error)
    return null
  }

  return data
}

export async function updateProfile(
  clerkUserId: string,
  updates: TablesUpdate<'profiles'>
): Promise<Profile | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('clerk_user_id', clerkUserId)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return null
  }

  return data
}

// Study programs operations
export async function getActiveStudyPrograms(): Promise<StudyProgram[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('study_programs')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) {
    console.error('Error fetching study programs:', error)
    return []
  }

  return data || []
}

export async function getStudyProgramById(id: string): Promise<StudyProgram | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('study_programs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching study program:', error)
    return null
  }

  return data
}

// Admission intakes operations
export async function getActiveAdmissionIntakes(): Promise<AdmissionIntake[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('admission_intakes')
    .select('*')
    .eq('is_active', true)
    .order('application_deadline')

  if (error) {
    console.error('Error fetching admission intakes:', error)
    return []
  }

  return data || []
}

// Countries operations
export async function getCountries(): Promise<Country[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching countries:', error)
    return []
  }

  return data || []
}

// Applications operations
export async function createApplication(
  application: TablesInsert<'applications'>
): Promise<Application | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('applications')
    .insert(application)
    .select()
    .single()

  if (error) {
    console.error('Error creating application:', error)
    return null
  }

  return data
}

export async function getApplicationsByProfileId(profileId: string): Promise<Application[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      study_program:study_programs (*),
      admission_intake:admission_intakes (*)
    `)
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching applications:', error)
    return []
  }

  return data || []
}

export async function getApplicationById(id: string): Promise<Application | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      study_program:study_programs (*),
      admission_intake:admission_intakes (*),
      profile:profiles (*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching application:', error)
    return null
  }

  return data
}

export async function updateApplication(
  id: string,
  updates: TablesUpdate<'applications'>
): Promise<Application | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('applications')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating application:', error)
    return null
  }

  return data
}

// Educational background operations
export async function createEducationalBackground(
  background: TablesInsert<'educational_background'>
): Promise<EducationalBackground | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('educational_background')
    .insert(background)
    .select()
    .single()

  if (error) {
    console.error('Error creating educational background:', error)
    return null
  }

  return data
}

export async function getEducationalBackgroundByProfileId(
  profileId: string
): Promise<EducationalBackground[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('educational_background')
    .select(`
      *,
      country:countries (*)
    `)
    .eq('profile_id', profileId)
    .order('start_date', { ascending: false })

  if (error) {
    console.error('Error fetching educational background:', error)
    return []
  }

  return data || []
}

export async function updateEducationalBackground(
  id: string,
  updates: TablesUpdate<'educational_background'>
): Promise<EducationalBackground | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('educational_background')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating educational background:', error)
    return null
  }

  return data
}

export async function deleteEducationalBackground(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('educational_background')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting educational background:', error)
    return false
  }

  return true
}

// Application documents operations
export async function createApplicationDocument(
  document: TablesInsert<'application_documents'>
): Promise<ApplicationDocument | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('application_documents')
    .insert(document)
    .select()
    .single()

  if (error) {
    console.error('Error creating application document:', error)
    return null
  }

  return data
}

export async function getApplicationDocumentsByApplicationId(
  applicationId: string
): Promise<ApplicationDocument[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('application_documents')
    .select('*')
    .eq('application_id', applicationId)
    .order('upload_date', { ascending: false })

  if (error) {
    console.error('Error fetching application documents:', error)
    return []
  }

  return data || []
}

export async function updateApplicationDocument(
  id: string,
  updates: TablesUpdate<'application_documents'>
): Promise<ApplicationDocument | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('application_documents')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating application document:', error)
    return null
  }

  return data
}

export async function deleteApplicationDocument(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('application_documents')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting application document:', error)
    return false
  }

  return true
}

// Admin operations
export async function getAllApplications(
  page = 1,
  limit = 20,
  filters?: {
    status?: string
    programId?: string
    intakeId?: string
    search?: string
  }
): Promise<{ applications: Application[], total: number }> {
  const supabase = createClient()
  let query = supabase
    .from('applications')
    .select(`
      *,
      study_program:study_programs (*),
      admission_intake:admission_intakes (*),
      profile:profiles (*)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  // Apply filters
  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.programId) {
    query = query.eq('program_id', filters.programId)
  }

  if (filters?.intakeId) {
    query = query.eq('intake_id', filters.intakeId)
  }

  if (filters?.search) {
    query = query.or(`
      application_number.ilike.%${filters.search}%,
      profile.first_name.ilike.%${filters.search}%,
      profile.last_name.ilike.%${filters.search}%,
      profile.email.ilike.%${filters.search}%
    `)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching applications:', error)
    return { applications: [], total: 0 }
  }

  return {
    applications: data || [],
    total: count || 0
  }
}