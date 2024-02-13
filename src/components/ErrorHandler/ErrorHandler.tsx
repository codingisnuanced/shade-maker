import axiosInstance from "@/adapters/axios-instance";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useState, useEffect } from "react";
import { models as M } from "cabal-includes";

export interface ErrorHandlerProps {
    member: M.Member;
}

const ErrorHandler: React.FC<ErrorHandlerProps> = ({ member }) => {

    const [error, setError] = useState(null);

    useEffect(() => {

        const reqIxId = axiosInstance.interceptors.request.use(
            (config) => {
                setError(null);
                return config;
            },
            (error) => {
                setError(error);
                return Promise.reject(error);
            }
        );

        const resIxId = axiosInstance.interceptors.response.use(
            (response) => {
                setError(null);
                return response;
            },
            (error) => {
                // Handle response errors here
                setError(error.response);
                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.request.eject(reqIxId);
            axiosInstance.interceptors.response.eject(resIxId);
        };
    }, [member]);

    return <></>;
}

export default ErrorHandler;