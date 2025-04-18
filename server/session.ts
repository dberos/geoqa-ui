import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { createJWT, decodeJWT, verifyJWT } from '@/lib/session';
import { v4 as uuidv4 } from 'uuid';

export const refreshSession = async (request: NextRequest, response: NextResponse) => {
    try {
        // Get the access and refresh token from request cookies
        const accessToken = request.cookies.get('accessToken')?.value || "";
        const refreshToken = request.cookies.get('refreshToken')?.value || "";

        if (!accessToken || !refreshToken) {
            response.cookies?.delete('accessToken');
            response.cookies?.delete('refreshToken');
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
                /**
                 * Here the rotation takes place
                 * If session doesn't exist, delete the cookies
                 * If session exists, check if oldJti is blacklisted
                 * If it is not, then blacklist and insert the new jti in the db
                 * If it is blacklisted then delete the session from the db and the cookies
                 */

                // Extract the sessionId and jti from the refresh token
                const sessionId = verifiedRefreshToken.sessionId || "";
                const oldJti = verifiedRefreshToken.jti || "";

                // Generate a new jti
                const jti = uuidv4();

                // Decode the access token payload
                const decodedAccessToken = await decodeJWT(accessToken);
                if (!decodedAccessToken) {
                    response.cookies?.delete('accessToken');
                    response.cookies?.delete('refreshToken');
                    return response;
                }

                // Generate new access and refresh tokens
                const newAccessToken = await createJWT(decodedAccessToken, '1m') || "";
                const newRefreshToken = await createJWT(verifiedRefreshToken, '1d', jti) || "";

                // Get the exact exp to be stored
                const decodedRefreshToken = await decodeJWT(newRefreshToken);
                const now = Math.floor(Date.now() / 1000);
                const exp = decodedRefreshToken?.exp || now + 86400;

                // Call the refresh route
                const refreshUrl = process.env.NEXT_PUBLIC_APP_URL as string + "/api/auth/refresh";
                const refreshResponse = await fetch(refreshUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${refreshToken}`,
                    },
                    body: JSON.stringify({
                        sessionId,
                        oldJti,
                        jti,
                        exp
                    }),
                });
                if (!refreshResponse.ok) {
                    response.cookies?.delete('accessToken');
                    response.cookies?.delete('refreshToken');
                    return response;
                }
                const { success } = await refreshResponse.json();
                if (!success) {
                    response.cookies?.delete('accessToken');
                    response.cookies?.delete('refreshToken');
                    return response;
                }

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
        response.cookies?.delete('accessToken');
        response.cookies?.delete('refreshToken');
        return response;
    }
}