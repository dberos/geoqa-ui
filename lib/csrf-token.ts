import { SignJWT, jwtVerify } from "jose";

const CSRF_SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_CSRF_SECRET as string);

const generateRandomState = () => {
    const randomData = crypto.getRandomValues(new Uint8Array(32));
    return Array.from(randomData, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export const generateCSRFToken = async (expiresIn: string = '1h') => {
    try {
        // Get random data for the token
        const randomData = generateRandomState();

        // Sign the token
        const csrfToken = await new SignJWT({ csrf: randomData })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(expiresIn)
            .sign(CSRF_SECRET);

        return csrfToken;
    }
    catch (error) {
        console.error(error);
        return null;
    }
};



export const verifyCSRFToken = async (token: string) => {
    try {
        const { payload } = await jwtVerify(token, CSRF_SECRET, {
              algorithms: ['HS256'],
            });
        
        if (payload.csrf) {
            return true;
        } 
        else {
            return false;
        }
    } catch (error) {
        console.error("Failed to verify CSRF token:", error);
        return false;
    }
};
