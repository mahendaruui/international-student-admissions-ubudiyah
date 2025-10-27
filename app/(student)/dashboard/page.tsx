import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getApplicationsByProfileId, getActiveStudyPrograms } from '@/lib/admissions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Users, BookOpen, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function StudentDashboard() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const user = await getCurrentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const [applications, programs] = await Promise.all([
    getApplicationsByProfileId(user.id),
    getActiveStudyPrograms(),
  ])

  const latestApplication = applications[0]

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.first_name}!
        </h1>
        <p className="text-gray-600">
          Track your application progress and manage your profile
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">
              Total applications submitted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{programs.length}</div>
            <p className="text-xs text-muted-foreground">
              Programs available to apply
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Complete</div>
            <p className="text-xs text-muted-foreground">
              Your profile is ready
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Latest Application */}
        <Card>
          <CardHeader>
            <CardTitle>Latest Application</CardTitle>
            <CardDescription>
              Status of your most recent application
            </CardDescription>
          </CardHeader>
          <CardContent>
            {latestApplication ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{latestApplication.application_number}</p>
                    <p className="text-sm text-gray-600">
                      {latestApplication.study_program?.name}
                    </p>
                  </div>
                  <Badge variant={
                    latestApplication.status === 'accepted' ? 'default' :
                    latestApplication.status === 'rejected' ? 'destructive' :
                    latestApplication.status === 'under_review' ? 'secondary' :
                    'outline'
                  }>
                    {latestApplication.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  Submitted: {new Date(latestApplication.created_at).toLocaleDateString()}
                </div>
                <Button asChild className="w-full">
                  <Link href={`/student/applications/${latestApplication.id}`}>
                    View Application
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">No applications yet</p>
                <Button asChild>
                  <Link href="/apply">
                    <Plus className="mr-2 h-4 w-4" />
                    Start Application
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and resources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start">
              <Link href="/apply">
                <Plus className="mr-2 h-4 w-4" />
                New Application
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/student/profile">
                <Users className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/programs">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Programs
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/student/documents">
                <FileText className="mr-2 h-4 w-4" />
                My Documents
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      {applications.length > 1 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>All Applications</CardTitle>
            <CardDescription>
              History of all your applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{application.application_number}</p>
                    <p className="text-sm text-gray-600">
                      {application.study_program?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(application.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      application.status === 'accepted' ? 'default' :
                      application.status === 'rejected' ? 'destructive' :
                      application.status === 'under_review' ? 'secondary' :
                      'outline'
                    }>
                      {application.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}