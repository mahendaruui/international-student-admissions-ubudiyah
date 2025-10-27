'use client'

import { useUser } from '@clerk/nextjs'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProfileByClerkId, createProfile } from '@/lib/admissions'
import type { Profile } from '@/types/database.types'

export function useAuthProfile() {
  const { user, isSignedIn, isLoading } = useUser()
  const queryClient = useQueryClient()

  const {
    data: profile,
    isLoading: profileLoading,
    error
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null

      let profile = await getProfileByClerkId(user.id)

      // If profile doesn't exist, create it
      if (!profile) {
        profile = await createProfile({
          clerk_user_id: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          first_name: user.firstName || '',
          last_name: user.lastName || '',
          role: 'applicant',
        })
      }

      return profile
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user?.id || !profile) throw new Error('User not authenticated')

      // In a real app, you'd have an updateProfile function
      // For now, we'll update the cache optimistically
      return { ...profile, ...updates }
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['profile', user?.id], updatedProfile)
    },
  })

  return {
    user,
    profile,
    isLoading: isLoading || profileLoading,
    isSignedIn: !!isSignedIn,
    isAdmin: profile?.role === 'admin' || profile?.role === 'staff',
    isApplicant: profile?.role === 'applicant',
    updateProfile: updateProfileMutation.mutate,
    error,
  }
}

export function useRequireAuth() {
  const { user, profile, isLoading, isSignedIn } = useAuthProfile()

  if (isLoading) {
    return { loading: true, user: null, profile: null }
  }

  if (!isSignedIn || !user || !profile) {
    throw new Error('Authentication required')
  }

  return {
    loading: false,
    user,
    profile,
  }
}

export function useRequireAdmin() {
  const { user, profile, isLoading, isAdmin } = useRequireAuth()

  if (!isAdmin) {
    throw new Error('Admin access required')
  }

  return {
    loading: isLoading,
    user,
    profile,
  }
}

// Hook for checking if user can access certain routes
export function useCanAccessRoute(requiredRole: 'applicant' | 'admin' | 'staff') {
  const { profile, isLoading } = useAuthProfile()

  if (isLoading) {
    return { canAccess: false, loading: true }
  }

  const userRole = profile?.role || 'applicant'

  // Admin and staff can access everything
  if (userRole === 'admin' || userRole === 'staff') {
    return { canAccess: true, loading: false }
  }

  // Applicants can only access applicant routes
  if (requiredRole === 'applicant' && userRole === 'applicant') {
    return { canAccess: true, loading: false }
  }

  return { canAccess: false, loading: false }
}