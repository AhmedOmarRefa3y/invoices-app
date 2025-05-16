import React from "react";
import prismaDb from "@/lib/prisma";

interface StatsCardsWrapperProps {
  orgid: string;
}

const StatsCardsWrapper = async ({ orgid }: StatsCardsWrapperProps) => {
  // Get current date information
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // Calculate start and end dates for current month
  const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
  const endOfMonth = new Date(currentYear, currentMonth, 0);

  // Calculate start and end dates for previous month
  const startOfPrevMonth = new Date(currentYear, currentMonth - 2, 1);
  const endOfPrevMonth = new Date(currentYear, currentMonth - 1, 0);

  // Calculate start and end dates for current year
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31);

  // Calculate start and end dates for previous year
  const startOfPrevYear = new Date(currentYear - 1, 0, 1);
  const endOfPrevYear = new Date(currentYear - 1, 11, 31);

  console.log(startOfMonth, startOfMonth);

  // Fetch this month's sales
  const thisMonthSales = await prismaDb.invoice.aggregate({
    where: {
      organizationId: orgid,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    _sum: {
      amount: true,
    },
  });

  // Fetch previous month's sales
  const prevMonthSales = await prismaDb.invoice.aggregate({
    where: {
      organizationId: orgid,
      date: {
        gte: startOfPrevMonth,
        lte: endOfPrevMonth,
      },
    },
    _sum: {
      amount: true,
    },
  });

  // Fetch this year's sales
  const thisYearSales = await prismaDb.invoice.aggregate({
    where: {
      organizationId: orgid,
      date: {
        gte: startOfYear,
        lte: endOfYear,
      },
    },
    _sum: {
      amount: true,
    },
  });

  // Fetch previous year's sales
  const prevYearSales = await prismaDb.invoice.aggregate({
    where: {
      organizationId: orgid,
      date: {
        gte: startOfPrevYear,
        lte: endOfPrevYear,
      },
    },
    _sum: {
      amount: true,
    },
  });

  // Fetch this month's payments
  const thisMonthPayments = await prismaDb.payment.aggregate({
    where: {
      organizationId: orgid,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    _sum: {
      amount: true,
    },
  });

  // Fetch previous month's payments
  const prevMonthPayments = await prismaDb.payment.aggregate({
    where: {
      organizationId: orgid,
      date: {
        gte: startOfPrevMonth,
        lte: endOfPrevMonth,
      },
    },
    _sum: {
      amount: true,
    },
  });

  // Fetch total customer credit
  const customerCredit = await prismaDb.customer.aggregate({
    where: {
      organizationId: orgid,
    },
    _sum: {
      CustomerCredit: true,
    },
  });

  // Fetch previous month's customer credit
  const prevMonthCustomerCredit = await prismaDb.customer.aggregate({
    where: {
      organizationId: orgid,
      updatedAt: {
        lte: endOfPrevMonth,
      },
    },
    _sum: {
      CustomerCredit: true,
    },
  });

  // Calculate percentages
  const monthSalesPercentage =
    prevMonthSales._sum.amount && prevMonthSales._sum.amount > 0
      ? (((thisMonthSales._sum.amount || 0) - (prevMonthSales._sum.amount || 0)) /
          (prevMonthSales._sum.amount || 1)) *
        100
      : 0;

  const yearSalesPercentage =
    prevYearSales._sum.amount && prevYearSales._sum.amount > 0
      ? (((thisYearSales._sum.amount || 0) - (prevYearSales._sum.amount || 0)) /
          (prevYearSales._sum.amount || 1)) *
        100
      : 0;

  const paymentsPercentage =
    prevMonthPayments._sum.amount && prevMonthPayments._sum.amount > 0
      ? (((thisMonthPayments._sum.amount || 0) - (prevMonthPayments._sum.amount || 0)) /
          (prevMonthPayments._sum.amount || 1)) *
        100
      : 0;

  const creditPercentage =
    prevMonthCustomerCredit._sum.CustomerCredit && prevMonthCustomerCredit._sum.CustomerCredit > 0
      ? (((customerCredit._sum.CustomerCredit || 0) -
          (prevMonthCustomerCredit._sum.CustomerCredit || 0)) /
          (prevMonthCustomerCredit._sum.CustomerCredit || 1)) *
        100
      : 0;

  // Format currency
  const formatCurrency = (value: number | null) => {
    return `${(value || 0).toLocaleString("ar-EG")} ج `;
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  const stats = [
    {
      title: "مبيعات الشهر",
      value: formatCurrency(thisMonthSales._sum.amount),
      color: "text-teal-500",
      percentage: formatPercentage(monthSalesPercentage),
      percentageColor: monthSalesPercentage >= 0 ? "text-green-500" : "text-red-500",
      previousPeriod: `السابق ${formatCurrency(prevMonthSales._sum.amount)}`,
      currentPeriod: `الشهر الماضي ${formatCurrency(prevMonthSales._sum.amount)}`,
    },
    {
      title: "مبيعات السنة",
      value: formatCurrency(thisYearSales._sum.amount),
      color: "text-blue-500",
      percentage: formatPercentage(yearSalesPercentage),
      percentageColor: yearSalesPercentage >= 0 ? "text-green-500" : "text-red-500",
      previousPeriod: `السابق ${formatCurrency(prevYearSales._sum.amount)}`,
      currentPeriod: `السنة الماضية ${formatCurrency(prevYearSales._sum.amount)}`,
    },
    {
      title: "مدفوعات الشهر",
      value: formatCurrency(thisMonthPayments._sum.amount),
      color: "text-pink-500",
      percentage: formatPercentage(paymentsPercentage),
      percentageColor: paymentsPercentage >= 0 ? "text-green-500" : "text-red-500",
      previousPeriod: `السابق ${formatCurrency(prevMonthPayments._sum.amount)}`,
      currentPeriod: `الشهر الماضي ${formatCurrency(prevMonthPayments._sum.amount)}`,
    },
    {
      title: "رصيد العملاء",
      value: formatCurrency(customerCredit._sum.CustomerCredit),
      color: "text-orange-500",
      percentage: formatPercentage(creditPercentage),
      percentageColor: creditPercentage >= 0 ? "text-green-500" : "text-red-500",
      previousPeriod: `السابق ${formatCurrency(prevMonthCustomerCredit._sum.CustomerCredit)}`,
      currentPeriod: `الشهر الماضي ${formatCurrency(prevMonthCustomerCredit._sum.CustomerCredit)}`,
    },
  ];

  return (
    <div className=" w-full h-full">
      <div className="grid grid-rows-2 grid-cols-2 gap-1 h-full">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 flex flex-col justify-center"
          >
            <p className="text-gray-600 text-right text-lg font-bold mt-1">{stat.title}</p>
            <div className="flex justify-between items-start">
              <h3 className={`text-xl font-bold ${stat.color}`}>{stat.value}</h3>
            </div>
            <span className={`text-sm ${stat.percentageColor}`}>{stat.percentage}</span>
            <div className=" text-xs text-gray-500 text-right">
              <p>{stat.previousPeriod}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCardsWrapper;
