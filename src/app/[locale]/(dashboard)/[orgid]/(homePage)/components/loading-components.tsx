"use client";

import React from "react";

// Loading component for Stats Cards
export function StatsCardsLoading() {
  return (
    <div className="grid grid-rows-2 grid-cols-2 gap-1 h-full">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
}

// Loading component for Invoice Table
export function InvoiceTableLoading() {
  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-lg h-full">
      <div className="p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between py-2">
              <div className="h-3 bg-gray-200 rounded w-1/6"></div>
              <div className="h-3 bg-gray-200 rounded w-1/6"></div>
              <div className="h-3 bg-gray-200 rounded w-1/6"></div>
              <div className="h-3 bg-gray-200 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Loading component for Sales Chart
export function SalesChartLoading() {
  return (
    <div className="w-full bg-white rounded-lg shadow-md h-full flex flex-col">
      <div className="p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="flex items-center justify-center h-full">
          <div className="w-4/5 h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

// Loading component for Top Products
export function TopProductsLoading() {
  return (
    <div className="w-full mx-auto p-4 bg-white rounded-lg shadow-lg h-full">
      <div className="flex justify-between items-center mb-3">
        <div className="h-3 bg-gray-200 rounded w-1/6"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="animate-pulse">
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between py-2">
              <div className="h-3 bg-gray-200 rounded w-1/12"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/6"></div>
              <div className="h-3 bg-gray-200 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Loading component for Top Customers
export function TopCustomersLoading() {
  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-lg h-full">
      <div className="flex justify-between items-center mb-3 p-2">
        <div className="h-3 bg-gray-200 rounded w-1/6"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="animate-pulse p-2">
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between py-2">
              <div className="h-3 bg-gray-200 rounded w-1/12"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/6"></div>
              <div className="h-3 bg-gray-200 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}