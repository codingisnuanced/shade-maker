import { models as M } from "cabal-includes"

export interface AuthMember {
    member: M.Member;
    accessToken: string;
    recvAt: number;
    beast: M.Beast;
}