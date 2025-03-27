import { SignJWT, jwtVerify, JWTPayload } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET as string);

export interface SessionPayload extends JWTPayload {
  email: string,
}

// Creating JWTs

export const createJWT= async (email: string, expiresIn: string = '1h') => {
  try {
    const payload: SessionPayload = {
      email
    }
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(JWT_SECRET)
  
    return jwt;
  }
  catch (error) {
    console.error('Failed to create JWT:', error);
    return null;
  }
};

export const verifyJWT = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });

    return payload as SessionPayload;
  } 
  catch (error) {
    console.error('Failed to verify JWT:', error);
    return null;
  }
};