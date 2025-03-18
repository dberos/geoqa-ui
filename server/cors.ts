import 'server-only';
import { NextRequest, NextResponse } from "next/server";

export const createCors = async (request: NextRequest, response: NextResponse) => {
    // CORS options
    const requestHeaders = new Headers(request.headers);
    const origin = requestHeaders.get("Origin");
    const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL!;
    const allowedMethods = ["POST", "GET", "OPTIONS"];
    // const credentials = true;

    // Add CORS headers
    const corsHeaders = {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": allowedMethods.join(","),
        // "Access-Control-Allow-Credentials": credentials
    };
    Object.entries(corsHeaders).forEach(([key, value]) => response.headers.set(key, value));

    // In case of not allowed origin or preflight
    // Set those headers to the response
    // If trying to set all previous headers it doesn't work
    const csp = response.headers?.get("Content-Security-Policy");
    const blockedHeaders = {
        ...corsHeaders,
        ...(csp && { "Content-Security-Policy": csp })
    }

    // Block CORS requests from unauthorized origins
    if (origin && origin !== allowedOrigin) {
        
        // If trying to add all previous headers, it doesn't return a 403
        return NextResponse.json(
            { error: "Request blocked from CORS policy" },
            { status: 403, headers: blockedHeaders }
        );
    }

    // Handle Preflight Request
    if (request.method === "OPTIONS") {
        return NextResponse.json({}, { status: 204, headers: blockedHeaders });
    }

    return response;
};