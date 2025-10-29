'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronRight, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { authRoutes, JOB_LIST } from '@/constants/routes';
import path from 'path';

export function Navbar() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const pathName = usePathname();

    const handleLogout = async () => {
        logout();
        router.push(authRoutes[0]);
    };

    const initials = user?.name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase() || 'U';

    let header;

    if (pathName.startsWith('/admin/candidates/')) {
        header = (
            <div className="flex flex-row items-center space-x-2 sm:space-x-4">
                <a href={JOB_LIST} className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors bg-white text-gray-600 border border-gray-300 shadow">
                    Job List
                </a>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors bg-gray-300 text-black border border-gray-300">
                    Manage Candidate
                </div>
            </div>
        );
    } else if (pathName.startsWith('/job-seek')) {
        header = (
            <div></div>
        );
    } else {
        header = (
            <h1 className="text-base sm:text-xl font-bold">Job List</h1>
        );
    }


    return (
        <nav className="border-b bg-white sticky  top-0 z-50">
            <div className="container mx-auto h-16 flex items-center justify-between px-4 sm:px-6">
                {header}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-full">
                            <Avatar className="h-9 w-9 sm:h-10 sm:w-10 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-primary transition">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 sm:w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>

    );
}