import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getAllApplications, getActiveStudyPrograms, getActiveAdmissionIntakes } from '@/lib/admissions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Users, BookOpen, Calendar, TrendingUp, Eye } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const user = await getCurrentUser()

  if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
    redirect('/dashboard')
  }

  const [{ applications, total }, programs, intakes] = await Promise.all([
    getAllApplications(1, 5), // Get latest 5 applications
    getActiveStudyPrograms(),
    getActiveAdmissionIntakes(),
  ])

  const stats = {
    totalApplications: total,
    pendingApplications: applications.filter(app => app.status === 'submitted').length,
    underReviewApplications: applications.filter(app => app.status === 'under_review').length,
    acceptedApplications: applications.filter(app => app.status === 'accepted').length,
    activePrograms: programs.length,
    activeIntakes: intakes.length,
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Manage applications and monitor admission progress
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              All time applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">
              Applications awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.underReviewApplications}</div>
            <p className="text-xs text-muted-foreground">
              Currently being reviewed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.acceptedApplications}</div>
            <p className="text-xs text-muted-foreground">
              Successful applications
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Programs & Intakes</CardTitle>
            <CardDescription>
              Current academic offerings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Active Programs</span>
              </div>
              <Badge variant="secondary">{stats.activePrograms}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Active Intakes</span>
              </div>
              <Badge variant="secondary">{stats.activeIntakes}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start">
              <Link href="/admin/applications">
                <FileText className="mr-2 h-4 w-4" />
                View All Applications
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/programs">
                <BookOpen className="mr-2 h-4 w-4" />
                Manage Programs
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/intakes">
                <Calendar className="mr-2 h-4 w-4" />
                Manage Intakes
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/analytics">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>
            Latest student applications requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">{application.application_number}</p>
                        <p className="text-sm text-gray-600">
                          {application.profile?.first_name} {application.profile?.last_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {application.study_program?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          application.status === 'accepted' ? 'default' :
                          application.status === 'rejected' ? 'destructive' :
                          application.status === 'under_review' ? 'secondary' :
                          application.status === 'submitted' ? 'outline' :
                          'default'
                        }>
                          {application.status.replace('_', ' ')}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(application.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/applications/${application.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Review
                    </Link>
                  </Button>
                </div>
              ))}
              <div className="flex justify-center pt-4">
                <Button asChild variant="outline">
                  <Link href="/admin/applications">
                    View All Applications
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">No applications yet</p>
              <Button asChild>
                <Link href="/admin/programs">
                  Manage Programs
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}