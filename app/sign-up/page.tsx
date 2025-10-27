'use client'

import { SignUp } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Start your application to Universitas Ubudiyah Indonesia
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Create your account to begin the application process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUp
              path="/sign-up"
              routing="path"
              signInUrl="/sign-in"
              redirectUrl="/apply"
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
                  card: 'shadow-none border-0',
                  headerTitle: 'text-2xl font-semibold',
                  headerSubtitle: 'text-gray-600',
                  socialButtonsBlockButtonText: 'text-sm',
                  socialButtonsBlockButton: 'border-gray-200 hover:bg-gray-50',
                  formFieldInput: 'border-gray-200 focus:border-blue-500',
                  footerActionLink: 'text-blue-600 hover:text-blue-700'
                }
              }}
            />
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Why create an account?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Save your application progress</li>
            <li>• Track your application status</li>
            <li>• Upload and manage documents</li>
            <li>• Communicate with admissions office</li>
          </ul>
        </div>
      </div>
    </div>
  )
}