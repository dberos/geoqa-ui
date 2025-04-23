import 'server-only';
import { NextRequest, NextResponse } from "next/server";

export const createCsp = async (request: NextRequest, response: NextResponse) => {
    // Skip CSP in development
    if (process.env.NODE_ENV === 'development') {
        return response;
    }

    // Get request headers
    const requestHeaders = new Headers(request.headers);
    
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    const cspHeader = `
    default-src 'self';
    base-uri 'self';
    connect-src 'self';
    font-src 'self' https:;
    form-action 'self';
    frame-ancestors 'none';
    img-src 'self' https: data:;
    manifest-src 'self';
    media-src 'self';
    object-src 'none';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    script-src-attr 'none';
    style-src 'self' 'nonce-${nonce}' https:;
    style-src-attr 'none';
    style-src-elem 'self' 'nonce-${nonce}' https:;
    upgrade-insecure-requests;
    `;

    // Replace newline characters and spaces
    const contentSecurityPolicyHeaderValue = cspHeader
        .replace(/\s{2,}/g, ' ')
        .trim();
    
    // Set the CSP headers
    requestHeaders.set('X-NONCE', nonce);
    requestHeaders.set(
        'Content-Security-Policy',
        contentSecurityPolicyHeaderValue
    );
    
    // Set the CSP headers
    response.headers.set(
        'Content-Security-Policy',
        contentSecurityPolicyHeaderValue
    );
    
    return response;
}