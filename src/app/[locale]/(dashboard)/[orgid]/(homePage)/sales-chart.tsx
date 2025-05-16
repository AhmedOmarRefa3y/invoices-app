"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useParams } from "next/navigation";

const SalesChart = ({ initialData }: { initialData: Array<{ month: string; total: number }> }) => {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md h-full">
      <h3 className="text-lg font-semibold mb-4 text-teal-500">
        {locale === "ar" ? "المبيعات الشهرية" : "Monthly Sales"}
      </h3>
      <ResponsiveContainer className="w-full" height="90%">
        <BarChart
          data={initialData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            reversed={locale === "ar"}
            alignmentBaseline="middle"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickMargin={locale === "ar" ? 42 : 0}
            tickFormatter={(value) => value.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}
          />
          <Tooltip
            formatter={(value) => [
              value.toLocaleString(locale === "ar" ? "ar-SA" : "en-US"),
              locale === "ar" ? "المبلغ" : "Amount",
            ]}
          />
          <Bar dataKey="total" fill="#4f46e5" name={locale === "ar" ? "المبلغ" : "Amount"} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
