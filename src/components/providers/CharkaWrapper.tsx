"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { Toaster } from "../ui/toaster";

export function CharkaWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ChakraProvider>
            <Toaster />
            {children}
        </ChakraProvider>
    );
}
