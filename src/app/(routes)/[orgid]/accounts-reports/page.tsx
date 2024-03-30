import { TableUi } from "@/components/table";
import { CustomerBalanceColumns, CustomerBalanceT } from "./columns";
import { GetCustomersBalances } from "./utils";

const AccountStatementPage = async ({
    params,
}: {
    params: { orgid: string };
}) => {
    const CustomersBalance = await GetCustomersBalances({
        orgid: params.orgid,
    });
    const formattedCustomersBalance: CustomerBalanceT[] | [] =
        CustomersBalance?.map((customer) => {
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
                orgid: params.orgid,
            };
        }) || [];

    return (
        <div className="mt-4 mx-4 h-full min-h-screen rounded-lg overflow-hidden">
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
