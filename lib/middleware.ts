import { middlewareHandler } from "@/server/middleware";
import { NextRequest, NextResponse } from "next/server"

export const Middleware = () => {
    return (request: NextRequest): Promise<NextResponse> => {
        return middlewareHandler(request);
    }
}