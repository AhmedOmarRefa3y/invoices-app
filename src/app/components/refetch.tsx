"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Refetch = () => {
    const router = useRouter();

    useEffect(() => {
        router.refresh();
    }, [router]);

    console.log("refetchRenderd");

    return null;
};

export default Refetch;
