import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // createServerClient for middleware
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Refresh auth token
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl
    const protectedRoutes = ['/create', '/library', '/story']
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
    const isAuthRoute = pathname === '/auth'

    if (isProtectedRoute && !user) {
        return NextResponse.redirect(new URL('/auth', request.url))
    }

    if (isAuthRoute && user) {
        return NextResponse.redirect(new URL('/create', request.url))
    }

    return response
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
