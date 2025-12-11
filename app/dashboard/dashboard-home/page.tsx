"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import rank__green from "@/public/assets/green-ranking.png";
import rank__red from "@/public/assets/red-ranking.png";
import Image from "next/image";
import calenderIcon from "/public/icons/calendar.png";
import { useDasboardStore } from "@/app/store/useDashboardStore";
import ProductCard from "../all-orders/ProductCard";


export default function DashboardHome() {
  const { data, loading, error, fetchData } = useDasboardStore();
  const [selectedDay, setSelectedDay] = useState<string>("7");

  useEffect(() => {
    fetchData(selectedDay);
  }, [selectedDay, fetchData]);

  const handleDayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDay(event.target.value);
  };
  const handleDeleteClick = () => {
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const summaryData = [
    {
      title: "Total Bookings",
      value: data?.total_bookings,
      rank: data?.bookings_percent_difference?.includes("-")
        ? rank__red
        : rank__green,
      change: data?.bookings_percent_difference,
    },
    {
      title: "Total Sales",
      value: data?.total_sales,
      rank: data?.sales_percent_difference?.includes("-")
        ? rank__red
        : rank__green,
      change: data?.sales_percent_difference,
    },
    {
      title: "Total Revenue",
      value: data?.total_revenue,
      rank: data?.revenue_percent_difference?.includes("-")
        ? rank__red
        : rank__green,
      change: data?.revenue_percent_difference,
    },
    {
      title: "Total Cancellations",
      value: data?.total_cancellations,
      rank: data?.cancellations_percent_difference?.includes("-")
        ? rank__red
        : rank__green,
      change: data?.cancellations_percent_difference,
    },
  ];

  return (
    <div className="p-2 space-y-8 bg-[#F6F6F6] ">
      {/* Inhouse Product Summary */}
      <div className="space-y-4">
        {/* header part  */}
        <div className="flex flex-col md:flex-row items-center justify-between py-6 rounded-lg">
          <h2 className="text-[24px] font-bold mb-4">
            Inhouse Product Summary
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0 space-x-3">
            {/* Date Range Select */}
            <div className="relative">
              <div className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 bg-[#010A150D] cursor-pointer">
              <Image alt="calender" src={calenderIcon} height={18} width={18} />

                <select
                  className="bg-transparent border-none font-medium outline-none text-sm text-gray-700 cursor-pointer"
                  value={selectedDay}
                  onChange={handleDayChange}
                >
                  <option value="7">7 Days</option>
                  <option value="30">30 Days</option>
                  <option value="90">90 Days</option>
                  <option value="365">1 Year</option>
                </select>
              </div>
            </div>

            {/* View Full Select */}
            <div className="relative">
              <div className="flex items-center space-x-2 bg-[#010A150D] rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 cursor-pointer">
                <select className="bg-transparent border-none outline-none text-sm text-gray-600 font-medium cursor-pointer">
                  <option value="1">View Full</option>
                  <option value="2">View Summary</option>
                  <option value="3">View Details</option>
                  <option value="4">Export Report</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* item part  */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {summaryData.map((item, index) => (
            <div
              key={index}
              className=" bg-white rounded-[20px] border flex flex-col justify-between "
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-5">
                    <h3 className="text-sm font-bold text-opacity-70 text-black">
                      {item.title}
                    </h3>
                    <div className="mt-[18px]">
                      <p className="text-2xl font-bold  text-gray-900">
                        {item.value}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                      <Image className="mt-[8px]" src={item.rank || "/default-image.png"} alt="Rank" />
                        <p className={`text-sm text-gray-500 mt-2`}>
                          {item.change} from last{" "}
                          {selectedDay} Days
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* icon  */}
                </div>
              </div>
              <div className="mt-4 bg-[#FAFDF2] rounded-b-[20px] py-3 px-5 flex items-center justify-between">
                <button className="text-sm font-medium text-gray-800">
                  View Report
                </button>
                <Icon
                  icon="mdi:arrow-right"
                  className="w-4 h-4 text-gray-600"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Activity */}
      <div className="flex flex-col md:flex-row items-center justify-between pt-[50px]">
        <h2 className="text-[24px] font-bold">Recent Orders Activity</h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center space-x-2 bg-gray-200  rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
            <span>View All</span>
            <Icon icon="mdi:arrow-right" className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white border rounded-[20px] shadow-sm p-3 space-y-2">
        {!loading &&
          data?.recent_bookings?.map((booking: IBooking) => (
            <ProductCard handleDeleteClick={handleDeleteClick} key={booking.id} booking={booking} />
          ))}
      </div>
    </div>
  );
}