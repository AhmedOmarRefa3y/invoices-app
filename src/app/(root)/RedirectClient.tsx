"use client";

import { useRouter } from "next/navigation";

export default function RedirectClient({ id }: { id: string }) {
    const router = useRouter();
    router.push(`/${id}`);
    return null;
}
