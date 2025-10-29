import { User, UserRole } from "@/types/auth.types";
import z from "zod";
import { loginValidationSchema } from "../validations/login";



interface AuthResponse {
    user: User;
    token: string;
}

interface MockUserData {
    "id": string,
    "email": string,
    "password": string,
    "name": string,
    "role": UserRole
};


class AuthServices {
    private mockUser: MockUserData[] = [];
    private isLoaded: boolean = false;


    private delay(ms: number = 500): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async loadMockUsers(): Promise<void> {
        if (this.isLoaded) return;
        try {
            const response = await fetch('/data/dataCredential.json')
            const data = await response.json();
            this.mockUser = data.users;
            this.isLoaded = true;
        } catch (error) {
            console.error('Error loading mock users:', error);
            this.isLoaded = false;
        }
    }


    async login(data: z.infer<typeof loginValidationSchema>): Promise<AuthResponse> {
        await this.loadMockUsers();
        await this.delay();

        const user = this.mockUser.find(
            (user) => user.email === data.email && user.password === data.password
        );

        if (!user) {
            throw new Error('User not found');
        }

        const token = `token_${Date.now()}_${Math.random().toString(36)}`;

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        }

    }
    async logout(): Promise<void> {
        await this.delay(200);
    }
    async verifyToken(token: string): Promise<boolean> {
        await this.delay(200);
        return token.startsWith('token_');
    }

}

export const authApi = new AuthServices();