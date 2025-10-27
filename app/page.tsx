'use client'

import { Hero } from '@/components/ui/animated-hero'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { BookOpen, Users, Globe, Award, ArrowRight, CheckCircle } from 'lucide-react'

export default function Home() {
  const { isSignedIn } = useUser()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Universitas Ubudiyah?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience world-class education in a vibrant multicultural environment
              designed for international students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Quality Education</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Internationally recognized programs with experienced faculty
                  and modern facilities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Globe className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Global Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Join students from over 50 countries in a diverse,
                  inclusive learning environment.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Student Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Comprehensive support services from visa assistance
                  to academic counseling.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <CardTitle>Career Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Strong industry connections and excellent graduate
                  employment outcomes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from a wide range of undergraduate and graduate programs
              designed to prepare you for global success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardHeader>
                <Badge className="w-fit mb-2">Bachelor's</Badge>
                <CardTitle>Computer Science</CardTitle>
                <CardDescription>
                  4 Years • Faculty of Engineering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Focus on software development, AI, and data science
                  with hands-on learning experiences.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/programs/computer-science">
                    Learn More
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Badge className="w-fit mb-2">Bachelor's</Badge>
                <CardTitle>Business Administration</CardTitle>
                <CardDescription>
                  4 Years • Faculty of Business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Develop leadership skills and entrepreneurial mindset
                  for global business success.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/programs/business">
                    Learn More
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Badge className="w-fit mb-2">Bachelor's</Badge>
                <CardTitle>English Literature</CardTitle>
                <CardDescription>
                  4 Years • Faculty of Humanities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Explore language, literature, and cultural studies
                  in a global context.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/programs/english">
                    Learn More
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/programs">
                View All Programs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple Application Process
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Apply in four simple steps and start your journey at Universitas Ubudiyah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Account</h3>
              <p className="opacity-90">
                Sign up and complete your profile
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Fill Application</h3>
              <p className="opacity-90">
                Complete the online application form
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Submit Documents</h3>
              <p className="opacity-90">
                Upload required documents securely
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
              <p className="opacity-90">
                Monitor your application status online
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="secondary">
              <Link href={isSignedIn ? "/apply" : "/sign-up"}>
                {isSignedIn ? "Start Application" : "Apply Now"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Admission Requirements
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Academic Qualifications</h3>
                    <p className="text-gray-600">
                      High school diploma or equivalent with minimum GPA requirements
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">English Proficiency</h3>
                    <p className="text-gray-600">
                      TOEFL, IELTS, or equivalent English language test scores
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Valid Passport</h3>
                    <p className="text-gray-600">
                      Passport with minimum validity of 18 months
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Supporting Documents</h3>
                    <p className="text-gray-600">
                      Transcripts, recommendation letters, and statement of purpose
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Ready to Apply?</CardTitle>
                <CardDescription>
                  Take the first step towards your international education journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full">
                  <Link href={isSignedIn ? "/apply" : "/sign-up"}>
                    Start Your Application
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/programs">
                    Browse Programs
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/contact">
                    Contact Admissions
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}