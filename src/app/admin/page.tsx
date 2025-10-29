"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { JOB_LIST } from "@/constants/routes";

export default function AdminPage() {
    const router = useRouter();
    useEffect(() => {
        router.push(JOB_LIST);
    });
    return (
        <div>ADMIN</div>
    );
}