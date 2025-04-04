import { JWTPayload } from "jose";

export type UserType = {
    id: number,
    githubId: string | null,
    googleId: string | null,
    name: string,
    avatarUrl: string,
}

export interface SessionPayload extends JWTPayload {
    id: number,
    name: string,
    avatarUrl: string,
}