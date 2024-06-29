"use client";
import React, { useEffect, useState } from "react";
import { TransactionColumns } from "./utils/columns";
import { Button } from "@/components/ui/button";
import { TableUi } from "./utils/account-statement-Table";
import { getAllTransactions } from "./utils/getTransactions";
import { Prisma } from "@prisma/client";
import { getTransactions } from "./utils/formmatedTransaction";

type CustomerData = Prisma.CustomerGetPayload<{
    include: {
        invoices: true;
        Payment: true;
        ReturnedInvoice: true;
    };
}>;

const AccountStatementPage = ({
    params,
}: {
    params: { orgid: string; ID: string };
}) => {
    const [ItemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setloading] = useState(true);
    const [AllData, setAllData] = useState<CustomerData | null>(null);
    const [MaxPages, setMaxPages] = useState(0);
    const [Page, setPage] = useState(1);
    const [MaxITems, setMaxITems] = useState(0);
    const [DisplayedData, setDisplayedData] = useState<
        | {
              type: "Debit" | "credit" | "openCredit";
              amount: number;
              date?: Date | undefined;
              number?: number | undefined;
              label: "returns" | "openCredit" | "inv" | "paymnet" | "prev";
              effect?: number | undefined;
              creditAfter: number;
          }[]
        | []
    >([]);

    useEffect(() => {
        async function FetchData() {
            const { Data, message } = await getAllTransactions({
                orgid: params.orgid,
                customerID: params.ID,
            });
            if (Data) {
                setAllData(Data);
            } else {
                console.log(message);
            }
            setloading(false);
        }
        FetchData();
    }, [params]);

    useEffect(() => {
        if (!AllData) return;
        const { Data, maxItems } = getTransactions({
            Data: AllData,
            page: Page,
            pageSize: ItemsPerPage,
        });
        setDisplayedData(Data);
        setMaxPages(Math.ceil(maxItems / ItemsPerPage));
        setMaxITems(maxItems);
    }, [AllData, Page, ItemsPerPage]);

    useEffect(() => {
        setPage(MaxPages);
    }, [MaxPages]);

    return (
        <div className=" h-full w-full   px-2 max-w-screen-xl mx-auto flex-col flex">
            <div className="flex justify-between gap-1 w-full border border-stone-300 rounded-md p-2 text-lg font-bold">
                <div className=" flex gap-1 flex-1">
                    <div>اسم العميل : </div>
                    {loading ? (
                        <div className="animate-pulse h-full p-2 px-6 bg-gray-200"></div>
                    ) : (
                        <div className="pr-2">{AllData?.name}</div>
                    )}
                </div>
                <div className="flex gap-2">
                    <label htmlFor="ItemsPerPage"> عدد الصفوف </label>
                    <input
                        type="number"
                        min={1}
                        value={ItemsPerPage}
                        className="flex items-center justify-center text-center w-20 border rounded-none border-stone-300"
                        onChange={(e) =>
                            e.target.valueAsNumber < MaxITems &&
                            setItemsPerPage(e.target.valueAsNumber)
                        }
                    />
                </div>
                <div className="min-w-[100px] flex items-center justify-center">
                    {loading ? (
                        <div className="animate-pulse h-full p-2 px-6 bg-gray-200"></div>
                    ) : (
                        <div className="w-fit whitespace-nowrap">{` ${MaxPages} / ${Page}`}</div>
                    )}
                </div>
            </div>

            <TableUi
                columns={TransactionColumns}
                data={DisplayedData}
                filterEnabled={false}
                notfound="لا يوجد نتائج"
                loading={loading}
                Page={Page}
                setPage={setPage}
                maxPage={MaxPages}
                itemsPerPage={ItemsPerPage}
            />
        </div>
    );
};

export default AccountStatementPage;
