"use client";
import { useIsClient } from "@uidotdev/usehooks";
import { SessionProvider } from "next-auth/react";

import React from "react";

const SessionWrapper = ({ children }: { children: React.ReactNode }) => {
    const isclient = useIsClient();
    if (!isclient) return null;
    return <SessionProvider>{children}</SessionProvider>;
};

export default SessionWrapper;
