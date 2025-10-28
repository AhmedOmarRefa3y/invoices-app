"use client";
import React, { useEffect, useRef, useState } from "react";
import { TransactionColumns } from "./utils/columns";
import { TableUi } from "./utils/account-statement-Table";
import { getAllTransactions } from "./utils/getTransactions";
import { Prisma } from "@prisma/client";
import { getTransactions } from "./utils/formmatedTransaction";
import { useReactToPrint } from "react-to-print";
import { PrinterIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

type CustomerData = Prisma.CustomerGetPayload<{
  include: {
    invoices: {
      include: {
        orders: {
          include: {
            Product: true;
          };
        };
      };
    };
    Payment: true;
    ReturnedInvoice: true;
    PurchaseInvoice: true;
    PaymentToSupplier: true;
  };
}>;

const AccountStatementPage = ({ params }: { params: { orgid: string; ID: string } }) => {
  const t = useTranslations("accountStatement"); // Load translations
  const locale = useLocale(); // Get current locale

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
        date?: Date;
        number?: number;
        label:
          | "orderItem"
          | "payment"
          | "returns"
          | "openCredit"
          | "prev"
          | "Purchase"
          | "paymentToSupplier";
        effect?: number;
        creditAfter: number;
        // Additional fields for navigation and payment details
        orgid?: string;
        locale?: string;
        name?: string;
        paymentId?: string;
        customerId?: string;
        customerName?: string;
        paymentMethod?: string;
        paymentNote?: string | null;
        invoiceNumber?: number;
      }[]
    | []
  >([]);
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    async function FetchData() {
      const { Data } = await getAllTransactions({
        orgid: params.orgid,
        customerID: params.ID,
      });
      if (Data) {
        setAllData(Data);
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

    // Enhance the data with orgid, locale, and payment details
    const enhancedData = Data.map((item) => {
      // Find the original payment object if this is a payment
      let paymentDetails = {};
      if (item.label === "payment" && item.paymentId) {
        const originalPayment = AllData.Payment.find((payment) => payment.id === item.paymentId);
        if (originalPayment) {
          paymentDetails = {
            paymentId: originalPayment.id,
            customerId: originalPayment.customerId,
            customerName: AllData.name,
            paymentMethod: originalPayment.method,
            paymentNote: originalPayment.notes,
          };
        }
      }

      // Find the original invoice number for order items
      let invoiceDetails = {};
      if (item.label === "orderItem" && item.number) {
        const originalInvoice = AllData.invoices.find((invoice) =>
          invoice.orders.some((order) => order.OrderNumber === item.number)
        );
        if (originalInvoice) {
          invoiceDetails = {
            invoiceNumber: originalInvoice.number,
          };
        }
      }

      return {
        ...item,
        orgid: params.orgid,
        locale: locale,
        ...paymentDetails,
        ...invoiceDetails,
      };
    });

    setDisplayedData(enhancedData);
    setMaxPages(Math.ceil(maxItems / ItemsPerPage));
    setMaxITems(maxItems);
    if (maxItems < ItemsPerPage) {
      setItemsPerPage(maxItems);
    }
  }, [AllData, Page, ItemsPerPage, params.orgid, locale]);

  useEffect(() => {
    setPage(MaxPages);
  }, [MaxPages]);

  return (
    <div className="h-full w-full px-2 mx-auto flex-col flex print:p-8" ref={componentRef}>
      <div className="flex flex-wrap justify-between items-center gap-1 w-full border border-stone-300 print:border-black rounded-md p-2 text-lg font-bold print:rounded-none overflow-x-auto">
        <div className="flex gap-1 flex-1 whitespace-nowrap">
          <div>{t("customerName")}:</div>
          {loading ? (
            <div className="animate-pulse h-full p-2 px-6 bg-gray-200"></div>
          ) : (
            <div className="pr-2">{AllData?.name}</div>
          )}
        </div>

        {DisplayedData.length > 1 && (
          <>
            <button onClick={handlePrint} className="print:hidden w-fit mx-3">
              <PrinterIcon
                className="cursor-pointer hover:text-orange-500 duration-300"
                size={"30px"}
                aria-label={t("print")}
              />
            </button>

            <div className="flex gap-2 print:hidden">
              <label htmlFor="ItemsPerPage" className="whitespace-nowrap">
                {t("numberOfRows")}
              </label>
              <input
                id="ItemsPerPage"
                type="number"
                min={1}
                value={ItemsPerPage}
                className="flex items-center justify-center text-center w-20 border rounded-none border-stone-300"
                onChange={(e) =>
                  e.target.valueAsNumber <= MaxITems && setItemsPerPage(e.target.valueAsNumber)
                }
              />
            </div>

            <div className="min-w-[100px] flex items-center sm:justify-center justify-end">
              {loading ? (
                <div className="animate-pulse h-full p-2 px-6 bg-gray-200"></div>
              ) : (
                <div className="w-fit whitespace-nowrap px-3">{`${MaxPages || 0} / ${
                  Page || 0
                }`}</div>
              )}
            </div>
          </>
        )}
      </div>

      <TableUi
        columns={TransactionColumns}
        data={DisplayedData}
        filterEnabled={false}
        notfound={t("noResultsFound")}
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
