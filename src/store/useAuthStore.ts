import { authApi } from "@/lib/services/authApi";
import { User } from "@/types/auth.types";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface AuthStore {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    setUser: (user: User) => void;
    setLoading: (loading: boolean) => void;
    isAdmin: () => boolean;
    isJobSeeker: () => boolean;
    isHydrated: boolean;
    setHydrated: () => void;
}

export const useAuthStore = create<AuthStore>()(
    devtools(
        persist(
            (set, get) => ({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
                isHydrated: false,
                setHydrated: () => set({ isHydrated: true }),

                login: async (email, password) => {
                    set({ isLoading: true }, false);
                    try {
                        const response = await authApi.login({ email, password });
                        set(
                            {
                                user: response.user,
                                token: response.token,
                                isAuthenticated: true,
                            },
                            false,
                            'auth/login/success'
                        );
                    } catch (error) {
                        set({ isLoading: false, error: error instanceof Error ? error.message : 'Login failed' }, false);
                        throw error;
                    }
                },
                logout: () => {
                    set(
                        {
                            user: null,
                            token: null,
                            isAuthenticated: false,
                        },
                        false,
                        'auth/logout'
                    );
                },
                setUser: (user) => {
                    set({ user }, false, );
                },
                setLoading: (loading) => {
                    set({ isLoading: loading });
                },
                isAdmin: () => get().user?.role === "admin",
                isJobSeeker: () => get().user?.role === "jobseeker",
            }),
            {
                name: "auth-storage",
                storage: createJSONStorage(() => localStorage),
                onRehydrateStorage: () => (state) => {
                    state?.setHydrated();
                },
                partialize: (state) => ({
                    user: state.user,
                    token: state.token,
                    isAuthenticated: state.isAuthenticated
                })
            }
        ),
        {
            name: "AuthStore"
        }
    )
)