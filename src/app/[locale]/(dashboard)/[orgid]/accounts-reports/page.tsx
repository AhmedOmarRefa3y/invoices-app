import { TableUi } from "@/components/table";
import { CustomerBalanceColumns, CustomerBalanceT } from "./columns";
import { GetCustomersBalances } from "./utils";
import { getTranslations } from "next-intl/server";

const AccountStatementsPage = async ({
  params,
}: {
  params: Promise<{ id: string; orgid: string }>;
}) => {
  const { orgid } = await params;
  const CustomersBalance = await GetCustomersBalances({
    orgid: orgid,
  });
  const t = await getTranslations("AccountStatementPage");

  const formattedCustomersBalance: CustomerBalanceT[] | [] =
    CustomersBalance?.map((customer) => {
      const PageNum = Math.ceil(customer.customerRecordsNumber / 14);

      const ItemsPageNum = Math.floor(customer.customerRecordsNumberWithitems / 14);
      return {
        customerID: customer.id,
        currentBalance: customer.currntBalance,
        CustomerCredit: customer.CustomerCredit,
        customerName: customer.name,
        CustomerTotalCredit: customer.CustomerTotalCredit,
        CustomerTotalDebit: customer.CustomerTotalDebit,
        PageNum,
        ItemsPageNum,
        orgid: orgid,
      };
    }) || [];

  return (
    <div className=" h-full px-2  w-full ">
      <TableUi
        columns={CustomerBalanceColumns}
        data={formattedCustomersBalance}
        filterAccessorKey="customerName"
        filterlabel={t("filterlabel")}
        filterplaceholder={t("filterplaceholder")}
        notfound={t("notfound")}
      />
    </div>
  );
};

export default AccountStatementsPage;
