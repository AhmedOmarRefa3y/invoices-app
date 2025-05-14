"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useParams } from "next/navigation";

const SalesChart = ({ initialData }: { initialData: Array<{ month: string; total: number }> }) => {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md h-80">
      <h3 className="text-lg font-semibold mb-4">
        {locale === "ar" ? "المبيعات الشهرية" : "Monthly Sales"}
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={initialData}>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            reversed={locale === "ar"}
            padding={{ left: 20 }}
          />
          <YAxis
            tickFormatter={(value) => value.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}
            tick={{ fontSize: 12 }} // Add this line
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
