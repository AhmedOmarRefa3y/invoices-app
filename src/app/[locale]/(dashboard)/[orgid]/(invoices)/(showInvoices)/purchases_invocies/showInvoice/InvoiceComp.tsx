"use client";
import InvoiceHeader from "@/components/InvoiceHeader";
import { Button } from "@/components/ui/button";
import { Prisma } from "@prisma/client";
import { useRouter } from "@/i18n/routing";
import React from "react";
import { ArrowBigLeft, ArrowBigRight, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { useTranslations } from "next-intl";

interface InvoiceBodyProps {
  invoices: PurchInvoice[];
  componentRef: React.MutableRefObject<null>;
  orgid?: string;
  curruntInvoice: PurchInvoice | undefined;
  num: number;
  nextInvoice: number | undefined;
  PerviousInvoice: number | undefined;
  label: string;
}

type PurchInvoice = Prisma.PurchaseInvoiceGetPayload<{
  include: {
    Supplier: true;
    lineItems: {
      include: {
        product: true;
      };
    };
  };
}>;

const InvoiceComp: React.FC<InvoiceBodyProps> = ({
  componentRef,
  curruntInvoice,
  num,
  nextInvoice,
  PerviousInvoice,
}) => {
  const t = useTranslations("purchaseInvoice.display");
  const router = useRouter();

  const handlePrint = useReactToPrint({
    contentRef: componentRef, // <-- Correct property name
    documentTitle: `${t("title")} ${num} ${t("supplierName")} ${curruntInvoice?.Supplier.name}`,
  });

  let itemsNumber = 0;

  return (
    <>
      <div
        className="h-full max-w-3xl w-full p-5 mx-auto font-semibold whitespace-nowrap border print:w-full print:h-screen border-stone-300"
        ref={componentRef}
      >
        <InvoiceHeader />
        <div className="relative flex flex-col items-center justify-center sm:py-5 py-2 border-black border-y-2">
          <div className="sm:text-4xl text-2xl">{t("title")}</div>
          <div className="sm:absolute left-0 flex items-center justify-center gap-2">
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
              <label className="w-[102px]">{t("supplierName")}</label>
              <div className="text-lg rounded-md w-fit">
                : <span className="pr-2">{curruntInvoice?.Supplier.name.toLocaleUpperCase()}</span>
              </div>
            </div>
            <div className="flex sm:pr-4 text-lg">
              <label className="w-[102px]">{t("invoiceDate")}</label>
              <div className="rounded-md w-fit">
                :{" "}
                <span className="pr-2">
                  {curruntInvoice
                    ? curruntInvoice.date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : ""}
                </span>
              </div>
            </div>
          </div>
          <div className="flex sm:flex-col order-1  sm:items-center justify-center gap-1 sm:ml-8 text-lg ">
            <div className="text-lg">
              {t("invoiceNumber")} :
              <span className=" tracking-[3px]">
                {num.toLocaleString("en-US", {
                  useGrouping: false,
                })}
              </span>
            </div>
            <div className="flex justify-end mr-auto">
              <button
                onClick={() => {
                  if (nextInvoice) {
                    router.push(`?num=${nextInvoice}`);
                  }
                }}
                className={`print:hidden  w-fit block ${!nextInvoice && "cursor-default"} `}
              >
                <ArrowBigRight
                  size={"30px"}
                  className={`${
                    nextInvoice ? "hover:text-orange-500" : ""
                  }   duration-300 text-6xl`}
                />
              </button>
              <button
                onClick={() => {
                  if (PerviousInvoice) {
                    router.push(`?num=${PerviousInvoice}`);
                  }
                }}
                className={`print:hidden  w-fit block ${!PerviousInvoice && "cursor-default"} `}
              >
                <ArrowBigLeft
                  size={"30px"}
                  className={`${
                    PerviousInvoice ? "hover:text-orange-500" : ""
                  }   duration-300 text-3xl`}
                />
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
        {/* items */}
        <div className=" p-2 border border-black overflow-hidden sm:border-none">
          <div className="overflow-x-auto  sm:w-full print:w-full mx-auto">
            <table className="table min-w-[500px] sm:w-full mx-auto ">
              {/* head */}
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
                {curruntInvoice?.lineItems.map((item) => {
                  itemsNumber += 1;
                  return (
                    <tr key={item.id}>
                      <th
                        align="center"
                        className=" text-black font-semibold border border-black py-[2px] px-1"
                      >
                        {itemsNumber}
                      </th>
                      <th
                        align="right"
                        className="px-3 font-semibold text-black border border-black whitespace-pre-wrap text-center sm:text-right"
                      >
                        {item.product?.name}
                      </th>

                      <td
                        align="center"
                        className="px-3 font-semibold text-black border border-black telg"
                      >
                        {item.quantity.toLocaleString("ar-EG", {
                          useGrouping: false,
                        })}
                      </td>
                      <td
                        align="center"
                        className="px-3 font-semibold text-black border border-black "
                      >
                        {item.price?.toLocaleString("ar-EG", {
                          useGrouping: false,
                        })}
                      </td>
                      <td
                        align="center"
                        className="px-3 font-semibold text-black border border-black "
                      >
                        {((item.price || 1) * item.quantity).toLocaleString("ar-EG", {
                          useGrouping: false,
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={3} align="left" className="text-lg text-black border border-black">
                    {t("totalInvoice")}
                  </th>

                  <td
                    colSpan={2}
                    align="center"
                    className="text-lg text-black bg-orange-300 border border-black"
                  >
                    {curruntInvoice?.amount.toLocaleString("ar-EG", {
                      useGrouping: false,
                    })}
                    $$
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
