import 'server-only';
import { NextRequest, NextResponse } from "next/server";

export const createCors = async (request: NextRequest, response: NextResponse) => {
    // CORS options
    const requestHeaders = new Headers(request.headers);
    const origin = requestHeaders.get("Origin");
    const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL!;
    const allowedMethods = ["GET", "POST", "PATCH", "OPTIONS"];

    // Add CORS headers
    const corsHeaders = {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": allowedMethods.join(","),
    };
    Object.entries(corsHeaders).forEach(([key, value]) => response.headers.set(key, value));

    // Handle Preflight Request
    if (request.method === "OPTIONS") {
        // If trying to return .json({}, {...}) it doesn't work
        return new NextResponse(null, { status: 204, headers: corsHeaders });
    }

    // Block CORS requests from unauthorized origins
    if (origin && origin !== allowedOrigin) {
        // If trying to add all previous headers, it doesn't return a 403
        return NextResponse.json(
            { error: "Request blocked from CORS policy" },
            { status: 403, headers: corsHeaders }
        );
    }

    return response;
};