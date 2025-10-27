import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const user = await getCurrentUser()

  if (!user || (user.role !== 'applicant' && user.role !== 'admin' && user.role !== 'staff')) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}