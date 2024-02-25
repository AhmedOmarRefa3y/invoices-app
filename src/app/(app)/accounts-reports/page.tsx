import { Button } from "@/components/ui/button";
import DeleteCustomerBtn from "@/components/ui/deleteCustomerBtn";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { GetCustomersBalances } from "./utils";
import { TableUi } from "@/components/table";
import { CustomerBalanceColumns, CustomerBalanceT } from "./columns";

const AccountStatementPage = async () => {
    const CustomersBalance = await GetCustomersBalances();
    const formattedCustomersBalance: CustomerBalanceT[] = CustomersBalance.map(
        (customer) => {
            const PageNum = Math.ceil(customer.customerRecordsNumber / 14);

            const ItemsPageNum = Math.floor(
                customer.customerRecordsNumberWithitems / 14
            );
            return {
                customerID: customer.id,
                currentBalance: customer.currntBalance,
                CustomerCredit: customer.CustomerCredit,
                customerName: customer.name,
                CustomerTotalCredit: customer.CustomerTotalCredit,
                CustomerTotalDebit: customer.CustomerTotalDebit,
                PageNum,
                ItemsPageNum,
            };
        }
    );

    return (
        <div className="mt-4 mx-4 h-full min-h-screen rounded-lg overflow-hidden">
            {/* <table className="table table-xs h-full  rounded-md">
                <thead className="text-white text-lg">
                    <tr className="border-b-2">
                        <th align="center" className=" bg-transparent"></th>
                        <td
                            align="center"
                            className=" bg-slate-500 py-3 border-l-2 border-black"
                            colSpan={2}
                            slot=""
                        >
                            رصيد افتتاحي
                        </td>
                        <td
                            align="center"
                            className=" bg-slate-500 border-l-2 border-black"
                            colSpan={2}
                        >
                            الحركة
                        </td>

                        <td
                            align="center"
                            className=" bg-slate-500"
                            colSpan={2}
                        >
                            الرصيد
                        </td>
                    </tr>

                    <tr className="bg-slate-500 rounded-lg">
                        <th
                            align="center"
                            className="w-[30%] border-l-2 border-black"
                        >
                            اسم العميل
                        </th>

                        <th
                            align="center"
                            className="w-[10%] border-l-2 border-black"
                        >
                            مدين
                        </th>
                        <th
                            align="center"
                            className="w-[10%] border-l-2 border-black"
                        >
                            دائن
                        </th>
                        <th
                            align="center"
                            className="w-[10%] border-l-2 border-black"
                        >
                            مدين
                        </th>
                        <th
                            align="center"
                            className="w-[10%] border-l-2 border-black"
                        >
                            دائن
                        </th>
                        <th
                            align="center"
                            className="w-[10%] border-l-2 border-black"
                        >
                            مدين
                        </th>
                        <th
                            align="center"
                            className="w-[10%] border-l-2 border-black"
                        >
                            دائن
                        </th>
                        <th
                            align="center"
                            className="w-[10%] border-l-2 border-black"
                        >
                            كشف حساب
                        </th>
                    </tr>
                </thead>

                <tbody className="bg-white  ">
                    {CustomersBalance.map((customer) => {
                        const PageNum = Math.ceil(
                            customer.customerRecordsNumber / 14
                        );

                        const ItemsPageNum = Math.floor(
                            customer.customerRecordsNumberWithitems / 14
                        );

                        return (
                            <tr key={customer.id} className="text-lg font-bold">
                                <td
                                    align="center"
                                    className="  text-lg font-bold border-l-2 border-black"
                                >
                                    {customer.name}
                                </td>
                                <td
                                    align="center"
                                    className="border-l-2 text-lg font-bold  border-black"
                                >
                                    {customer.CustomerCredit > 0
                                        ? customer.CustomerCredit
                                        : ""}
                                </td>
                                <td
                                    align="center"
                                    className="border-l-2 text-lg font-bold border-black"
                                >
                                    {customer.CustomerCredit < 0
                                        ? customer.CustomerCredit * -1
                                        : ""}
                                </td>
                                <td
                                    align="center"
                                    className="border-l-2 text-lg font-bold border-black"
                                >
                                    {customer.CustomerTotalDebit > 0
                                        ? customer.CustomerTotalDebit
                                        : ""}
                                </td>
                                <td
                                    align="center"
                                    className="border-l-2 text-lg font-bold border-black"
                                >
                                    {customer.CustomerTotalCredit > 0
                                        ? customer.CustomerTotalCredit
                                        : ""}
                                </td>
                                <td
                                    align="center"
                                    className="border-l-2 text-lg font-bold border-black"
                                >
                                    {customer.currntBalance > 0
                                        ? customer.currntBalance
                                        : ""}
                                </td>
                                <td
                                    align="center"
                                    className="border-l-2 text-lg font-bold border-black"
                                >
                                    {customer.currntBalance >= 0
                                        ? ""
                                        : customer.currntBalance * -1}
                                </td>
                                <td align="center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0 "
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="flex flex-col">
                                            <DropdownMenuItem>
                                                <Link
                                                    href={`/accounts-reports/customer-credit/?customerid=${
                                                        customer.id
                                                    }&Debit=true&Credit=true&page=${
                                                        PageNum < 1
                                                            ? 1
                                                            : PageNum
                                                    }`}
                                                    className="bg-orange-400 p-2 rounded-md basis-[100%] text-center"
                                                >
                                                    كشف حساب
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Link
                                                    href={`/accounts-reports/customer-credit-with-items/?customerid=${
                                                        customer.id
                                                    }&Debit=true&Credit=true&page=${
                                                        ItemsPageNum < 1
                                                            ? 1
                                                            : ItemsPageNum
                                                    }`}
                                                    className="bg-orange-400 p-2 rounded-md basis-[100%] text-center"
                                                >
                                                    كشف حساب بالاصناف
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <DeleteCustomerBtn
                                                    id={customer.id}
                                                />
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table> */}
            <TableUi
                columns={CustomerBalanceColumns}
                data={formattedCustomersBalance}
                filterAccessorKey="customerName"
                filterlabel="اسم العميل"
                filterplaceholder="البحث عن العميل"
                notfound="لا يوجد عميل بهذا الاسم"
            />
        </div>
    );
};

export default AccountStatementPage;
