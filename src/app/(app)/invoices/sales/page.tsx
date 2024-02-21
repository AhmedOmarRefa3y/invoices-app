import { GetSalesInvoices } from "./sales-utils";

import InvoiceActions from "./tableComponents/InvoiceActions";
import { columns } from "./tableComponents/columns";
import { DataTable } from "./tableComponents/data-table";

const ShowInvoices = async () => {
    const Invoices = await GetSalesInvoices();
    return (
        <div className=" border-gray-200  bg-opacity-50 relative max-h-screen ">
            <DataTable columns={columns} data={Invoices} />
            {/* <table className="w-full relative">
                <thead className="bg-[#64748b] text-center py-2 text-white sticky top-0">
                    <tr>
                        <th className="w-[10%] py-2">رقم الفاتورة</th>
                        <th className="w-[10%]">تاريخ الفاتورة</th>
                        <th className="w-[20%]">اسم العميل</th>
                        <th className="w-[10%]">قيمة الفاتورة</th>
                        <th className="w-[10%]">المدفوع</th>
                        <th className="w-[10%]">المزيد</th>
                    </tr>
                </thead>
                <tbody className="text-center bg-white">
                    {Invoices.map((item, i) => {
                        return (
                            <tr
                                key={i}
                                className="odd:bg-white even:bg-slate-200 hover:text-sky-500 duration-150 text-lg font-bold "
                            >
                                <td>{item.number}</td>
                                <td>
                                    {item.date.toLocaleDateString("ar-EG", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </td>
                                <td>{item.customerName}</td>
                                <td>
                                    {item.amount.toLocaleString("ar-EG", {
                                        useGrouping: false,
                                    })}
                                </td>
                                <td>
                                    {item.PaidAmount
                                        ? item.PaidAmount.toLocaleString(
                                              "ar-EG",
                                              {
                                                  useGrouping: false,
                                              }
                                          )
                                        : ""}
                                </td>
                                <td>
                                    <InvoiceActions item={item} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table> */}
        </div>
    );
};

export default ShowInvoices;
