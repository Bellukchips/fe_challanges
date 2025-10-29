'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/auth.types';
import { useAuthStore } from '@/store/useAuthStore';
import LoadingPage from '@/app/loading';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: Readonly<ProtectedRouteProps>) {
    const router = useRouter();
    const { isAuthenticated, user, isHydrated } = useAuthStore();
    const [canRender, setCanRender] = useState(false);

    useEffect(() => {
        if (!isHydrated) return;

        const timer = setTimeout(() => {
            if (!isAuthenticated) {
                router.push('/auth/login');
                return;
            }

            if (user && !allowedRoles.includes(user.role)) {
                router.push('/auth/unauthorized');
                return;
            }

            setCanRender(true);
        }, 50);
        return () => clearTimeout(timer);
    }, [isHydrated, isAuthenticated, user, allowedRoles, router]);

    if (!canRender) {
        return <LoadingPage />;
    }

    return <>{children}</>;
}