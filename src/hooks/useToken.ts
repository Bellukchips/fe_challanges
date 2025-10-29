"use client"

import { useEffect, useState } from "react"

export default function useToken() {
    const [user, setUser] = useState<null | {
        id: string;
        name: string;
        email: string;
        role: string;
    }>(null);

    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const rawData = localStorage.getItem("auth-storage");

        if (!rawData) return;

        try {
            const parsed = JSON.parse(rawData);

            setUser(parsed?.state?.user ?? null);
            setToken(parsed?.state?.token ?? null);
            setIsAuthenticated(parsed?.state?.isAuthenticated ?? false);

        } catch {
            console.warn("Invalid auth data in localStorage");
        }
    }, []);

    const setAuthData = (userData: any, newToken: string) => {
        const payload = {
            state: {
                user: userData,
                token: newToken,
                isAuthenticated: true,
            },
            version: 0,
        };

        localStorage.setItem("auth-storage", JSON.stringify(payload));
        setUser(userData);
        setToken(newToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("auth");
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
    };

    return { user, token, isAuthenticated, setAuthData, logout };
}
