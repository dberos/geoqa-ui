import { SessionPayload } from '@/types';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET as string);

// Creating JWTs
export const createJWT= async (payload: SessionPayload, expiresIn: string = '1h') => {
  try {
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

// Verifying JWTs
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