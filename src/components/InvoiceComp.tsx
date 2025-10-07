"use client";
import InvoiceHeader from "@/components/InvoiceHeader";
import { Button } from "@/components/ui/button";
import EditInvoiceBtn, { EditInvoiceT } from "@/components/ui/editInvoiceBtn";
import { Prisma } from "@prisma/client";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { ArrowBigLeft, ArrowBigRight, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import {
  GetAvaiableSalesInvoices,
  GetAvaiableReturnsInvoices,
} from "@/actions/(Invoices)/sales-invoices";
import { useTranslations } from "next-intl";

interface InvoiceBodyProps {
  EditInvoiceD: EditInvoiceT | null;
  InvoiceData: Invoice | ReturnedInvoice | null;
  label: string;
  type: "sales" | "returns";
}

type Invoice = Prisma.InvoiceGetPayload<{
  include: {
    customer: true;
    orders: {
      include: {
        Product: true;
      };
    };
    payment: true;
  };
}>;

type ReturnedInvoice = Prisma.ReturnedInvoiceGetPayload<{
  include: {
    customer: true;
    orders: {
      include: {
        Product: true;
      };
    };
  };
}>;

const InvoiceComp: React.FC<InvoiceBodyProps> = ({ EditInvoiceD, InvoiceData, label, type }) => {
  const t = useTranslations("invoice");
  const { orgid, locale } = useParams<{ orgid: string; locale: string }>();
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrintDesktop = useReactToPrint({
    content: () => componentRef.current,
    removeAfterPrint: true,
    documentTitle: `Invoice ${InvoiceData?.number} for customer ${InvoiceData?.customer.name}`,
  });
  const handlePrint = () => {
    // Check if running on mobile
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth < 769;
    if (isMobile) {
      // Create a new window/iframe for printing
      const printWindow = window.open("", "_blank");

      if (printWindow && componentRef.current) {
        // Get all stylesheets from the current document
        const styles = Array.from(document.styleSheets)
          .map((styleSheet) => {
            try {
              if (styleSheet.cssRules) {
                return Array.from(styleSheet.cssRules)
                  .map((rule) => rule.cssText)
                  .join("\n");
              }
              return null;
            } catch {
              // Stylesheets from different origins will throw security errors
              return null;
            }
          })
          .filter(Boolean)
          .join("\n");

        // Clone your component content
        const contentToPrint = componentRef.current.cloneNode(true) as Node;

        // Set up the new document with all styles
        printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print</title>
            <style>
              ${styles}
              body { margin: 0; padding: 0; }
              @media print {
                body { -webkit-print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            <div id="print-container"></div>
          </body>
        </html>
      `);

        // Append your content
        const container = printWindow.document.getElementById("print-container");
        if (container) {
          container.appendChild(contentToPrint);
        }

        // Trigger print after content is loaded
        printWindow.document.close();
        printWindow.onload = function () {
          printWindow.focus();
          setTimeout(() => {
            printWindow.print();
            // Don't close immediately to allow printing
            setTimeout(() => printWindow.close(), 500);
          }, 300);
        };
      } else {
        console.error("Print reference is null or window could not be opened");
      }
    } else {
      // Use react-to-print for desktop browsers
      handlePrintDesktop();
    }
  };
  let itemsNumber = 0;

  return (
    <>
      <div
        className="h-full max-w-3xl w-full p-5 mx-auto font-semibold whitespace-nowrap border print:w-full print:h-screen border-stone-300"
        ref={componentRef}
      >
        <InvoiceHeader />
        <div className="relative flex flex-col items-center justify-center sm:py-5 py-2 border-black border-y-2">
          <div className="sm:text-4xl text-2xl">{label}</div>
          <div className="sm:absolute left-0 flex items-center justify-center gap-2">
            {type === "sales" && (
              <>
                <div>
                  <EditInvoiceBtn
                    Invoice={EditInvoiceD}
                    orgid={orgid || ""}
                    className="h-full sm:p-2 sm:text-lg text-base sm:font-bold font-semibold text-black bg-blue-400 print:hidden hover:bg-blue-600 py-1 px-2 rounded"
                  />
                </div>
                <Link
                  className="sm:p-2 px-2 py-1 mr-auto sm:text-lg sm:font-bold font-semibold text-base duration-300 bg-blue-400 rounded print:hidden hover:bg-blue-600"
                  href={`/${orgid}/sales/releaseorder?num=${InvoiceData?.number}`}
                >
                  {t("loadingPermission")}
                </Link>
              </>
            )}
            <Button
              onClick={handlePrint}
              className="block w-fit h-fit sm:p-2 py-1 px-2 mt-2 mr-auto sm:text-lg sm:font-bold font-semibold text-base bg-blue-400 rounded print:hidden text-black hover:bg-blue-600 sm:hidden"
            >
              Print
            </Button>
          </div>
        </div>

        <div className="flex sm:flex-row flex-col justify-between w-full py-5 mb-4 border-b-2 border-black">
          <div className="flex flex-col sm:gap-4 order-2 sm:order-1 gap-1 sm:w-[60%]">
            <div className="flex sm:ps-4 text-lg">
              <label className="w-[120px] print:min-w-fit">{t("customerName")}</label>
              <div className="text-lg rounded-md w-fit truncate">
                :{" "}
                <span className="ps-2 max-w-full">
                  {InvoiceData?.customer.name.toLocaleUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex sm:ps-4 text-lg">
              <label className="w-[120px]">{t("invoiceDate")}</label>
              <div className="rounded-md w-fit">
                :
                <span className="ps-2">
                  {InvoiceData
                    ? locale === "en"
                      ? InvoiceData.date.toDateString() // Convert Date to string
                      : InvoiceData.date.toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }) || ""
                    : ""}
                </span>
              </div>
            </div>
          </div>
          <div className="flex sm:flex-col order-1 sm:items-center justify-center gap-1 sm:ml-8 text-lg">
            <div className="text-lg">
              {t("invoiceNumber")}:
              <span className="tracking-[3px]">
                {locale === "en"
                  ? InvoiceData?.number // Convert Date to string
                  : InvoiceData?.number.toLocaleString("ar-EG", {
                      useGrouping: false,
                    }) || ""}
              </span>
            </div>
            <div className="flex justify-end mr-auto">
              <NaviagteInvoices type={type} />
              <button onClick={handlePrint} className="lg:block print:hidden w-fit hidden">
                <Printer
                  size={"40px"}
                  className="duration-300 cursor-pointer hover:text-orange-500"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="p-2 border border-black overflow-hidden sm:border-none">
          <div className="overflow-x-auto sm:w-full print:w-full mx-auto">
            <table className="table min-w-[500px] sm:w-full mx-auto">
              <thead>
                <tr className="bg-orange-300">
                  <th
                    align="center"
                    className="text-lg text-black border border-black w-[5%] py-1 px-1"
                  >
                    #
                  </th>
                  <th
                    align="center"
                    className="text-lg text-black border border-black w-[65%] py-1 px-3"
                  >
                    {t("description")}
                  </th>
                  <th
                    align="center"
                    className="text-lg text-black border border-black w-[10%] py-1 px-3"
                  >
                    {t("quantity")}
                  </th>
                  <th
                    align="center"
                    className="text-lg text-black border border-black w-[10%] py-1 px-3"
                  >
                    {t("price")}
                  </th>
                  <th
                    align="center"
                    className="text-lg text-black border border-black w-[10%] py-1 px-3"
                  >
                    {t("value")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {InvoiceData?.orders.map((item) => (
                  <tr key={item.id}>
                    <th
                      align="center"
                      className="text-black font-semibold border border-black py-[2px] px-1"
                    >
                      {++itemsNumber}
                    </th>
                    <th
                      align="right"
                      className="px-3 font-semibold text-black border border-black whitespace-pre-wrap text-center sm:text-start"
                    >
                      {item.Product?.name}
                    </th>
                    <td
                      align="center"
                      className="px-3 font-semibold text-black border border-black telg"
                    >
                      {item.quantity.toLocaleString(locale === "en" ? "en-US" : "ar-EG", {
                        useGrouping: false,
                      })}
                    </td>
                    <td
                      align="center"
                      className="px-3 font-semibold text-black border border-black"
                    >
                      {item.price.toLocaleString(locale === "en" ? "en-US" : "ar-EG", {
                        useGrouping: false,
                      })}
                    </td>
                    <td
                      align="center"
                      className="px-3 font-semibold text-black border border-black"
                    >
                      {(item.price * item.quantity).toLocaleString(
                        locale === "en" ? "en-US" : "ar-EG",
                        { useGrouping: false }
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={3} className="text-lg text-black border border-black pe-2 text-end">
                    {t("totalInvoice")}
                  </th>
                  <td
                    colSpan={2}
                    align="center"
                    className="text-lg text-black bg-orange-300 border border-black"
                  >
                    {InvoiceData?.amount.toLocaleString(locale === "en" ? "en-US" : "ar-EG", {
                      useGrouping: false,
                    })}
                    <span className="text-blue-500 mx-2"></span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceComp;

// Navigation Component
const NaviagteInvoices = ({ type }: { type: "sales" | "returns" }) => {
  const { orgid, num, locale } = useParams<{ orgid: string; num: string; locale: string }>();
  const [invoices, setInvoices] = useState<{ number: number }[]>([]);
  const isRTL = locale === "ar"; // Add more RTL locales if needed

  useEffect(() => {
    const getData = async () => {
      const availableInvoices =
        type === "sales"
          ? await GetAvaiableSalesInvoices(orgid)
          : await GetAvaiableReturnsInvoices(orgid);
      setInvoices(availableInvoices);
    };
    getData();
  }, [orgid, type]);

  const currentInvoiceIndex = invoices.findIndex((item) => item.number === parseInt(num));
  const previousInvoice = invoices[currentInvoiceIndex - 1]?.number;
  const nextInvoice = invoices[currentInvoiceIndex + 1]?.number;

  return (
    <>
      {/* Previous Invoice Arrow */}
      <Link
        href={
          type === "sales"
            ? `/${orgid}/sales/showInvoice/${nextInvoice || num}`
            : `/${orgid}/returnedInvoices/showREtInvoice/${nextInvoice || num}`
        }
        className={`print:hidden w-fit flex items-center justify-center  ${
          !nextInvoice && "cursor-default"
        }`}
        prefetch
      >
        <ArrowBigLeft
          size={"30px"}
          className={`${nextInvoice ? "hover:text-orange-500" : ""} duration-300 text-3xl`}
          style={{
            transform: isRTL ? "scaleX(-1)" : "none",
          }}
        />
      </Link>
      {/* Next Invoice Arrow */}
      <Link
        href={
          type === "sales"
            ? `/${orgid}/sales/showInvoice/${previousInvoice || num}`
            : `/${orgid}/returnedInvoices/showREtInvoice/${previousInvoice || num}`
        }
        className={`print:hidden w-fit flex items-center justify-center ${
          !previousInvoice && "cursor-default"
        }`}
        prefetch
      >
        <ArrowBigRight
          size={"30px"}
          className={`${previousInvoice ? "hover:text-orange-500" : ""} duration-300 text-6xl`}
          style={{
            transform: isRTL ? "scaleX(-1)" : "none",
          }}
        />
      </Link>
    </>
  );
};
