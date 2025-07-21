"use client";
import { Prisma } from "@prisma/client";
import { useRouter } from "@/i18n/routing";
import React, { useRef } from "react";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { ReleaseOrderData } from "./releaseOrder-utils";
import { ArrowBigLeft, ArrowBigRight, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

interface InvoiceBodyProps {
  invoices: invoice[];
}

type invoice = Prisma.InvoiceGetPayload<{
  include: {
    customer: true;
    lineItems: {
      include: {
        product: {
          include: {
            unit: true;
          };
        };
      };
    };
    payment: true;
  };
}>;

const InvoiceBody: React.FC<InvoiceBodyProps> = ({ invoices }) => {
  const t = useTranslations("releaseOrder"); // Load translations
  const router = useRouter();
  const searchParams = useSearchParams();
  const num: number = parseInt(searchParams.get("num") || "1");
  const componentRef = useRef<HTMLDivElement>(null);
  const { orgid, locale } = useParams();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  // const curruntInvoice = invoices[num - 1] || invoices[0]; // Default to first invoice if num is out of range
  // console.log("Current Invoice:", curruntInvoice);

  const { items, curruntInvoice } = ReleaseOrderData(invoices, num);

  const findPerviousInvoice = () => {
    const curruntInvoiceIndex = invoices.findIndex(
      (item) => item.number === curruntInvoice?.number
    );

    const PerviousInvoice = invoices[curruntInvoiceIndex - 1];
    if (PerviousInvoice) {
      router.replace(`?num=${PerviousInvoice.number}`);
    }
  };

  const findNextInvoice = () => {
    const curruntInvoiceIndex = invoices.findIndex(
      (item) => item.number === curruntInvoice?.number
    );

    const nextInvoice = invoices[curruntInvoiceIndex + 1];

    if (nextInvoice) {
      router.replace(`?num=${nextInvoice.number}`);
    }
  };

  return (
    <div
      className="h-full max-w-3xl w-full p-5 mx-auto font-semibold whitespace-nowrap border print:w-full print:h-screen border-stone-300"
      ref={componentRef}
    >
      <div className="relative flex flex-col items-center justify-center sm:py-5 py-2 border-black border-y-2">
        <div className="sm:text-4xl text-2xl">{t("releaseOrder")}</div>
        <div className="sm:absolute left-0 flex items-center justify-center gap-2">
          <Link
            className="sm:p-2 px-2 py-1 mr-auto sm:text-lg sm:font-bold font-semibold text-base duration-300 bg-blue-400 rounded print:hidden hover:bg-blue-600"
            href={`/${orgid}/sales/showInvoice/${curruntInvoice?.number}`}
          >
            {t("viewInvoice")}
          </Link>
          <Button
            onClick={handlePrint}
            className="block w-fit h-fit sm:p-2 py-1 px-2 mr-auto sm:text-lg sm:font-bold font-semibold text-base bg-blue-400 rounded print:hidden text-black hover:bg-blue-600 sm:hidden"
          >
            {t("print")}
          </Button>
        </div>
      </div>
      <div className="flex sm:flex-row flex-col justify-between w-full py-5 mb-4 border-b-2 border-black">
        <div className="flex flex-col sm:gap-4 order-2 sm:order-1 gap-1 sm:w-[60%]">
          <div className="flex sm:pr-4 text-lg">
            <label className="w-[102px]">{t("customerName")}</label>
            <div className="text-lg rounded-md w-fit">
              : <span className="pr-2">{curruntInvoice?.customer.name.toLocaleUpperCase()}</span>
            </div>
          </div>
          <div className="flex sm:pr-4 text-lg">
            <label className="w-[102px]">{t("orderDate")}</label>
            <div className="rounded-md w-fit">
              :{" "}
              <span className="pr-2">
                {curruntInvoice
                  ? locale === "en"
                    ? curruntInvoice.date.toDateString() // Convert Date to string
                    : curruntInvoice.date.toLocaleDateString("ar-EG", {
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
            {t("orderNumber")}:
            <span className="tracking-[3px]">
              {num.toLocaleString("en-US", {
                useGrouping: false,
              })}
            </span>
          </div>
          <div className="flex justify-end mr-auto">
            <button onClick={findNextInvoice} className="print:hidden w-fit block">
              <ArrowBigRight size={"30px"} />
            </button>
            <button onClick={findPerviousInvoice} className="print:hidden w-fit block">
              <ArrowBigLeft size={"30px"} />
            </button>
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
          <table className="table min-w-[500px] mx-auto table-xs">
            <thead>
              <tr className="bg-slate-500">
                <th align="center" className="text-lg text-black border border-black w-[5%] py-1">
                  #
                </th>
                <th align="center" className="text-lg text-black border border-black w-[50%] px-3">
                  {t("description")}
                </th>
                <th align="center" className="text-lg text-black border border-black w-[5%] px-3">
                  {t("quantity")}
                </th>
                <th align="center" className="text-lg text-black border border-black w-[10%] px-3">
                  {t("unit")}
                </th>
                <th align="center" className="text-lg text-black border border-black w-[25%] px-3">
                  {t("notes")}
                </th>
              </tr>
            </thead>
            <tbody>
              {items?.map((item, index) => (
                <tr key={index}>
                  <th
                    align="center"
                    className="text-base text-black font-semibold border border-black py-1"
                  >
                    {index + 1}
                  </th>
                  <th
                    align="right"
                    className="text-base text-black font-semibold border border-black px-3"
                  >
                    {item.name}
                  </th>
                  <th
                    align="center"
                    className="text-base text-black font-semibold border border-black"
                  >
                    {item.quantity}
                  </th>
                  <th
                    align="center"
                    className="text-base text-black font-semibold border border-black"
                  >
                    {item.unit}
                  </th>
                  <th
                    align="center"
                    className="text-base text-black font-semibold border border-black"
                  ></th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceBody;
