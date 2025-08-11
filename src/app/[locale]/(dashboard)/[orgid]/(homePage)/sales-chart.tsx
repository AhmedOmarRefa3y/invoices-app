"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useParams } from "next/navigation";

const SalesChart = ({ initialData }: { initialData: Array<{ month: string; total: number }> }) => {
  const params = useParams();
  const locale = params.locale as string;

  // Check if there's data to display
  const hasData = initialData && initialData.length > 0;

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-teal-500">
        {locale === "ar" ? "المبيعات الشهرية" : "Monthly Sales"}
      </h3>
      <div className="flex-1">
        {hasData ? (
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
              <XAxis dataKey="month" tick={{ fontSize: 12 }} alignmentBaseline="middle" />

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
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {locale === "ar" ? "لا توجد بيانات مبيعات" : "No sales data yet"}
            </h3>
            <p className="text-gray-500 mb-4">
              {locale === "ar" 
                ? "ابدأ بتسجيل مبيعاتك لرؤية الرسم البياني" 
                : "Start recording sales to see the chart"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesChart;
