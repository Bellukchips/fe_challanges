export type UserRole = 'admin' | 'jobseeker'


export interface User {
    id: string,
    name: string,
    email: string,
    role: UserRole
}

export interface AuthState{
    user: User | null,
    token: string,
    isAuthenticated: boolean,
    isLoading: boolean
}

