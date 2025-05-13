import InvoiceTable from "./invoice-table";

export default function Home({ params }: { params: { orgid: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <InvoiceTable orgid={params.orgid} />
    </div>
  );
}
