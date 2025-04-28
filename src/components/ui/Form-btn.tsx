import React from "react";
import { Button } from "./button";
import { useFormStatus } from "react-dom";

export default function Formbtn() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className={`w-full ${pending && "bg-black/70 cursor-not-allowed "} hover:bg-black/80`}
      disabled={pending}
    >
      Save
    </Button>
  );
}
