"use client";

import useModals from "@/lib/zustand/useModals";
import { useRouter } from "next/navigation";

export default function RedirectClient({ id }: { id: string | undefined }) {
    const router = useRouter();
    if (!id) {
        useModals.setState({
            addOrgMOdalIsOpen: true,
        });
    } else {
        router.push(`/${id}`);
        return null;
    }
}
