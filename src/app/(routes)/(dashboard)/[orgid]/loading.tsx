"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex justify-center items-center h-full ">
            <Loader2 color="red.500" size="xl" />
        </div>
    );
}
