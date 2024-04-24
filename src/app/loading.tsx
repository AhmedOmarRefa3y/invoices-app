"use client";
import { Spinner } from "@chakra-ui/react";

export default function Loading() {
    return (
        <div className="flex justify-center items-center h-full ">
            <Spinner color="red.500" size="xl" />
        </div>
    );
}
