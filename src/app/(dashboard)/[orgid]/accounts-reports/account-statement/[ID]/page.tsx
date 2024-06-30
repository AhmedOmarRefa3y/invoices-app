"use client";
import React, { useEffect, useRef, useState } from "react";
import { TransactionColumns } from "./utils/columns";
import { Button } from "@/components/ui/button";
import { TableUi } from "./utils/account-statement-Table";
import { getAllTransactions } from "./utils/getTransactions";
import { Prisma } from "@prisma/client";
import { getTransactions } from "./utils/formmatedTransaction";
import { useReactToPrint } from "react-to-print";
import { PrinterIcon } from "lucide-react";

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
    const [MaxITems, setMaxITems] = useState(0);
    const [ItemsPerPage, setItemsPerPage] = useState(16);
    const [loading, setloading] = useState(true);
    const [AllData, setAllData] = useState<CustomerData | null>(null);
    const [MaxPages, setMaxPages] = useState(0);
    const [Page, setPage] = useState(1);
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
    const componentRef = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

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
        {
            maxItems < ItemsPerPage ? setItemsPerPage(maxItems) : null;
        }
    }, [AllData, Page, ItemsPerPage]);

    useEffect(() => {
        setPage(MaxPages);
    }, [MaxPages]);

    return (
        <div
            className=" h-full w-full   px-2  mx-auto flex-col flex  print:p-8  "
            ref={componentRef}
        >
            <div
                className="flex flex-wrap  justify-between items-center gap-1 w-full border border-stone-300 print:border-black rounded-md p-2 text-lg font-bold print:rounded-none overflow-x-auto"
                ref={componentRef}
            >
                <div className=" flex gap-1 flex-1 whitespace-nowrap">
                    <div>اسم العميل : </div>
                    {loading ? (
                        <div className="animate-pulse h-full p-2 px-6 bg-gray-200"></div>
                    ) : (
                        <div className="pr-2">{AllData?.name}</div>
                    )}
                </div>
                {DisplayedData.length > 1 && (
                    <>
                        <button
                            onClick={handlePrint}
                            className="print:hidden  w-fit  mx-3"
                        >
                            <PrinterIcon
                                className=" cursor-pointer hover:text-orange-500 duration-300"
                                size={"30px"}
                            />
                        </button>
                        <div className="flex gap-2 print:hidden">
                            <label htmlFor="ItemsPerPage whitespace-nowrap">
                                {" "}
                                عدد الصفوف{" "}
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={ItemsPerPage}
                                className="flex items-center justify-center text-center w-20 border rounded-none border-stone-300"
                                onChange={(e) =>
                                    e.target.valueAsNumber <= MaxITems &&
                                    setItemsPerPage(e.target.valueAsNumber)
                                }
                            />
                        </div>
                        <div className="min-w-[100px] flex items-center sm:justify-center justify-end">
                            {loading ? (
                                <div className="animate-pulse h-full p-2 px-6 bg-gray-200"></div>
                            ) : (
                                <div className="w-fit whitespace-nowrap px-3">{` ${
                                    MaxPages || 0
                                } / ${Page || 0}`}</div>
                            )}
                        </div>
                    </>
                )}
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
                itemsPerPage={MaxITems}
            />
        </div>
    );
};

export default AccountStatementPage;
