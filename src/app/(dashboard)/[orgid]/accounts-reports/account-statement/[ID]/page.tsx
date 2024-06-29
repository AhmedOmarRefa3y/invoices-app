"use client";
import React, { useEffect, useState } from "react";
import { getTransactions } from "./utils/getTransactions";

const page = ({ params }: { params: { orgid: string; ID: string } }) => {
    const [Page, setPage] = useState(2);
    const [ItemsPerPage, setItemsPerPage] = useState(10);
    const [Data, setData] = useState<
        {
            type: "Debit" | "credit" | "openCredit";
            amount: number;
            date?: Date;
            number?: number;
            label: "inv" | "paymnet" | "returns" | "openCredit";
        }[]
    >([]);

    useEffect(() => {
        async function FetchData() {
            const { Data } = await getTransactions({
                orgid: params.orgid,
                customerID: params.ID,
                page: Page,
                pageSize: ItemsPerPage,
            });
            if (Data) {
                setData(Data);
            } else {
                console.log("error fetching data");
            }
        }
        FetchData();
    }, [params]);

    console.log(Data);

    return <div>page</div>;
};

export default page;
