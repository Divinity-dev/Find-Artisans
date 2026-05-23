// middleware.js

import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('role')?.value

  const { pathname } = request.nextUrl

  // ======================================
  // AUTH PAGES
  // ======================================
  const authPages = [
    '/login',
    '/register',
    '/forgot-password',
  ]

  // ======================================
  // PROTECTED ROUTES
  // ======================================
  const protectedRoutes = [
    '/workers-dashboard',
    '/customers-dashboard',
    '/admin',
    '/profile',
    '/messages',
  ]

  // ======================================
  // BLOCK LOGGED-IN USERS FROM AUTH PAGES
  // ======================================
  if (token && authPages.includes(pathname)) {

    if (role === 'admin') {
      return NextResponse.redirect(
        new URL('/admin', request.url)
      )
    }

    if (role === 'worker') {
      return NextResponse.redirect(
        new URL('/workers-dashboard', request.url)
      )
    }

    return NextResponse.redirect(
      new URL('/customers-dashboard', request.url)
    )
  }

  // ======================================
  // CHECK IF ROUTE IS PROTECTED
  // ======================================
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // ======================================
  // BLOCK LOGGED-OUT USERS
  // ======================================
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(
      new URL('/login', request.url)
    )
  }

  // ======================================
  // ROLE PROTECTION
  // ======================================

  if (
    pathname.startsWith('/admin') &&
    role !== 'admin'
  ) {
    return NextResponse.redirect(
      new URL('/', request.url)
    )
  }

  if (
    pathname.startsWith('/workers-dashboard') &&
    role !== 'worker'
  ) {
    return NextResponse.redirect(
      new URL('/', request.url)
    )
  }

  if (
    pathname.startsWith('/customers-dashboard') &&
    role !== 'customer'
  ) {
    return NextResponse.redirect(
      new URL('/', request.url)
    )
  }

  return NextResponse.next()
}

// ======================================
// MATCH ROUTES
// ======================================

export const config = {
  matcher: [
    '/login',
    '/register',
    '/forgot-password',

    '/workers-dashboard/:path*',
    '/customers-dashboard/:path*',
    '/admin/:path*',

    '/profile/:path*',
    '/messages/:path*',
  ],
}