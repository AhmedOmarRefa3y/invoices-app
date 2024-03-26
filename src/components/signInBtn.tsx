"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "auth";
import React from "react";

const SignInBtn = () => {
    return (
        <Button
            onClick={async () => {
                
                await signIn();
            }}
        >
            login
        </Button>
    );
};

export default SignInBtn;
