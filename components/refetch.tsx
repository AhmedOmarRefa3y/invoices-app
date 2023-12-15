"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Refetch = () => {
    const router = useRouter();

    useEffect(() => {
        router.refresh();
    }, [router]);

    return null;
};

export default Refetch;
