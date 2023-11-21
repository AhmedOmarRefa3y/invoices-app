"use client";
import { Accordion, AccordionItem } from "@nextui-org/react";
import React from "react";
import { Textarea } from "@nextui-org/react";

export default function DialogCloseButton() {
    const defaultContent =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
    return (
        <Accordion className="relative">
            <AccordionItem
                key="1"
                aria-label="Accordion 1"
                title="Accordion 1"
                className="absolute  top-1/2 left-1/2"
            >
                {defaultContent}
            </AccordionItem>
        </Accordion>
    );
}
