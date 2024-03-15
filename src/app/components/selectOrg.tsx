"use client";
import { organization } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";

const SelectOrg = ({ organizations }: { organizations: organization[] }) => {
    const router = useRouter();
    return (
        <select
            name=""
            id=""
            onChange={(e) => router.push(`/${e.target.value}`)}
        >
            <option>اختر المنشأة</option>;
            {organizations.map((org) => {
                return (
                    <>
                        <option value={org.id}>{org.name}</option>;
                    </>
                );
            })}
        </select>
    );
};

export default SelectOrg;
