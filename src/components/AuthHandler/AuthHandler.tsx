import axiosInstance from "@/adapters/axios-instance";
import { AUTH_MB_CURRENT_MEMBER_KEY } from "@/constants/auth";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useEffect, useRef, useState } from "react"
import { models as M } from "cabal-includes";
import { AuthMember } from "@/types/Auth";
import { refreshToken } from "@/services/auth";

const MB_EXPIRES_IN = 1000 * 60 * 60 * 24 * 3;

export interface AuthHandlerProps {
    member: M.Member;
    leave?: boolean;
    updateMember: (mb: M.Member) => void;
}

const AuthHandler: React.FC<AuthHandlerProps> = props => {
    const { member: _member, leave } = props;
    const [storedMember, setStoredMember] = useLocalStorage<AuthMember>(AUTH_MB_CURRENT_MEMBER_KEY, null);
    const [currentMember, setCurrentMember] = useState<AuthMember>(null);
    const requestedAuth = useRef(false);
    const intervalId = useRef(null);

    useEffect(() => {
        const _mb = storedMember;

        if (_mb != null) {
            console.log('GOT STORED MEMBER');
            props.updateMember(_mb.member);
            setCurrentMember(_mb);
        } else {
            console.log('GOT NULL STORE MEMBER', _mb);
            props.updateMember(null);
        }
    }, []);

    useEffect(() => {
        (async () => {
            if (leave) {
                setStoredMember(null);
                if (currentMember != null) await axiosInstance.get(`/auth/member/leave`);
            } else if (_member) {
                const amb = {
                    member: _member,
                    accessToken: _member.currToken,
                    recvAt: Date.now(),
                    beast: (await axiosInstance.get<M.Beast>(`/beast/${_member.lastBeastUsed.beastId}`)).data
                }
                setStoredMember(amb)
                setCurrentMember(amb);
                console.log('STORED MEMBER');
            }
        })();
    }, [_member, leave]);

    useEffect(() => {
        const reqIxId = axiosInstance.interceptors.request.use(
            (config) => {
                // const accessToken = JSON.parse(localStorage.getItem(AUTH_MB_TOKEN_KEY) as string);

                if (currentMember?.accessToken) {
                    if (config.headers) config.headers.Authorization = `Bearer ${currentMember.accessToken}`;
                }
                return config;
            }
        );

        return () => {
            axiosInstance.interceptors.request.eject(reqIxId);
        };
    }, [currentMember]);

    useEffect(() => {

        intervalId.current = setInterval(async () => {
            const isIn = currentMember?.accessToken != null;

            if (!isIn) return;

            const nineMinutes = 1000 * 60 * 9;

            if (!requestedAuth && (MB_EXPIRES_IN - (new Date().getTime() - currentMember.recvAt)) <= nineMinutes) {
                requestedAuth.current = true;

                try {
                    const mb = await refreshToken();
                    setStoredMember({
                        member: mb,
                        accessToken: mb.currToken,
                        recvAt: Date.now(),
                        beast: (await axiosInstance.get<M.Beast>(`/beast/${_member.lastBeastUsed.beastId}`)).data
                    });
                } finally {
                    requestedAuth.current = false;
                }
            }
        }, 60000); // 1 minute

        // if (currentMember != null) {
        //     props.updateMember(currentMember.member);
        // }

        return () => {
            clearInterval(intervalId.current);
            requestedAuth.current = false;
        }
    }, [currentMember]);

    return <></>;
}

export default AuthHandler;