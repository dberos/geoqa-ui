import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { createCsp } from './csp';
import { createCors } from './cors';
import { refreshSession } from './session';

class MiddlewareResponse {

    // Request and Response
    private response: NextResponse;
    private request: NextRequest;

    // Configuration for protected routes
    private isProtectedRoute: string[];
    private redirectUrl: string;

    // Resolve promises
    private chain: Promise<void>;

    public constructor(request: NextRequest) {
        this.request = request;
        this.response = NextResponse.next({
            request: {
                headers: this.request.headers
            }
        });

        // Set configuration
        this.isProtectedRoute = [
            '/dashboard(.*)'
        ];
        // Redirect URL can't be a protected route
        // Or it gets endless loop
        this.redirectUrl = '/test';

        // Resolve promises
        this.chain = Promise.resolve();
    }

    public cors(): MiddlewareResponse {
        this.chain = this.chain.then(async () => {
            this.response = await createCors(this.request, this.response);
    
            // If the request method is OPTIONS, throw an error to stop further execution
            if (this.request.method === 'OPTIONS') {
                throw new Error('Preflight request');
            }
        })
    
        return this;
    }

    public csp(): MiddlewareResponse {
        // This or any other chain won't execute for preflight
        // And the code inside won't run
        this.chain = this.chain.then(async () => {
            this.response = await createCsp(this.request, this.response);
        });
        // Allow chaining
        return this;
    }

    public session(): MiddlewareResponse {
        this.chain = this.chain.then(async () => {
            this.response = await refreshSession(this.request, this.response);
        });
        // Allow chaining
        return this;
    }

    public protect(): MiddlewareResponse {
        this.chain = this.chain.then(async () => {
            if (!this.response.cookies?.get('accessToken')) {
                if (this.isProtectedRoute.some((route) => new RegExp(route).test(this.request.nextUrl.pathname))) {
                    // Create a new URL
                    const url = new URL(this.redirectUrl, this.request.url);
                    url.searchParams.set('redirect', this.request.nextUrl.pathname);
        
                    // Create a redirect response
                    const redirectResponse = NextResponse.redirect(url);
        
                    // Copy headers from the existing response
                    this.response.headers.forEach((value, key) => {
                        redirectResponse.headers.set(key, value);
                    });
        
                    this.response = redirectResponse;
                }
            }
        })
        // Allow chaining
        return this;
    }

    public async returns(): Promise<NextResponse> {
        try {
            // Await all promises to resolve
            await this.chain;
        } 
        catch {
            // Error thrown for preflight
            return this.response;
        }
        // Return the response
        return this.response;
    }
}

export const middlewareHandler = async (request: NextRequest): Promise<NextResponse> => {
    // Create a new response and handle all middleware options
    const response = await new MiddlewareResponse(request)
    .cors()
    .csp()
    .session()
    .protect()
    .returns();

    return response;
}
