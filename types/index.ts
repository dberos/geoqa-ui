import { JWTPayload } from "jose";

export type UserType = {
    id: string,
    githubId: string | null,
    googleId: string | null,
    name: string,
    avatarUrl: string,
};

export enum OathEnum {
    GITHUB,
    GOOGLE
};

export type OathUserType = {
    id: string,
    name: string,
    avatarUrl: string
    type: OathEnum
};

export interface SessionPayload extends JWTPayload {
    id?: string,
    sessionId?: string,
    name?: string,
    avatarUrl?: string,
};

export type ChatType = {
     id: string;
    userId: string;
    name: string | null;
    createdAt: string;
};

export type MessageType = {
    id: string;
    chatId: string;
    question?: string | null;
    query?: string | null;
    queryResults?: string | null;
    textualResponse?: string | null;
    isLoading?: boolean;
    errorMessage?: string | null;
    createdAt?: string;
};

export type QueryResultsType = Record<string, string>;