import axiosInstance from '@/adapters/axios-instance';
import { models as M } from 'cabal-includes';

export async function enterMember(memberEnter: M.MemberEnter): Promise<M.Member> {
    const res = await axiosInstance.post<M.Member>('member/enter', memberEnter);
    return res.data;
}

export async function refreshToken() {
    const res = await axiosInstance.get<M.Member>('auth/member/refresh');
    return res.data;
}