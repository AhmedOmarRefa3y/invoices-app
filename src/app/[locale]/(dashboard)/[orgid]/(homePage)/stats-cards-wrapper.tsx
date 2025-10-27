import React from "react";
import prismaDb from "@/lib/prisma";
import { GetCustomerBalancesComparison } from "@/app/[locale]/(dashboard)/[orgid]/(homePage)/data/stats-data";
import StatsCardClient from "@/app/[locale]/(dashboard)/[orgid]/(homePage)/components/stats-card-client";

interface StatsCardsWrapperProps {
  orgid: string;
  locale?: string;
}

const StatsCardsWrapper = async ({ orgid, locale }: StatsCardsWrapperProps) => {
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

  // Fetch this month's returns (negative sales)
  const thisMonthReturns = await prismaDb.returnedInvoice.aggregate({
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

  // Fetch previous month's returns
  const prevMonthReturns = await prismaDb.returnedInvoice.aggregate({
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

  // Fetch this year's returns
  const thisYearReturns = await prismaDb.returnedInvoice.aggregate({
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

  // Fetch previous year's returns
  const prevYearReturns = await prismaDb.returnedInvoice.aggregate({
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

  const allCustomersBalances = await GetCustomerBalancesComparison({ orgid });

  // Calculate net sales (gross sales minus returns)
  const thisMonthNetSales = (thisMonthSales._sum.amount || 0) - (thisMonthReturns._sum.amount || 0);
  const prevMonthNetSales = (prevMonthSales._sum.amount || 0) - (prevMonthReturns._sum.amount || 0);
  const thisYearNetSales = (thisYearSales._sum.amount || 0) - (thisYearReturns._sum.amount || 0);
  const prevYearNetSales = (prevYearSales._sum.amount || 0) - (prevYearReturns._sum.amount || 0);

  // Calculate percentages based on net sales
  const monthSalesPercentage =
    prevMonthNetSales && prevMonthNetSales > 0
      ? ((thisMonthNetSales - prevMonthNetSales) / prevMonthNetSales) * 100
      : 0;

  const yearSalesPercentage =
    prevYearNetSales && prevYearNetSales > 0
      ? ((thisYearNetSales - prevYearNetSales) / prevYearNetSales) * 100
      : 0;

  const prev = prevMonthPayments._sum.amount ?? 0;
  const curr = thisMonthPayments._sum.amount ?? 0;

  const paymentsPercentage = prev > 0 ? ((curr - prev) / prev) * 100 : curr > 0 ? 100 : 0;

  const creditPercentage =
    (allCustomersBalances.currentDay.balance / allCustomersBalances.previousMonth.balance) * 100 -
      100 || 0;

  // Format currency
  const formatCurrency = (value: number | null) => {
    const locales = locale === "en" ? "en-US" : "ar-EG";
    const currency = locale === "en" ? "USD" : "EGP";
    return (value || 0).toLocaleString(locales, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  const stats = [
    {
      title: "monthNetSales",
      value: formatCurrency(thisMonthNetSales),
      color: "text-teal-500",
      percentage: formatPercentage(monthSalesPercentage),
      percentageColor: monthSalesPercentage >= 0 ? "text-green-500" : "text-red-500",
      previousPeriod: ` ${formatCurrency(prevMonthNetSales)}`,
      currentPeriod: `الشهر الماضي ${formatCurrency(prevMonthNetSales)}`,
    },
    {
      title: "yearNetSales",
      value: formatCurrency(thisYearNetSales),
      color: "text-blue-500",
      percentage: formatPercentage(yearSalesPercentage),
      percentageColor: yearSalesPercentage >= 0 ? "text-green-500" : "text-red-500",
      previousPeriod: ` ${formatCurrency(prevYearNetSales)}`,
      currentPeriod: `السنة الماضية ${formatCurrency(prevYearNetSales)}`,
    },
    {
      title: "monthPayments",
      value: formatCurrency(thisMonthPayments._sum.amount),
      color: "text-pink-500",
      percentage: formatPercentage(paymentsPercentage),
      percentageColor: paymentsPercentage >= 0 ? "text-green-500" : "text-red-500",
      previousPeriod: ` ${formatCurrency(prevMonthPayments._sum.amount)}`,
      currentPeriod: `الشهر الماضي ${formatCurrency(prevMonthPayments._sum.amount)}`,
    },
    {
      title: "customerBalance",
      value: formatCurrency(allCustomersBalances.currentDay.balance),
      color: "text-orange-500",
      percentage: formatPercentage(creditPercentage),
      percentageColor: creditPercentage >= 0 ? "text-red-500" : "text-green-500",
      previousPeriod: ` ${formatCurrency(allCustomersBalances.previousMonth.balance)}`,
      currentPeriod: `الشهر الماضي ${formatCurrency(allCustomersBalances.currentDay.balance)}`,
    },
  ];

  return (
    <div className=" w-full h-full">
      <div className="grid grid-rows-2 grid-cols-2 gap-1 h-full">
        {stats.map((stat, index) => (
          <StatsCardClient key={index} stat={stat} />
        ))}
      </div>
    </div>
  );
};

export default StatsCardsWrapper;
