"use client";

import { Spinner } from "@/components/loadingComp";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      <Spinner />
    </div>
  );
}
