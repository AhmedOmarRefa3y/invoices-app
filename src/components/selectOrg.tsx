"use client";
import { organization } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";

const SelectOrg = ({ organizations }: { organizations: organization[] }) => {
  const router = useRouter();
  return (
    <select name="" id="" onChange={(e) => router.push(`/${e.target.value}`)}>
      <option key={0}>Select Organization</option>;
      {organizations.map((org, i) => {
        return (
          <option key={i + 1} value={org.id}>
            {org.name}
          </option>
        );
      })}
    </select>
  );
};

export default SelectOrg;
