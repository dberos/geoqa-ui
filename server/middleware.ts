import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { createCsp } from './csp';
import { createCors } from './cors';
import { refreshSession } from './session';

const isProtectedRoute = [
  '/dashboard(.*)'
];

const redirectUrl = '/test';

export const middlewareHandler = async (request: NextRequest): Promise<NextResponse> => {
    // Generate a response
    let response = NextResponse.next({
        request: {
            headers: request.headers
        }
    });

    // Apply CSP, CORS, and session middleware
    response = await createCsp(request, response);
    response = await createCors(request, response);
    response = await refreshSession(request, response);

    // If session didn't refresh
    if (!response.cookies?.get('accessToken')) {
        const callbackResult = await protect(request, response);
        
        // If callback returns a NextResponse and not Error
        if (callbackResult instanceof NextResponse) {
            return callbackResult;
        }
    }

    return response;
}

export const protect = async (request: NextRequest, response: NextResponse): Promise<NextResponse | void > => {
    // If trying to access a protected route
    if (isProtectedRoute.some((route) => new RegExp(route).test(request.nextUrl.pathname))) {
        // Prevent endless loop by redirecting to a protected route
        if (isProtectedRoute.some((route) => new RegExp(route).test(redirectUrl))) {
            throw new Error("Redirect URL cannot be a protected route.");
        }
        const url = new URL(redirectUrl, request.url);
        url.searchParams.set('redirect', request.nextUrl.pathname);

        // Create a redirect response
        const redirectResponse = NextResponse.redirect(url);

        // Copy headers from the existing response
        response.headers.forEach((value, key) => {
            redirectResponse.headers.set(key, value);
        });

        return redirectResponse;
    }
};