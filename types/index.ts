import { JWTPayload } from "jose";

export type UserType = {
    id: number,
    githubId: string | null,
    googleId: string | null,
    name: string,
    avatarUrl: string,
}

export enum OathEnum {
    GITHUB,
    GOOGLE
}

export type OathUserType = {
    id: string,
    name: string,
    avatarUrl: string
    type: OathEnum
}

export interface SessionPayload extends JWTPayload {
    id: number,
    name: string,
    avatarUrl: string,
}