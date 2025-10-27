import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Define route matchers for different access levels
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/apply',
  '/programs',
  '/about',
  '/contact',
  '/faq',
])

const isStudentRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/apply(.*)',
  '/profile(.*)',
  '/student(.*)',
])

const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = auth()

  // If no user ID and trying to access protected routes, redirect to sign-in
  if (!userId && !isPublicRoute(req)) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', req.url)
    return NextResponse.redirect(signInUrl)
  }

  // For authenticated users, check role-based access
  if (userId) {
    // Get user metadata to check role
    const user = auth().user
    const userRole = user?.publicMetadata?.role as string || 'applicant'

    // Admin routes protection
    if (isAdminRoute(req) && userRole !== 'admin' && userRole !== 'staff') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Student routes protection (applicants and admins can access)
    if (isStudentRoute(req) && userRole !== 'applicant' && userRole !== 'admin' && userRole !== 'staff') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)|api/webhooks).*)",
  ],
}