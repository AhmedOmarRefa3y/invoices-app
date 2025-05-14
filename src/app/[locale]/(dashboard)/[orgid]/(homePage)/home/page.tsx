import InvoiceTableWrapper from "./invoice-table-wrapper";
import SalesChartWrapper from "./sales-chart-wrapper";
import TopCustomersWrapper from "./top-customers-wrapper";
import TopProductsWrapper from "./top-products-wrapper";

export default function Home({ params }: { params: { orgid: string } }) {
  return (
    <div className="bg-gray-50 p-2 gap-2 flex h-full">
      <div className="w-4/6 max-h-[60%] h-fit">
        <TopProductsWrapper orgid={params.orgid} />
      </div>
      <SalesChartWrapper orgid={params.orgid} />

      <div className="flex flex-col gap-2 w-3/6 h-full">
        <div className="h-[45%]">
          <TopCustomersWrapper orgid={params.orgid} />
        </div>
        <div className="h-[55%]">
          <InvoiceTableWrapper orgid={params.orgid} />
        </div>
      </div>
    </div>
  );
}
