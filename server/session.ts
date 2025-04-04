import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { createJWT, verifyJWT } from '@/lib/session';

export const refreshSession = async (request: NextRequest, response: NextResponse) => {
    try {
        // Get the access and refresh token from request cookies
        const accessToken = request.cookies.get('accessToken')?.value || "";
        const refreshToken = request.cookies.get('refreshToken')?.value || "";

        if (!accessToken || !refreshToken) {
            return response;
        }

        // Verify the access token
        const verifiedAccessToken = await verifyJWT(accessToken);
        if (!verifiedAccessToken) {
            const verifiedRefreshToken = await verifyJWT(refreshToken);

            // Verify the refresh token
            if (!verifiedRefreshToken) {
                response.cookies?.delete('accessToken');
                response.cookies?.delete('refreshToken');
                return response;
            }
            else {
                // Generate new access and refresh tokens
                const newAccessToken = await createJWT(verifiedRefreshToken, '10s') || "";
                const newRefreshToken = await createJWT(verifiedRefreshToken, '1h') || "";

                response.cookies.set('accessToken', newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24,
                    path: '/',
                });
                response.cookies.set('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24,
                });
            }
        }
        else {
            // Have to set the response cookies in case the access token hasn't expired
            response.cookies.set('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24,
            });
            response.cookies.set('refreshToken', refreshToken, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24,
            });
        }
        return response;
    }
    catch (error) {
        console.error(error);
        return response;
    }
}