import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'
import { getProfileByClerkId, createProfile } from './admissions'

export async function getCurrentUser() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const supabase = createClient()

  // Try to get existing profile
  let profile = await getProfileByClerkId(userId)

  if (!profile) {
    // Get user data from Clerk
    const clerkUser = auth().user
    const firstName = clerkUser?.firstName || ''
    const lastName = clerkUser?.lastName || ''
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress || ''

    // Create profile in Supabase
    profile = await createProfile({
      clerk_user_id: userId,
      email,
      first_name: firstName,
      last_name: lastName,
      role: 'applicant', // Default role
    })
  }

  return profile
}

export async function isAdmin() {
  const { userId } = await auth()

  if (!userId) {
    return false
  }

  const profile = await getProfileByClerkId(userId)
  return profile?.role === 'admin' || profile?.role === 'staff'
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Authentication required')
  }

  return user
}

export async function requireAdmin() {
  const user = await requireAuth()

  if (user.role !== 'admin' && user.role !== 'staff') {
    throw new Error('Admin access required')
  }

  return user
}

export function getUserRole() {
  const { user } = auth()
  return user?.publicMetadata?.role as string || 'applicant'
}

export function canAccessRoute(requiredRole: string) {
  const userRole = getUserRole()

  // Admin and staff can access everything
  if (userRole === 'admin' || userRole === 'staff') {
    return true
  }

  // Applicants can access applicant and public routes
  if (requiredRole === 'applicant' && userRole === 'applicant') {
    return true
  }

  return false
}

// Server-side auth helpers for API routes
export async function getAuthUser() {
  const { userId } = await auth()
  return userId
}

export async function getAuthenticatedProfile() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  return await getProfileByClerkId(userId)
}