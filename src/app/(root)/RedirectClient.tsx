"use client";

import useModals from "@/lib/zustand/useModals";
import { useRouter } from "next/navigation";

export default function RedirectClient({ id }: { id: string }) {
    const router = useRouter();

    router.push(`/${id}`);
    return null;
}
