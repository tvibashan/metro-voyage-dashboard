"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

// Sample data for booking overview chart
const bookingCounts = {
  total: 75,
  active: 10,
  cancelled: 5,
  completed: 50,
};

// Calculate percentages based on the total
const activePercentage = (
  (bookingCounts.active / bookingCounts.total) *
  100
).toFixed(0);
const cancelledPercentage = (
  (bookingCounts.cancelled / bookingCounts.total) *
  100
).toFixed(0);
const completedPercentage = (
  (bookingCounts.completed / bookingCounts.total) *
  100
).toFixed(0);

// Data for the booking overview chart
const bookingOverviewData = {
  labels: ["Cancelled booking", "Active booking", "Completed booking"],
  datasets: [
    {
      data: [
        bookingCounts.cancelled,
        bookingCounts.active,
        bookingCounts.completed,
      ],
      backgroundColor: ["#F87171", "#34D399", "#8B5CF6"],
      borderWidth: 0,
    },
  ],
};

// Options for the Pie chart
const options = {
  plugins: {
    tooltip: {
      enabled: false, // Disable default tooltip
    },
    legend: {
      display: false, // Hide default legend
    },
  },
  maintainAspectRatio: false, // Allow responsive resizing
};

// Sample recent bookings
const recentBookings = [
  {
    tourName: "Dubrovnik: The Ultimate Game of Thrones Tour",
    status: "Active",
    statusColor: "bg-[#10B981] text-white",
    bookingCode: "GYGVN37Q3ZKB",
    persons: "1 person",
    date: "Thu, Sep 5th 2024",
    image: "https://shorturl.at/60DSy",
  },
  {
    tourName: "Dubrovnik: The Ultimate Game of Thrones Tour",
    status: "Cancelled",
    statusColor: "bg-[#EF4444] text-white",
    bookingCode: "GYGVN37Q3ZKB",
    persons: "1 person",
    date: "Thu, Sep 5th 2024",
    image: "https://shorturl.at/60DSy",
  },
  {
    tourName: "Dubrovnik: The Ultimate Game of Thrones Tour",
    status: "Completed",
    statusColor: "bg-[#6D28D9] text-white",
    bookingCode: "GYGVN37Q3ZKB",
    persons: "1 person",
    date: "Thu, Sep 5th 2024",
    image: "https://shorturl.at/60DSy",
  },
];

export default function CustomerDetails() {
  // State to manage active tab
  const [activeTab, setActiveTab] = useState("Overview");

  // Function to render content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <div className="bg-white p-4 rounded-b-xl">
            <p className="font-semibold text-sm">Booking Overview</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-4 rounded-b-xl mt-5">
              {/* Booking Overview */}
              <div className="flex flex-col md:flex-row items-center gap-20">
                {/* Pie Chart Section */}
                <div className="relative w-48 h-48">
                  <Pie data={bookingOverviewData} options={options} />
                  {/* Labels inside the pie chart */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                    <span className="text-white absolute top-5 right-[70px] font-bold text-sm">
                      {cancelledPercentage}%
                    </span>
                    <span className="text-white absolute top-10 right-5 font-bold text-sm">
                      {activePercentage}%
                    </span>
                    <span className="text-white absolute top-32 font-bold text-sm">
                      {completedPercentage}%
                    </span>
                  </div>
                </div>

                {/* Legend Section */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    <span className="font-medium text-gray-900">
                      Total booking
                    </span>
                    <span className="text-gray-700">{bookingCounts.total}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="font-medium text-gray-900">
                      Active booking
                    </span>
                    <span className="text-gray-700">
                      {bookingCounts.active}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
                    <span className="font-medium text-gray-900">
                      Completed booking
                    </span>
                    <span className="text-gray-700">
                      {bookingCounts.completed}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="font-medium text-gray-900">
                      Cancelled booking
                    </span>
                    <span className="text-gray-700">
                      {bookingCounts.cancelled}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white border-b py-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <h3 className="text-sm font-bold">Recent Bookings</h3>
                  <button className="text-sm text-blue-600 mt-2 sm:mt-0">
                    See All
                  </button>
                </div>
                <ul className="space-y-4">
                  {recentBookings.map((booking, index) => (
                    <li
                      key={index}
                      className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4 space-y-2 sm:space-y-0"
                    >
                      <img
                        src={booking.image}
                        alt={booking.tourName}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-[15px]">
                          {booking.tourName}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 mt-2">
                          <span
                            className={`${booking.statusColor} text-xs font-medium px-2 py-1 rounded-full`}
                          >
                            {booking.status}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon
                              icon="lsicon:coupon-outline"
                              className="text-sm text-black"
                            />
                            {booking.bookingCode}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon
                              icon="iconoir:user"
                              className="text-sm text-black"
                            />
                            {booking.persons}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon
                              icon="solar:calendar-outline"
                              className="text-sm text-black"
                            />
                            {booking.date}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feedback */}
            <div className="bg-white w-full py-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold">Feedback</h3>
                <button className="text-sm text-blue-600">See All</button>
              </div>
              <ul className="space-y-4">
                {recentBookings.map((booking, index) => (
                  <div>
                    <li key={index} className="flex items-center space-x-4 ">
                      <img
                        src={booking.image}
                        alt={booking.tourName}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {booking.tourName}
                        </p>
                        <div className="flex items-center gap-3 mr-2 mt-2">
                          <Icon
                            icon="octicon:star-fill-16"
                            className="text-orange-500 w-4 h-4"
                          />
                          <Icon
                            icon="octicon:star-fill-16"
                            className="text-orange-500 w-4 h-4"
                          />
                          <Icon
                            icon="octicon:star-fill-16"
                            className="text-orange-500 w-4 h-4"
                          />
                          <Icon
                            icon="octicon:star-fill-16"
                            className="text-orange-500 w-4 h-4"
                          />
                          <Icon
                            icon="clarity:half-star-line"
                            className="text-orange-500 w-4 h-4"
                          />
                        </div>
                      </div>
                    </li>
                    <p className="text-[12px] my-4">
                      Excellent 3 hours of whale watching. Lucky enough to see a
                      number of humpbacks and a full feeding frenzy with
                      seabirds, sealions and whales. Awe inspiring!!
                    </p>
                    <hr />
                  </div>
                ))}
              </ul>
            </div>
          </div>
        );
      case "Bookings":
        return (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <ul className="space-y-4">
              {recentBookings.map((booking, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center">
                    <div>
                      <li className="flex items-center space-x-4">
                        <img
                          src={booking.image}
                          alt={booking.tourName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {booking.tourName}
                          </p>
                          <p>
                            Partner Name: StarTour | Option: Skip The Line |
                            Rome: Vatican Museum and Sistine Chapel Skip The
                            Line Ticket
                          </p>
                        </div>
                      </li>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 my-4">
                        <span
                          className={`${booking.statusColor} text-xs font-medium px-2 py-1 rounded-full`}
                        >
                          {booking.status}
                        </span>
                        <span className="flex gap-1">
                          <Icon
                            icon="lsicon:coupon-outline"
                            className="text-lg text-black"
                          />
                          {booking.bookingCode}
                        </span>
                        <span className="flex gap-1">
                          <Icon
                            icon="iconoir:user"
                            className="text-xl text-black"
                          />
                          {booking.persons}
                        </span>
                        <span className="flex gap-1">
                          <Icon
                            icon="solar:calendar-outline"
                            className="text-xl text-black"
                          />
                          {booking.date}
                        </span>
                      </div>
                    </div>
                    <div className="md:text-right text-left mt-4 md:mt-0">
                      <p className="text-xs text-gray-400 font-light flex items-center gap-2">
                        <span className="text-xl">
                          <Icon icon="jam:shopping-cart" />
                        </span>
                        Thu, Sep 5th 2024
                      </p>
                      <button className="mt-2 text-blue-500 text-xs bg-blue-600 bg-opacity-20 px-3 py-1 rounded-3xl">
                        See Details
                      </button>
                    </div>
                  </div>
                  {index < recentBookings.length - 1 && <hr className="my-4" />}
                </div>
              ))}
            </ul>
          </div>
        );

      case "Reviews":
        return (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <ul className="space-y-4">
              {recentBookings.map((booking, index) => (
                <div>
                  <li key={index} className="flex items-center space-x-4 ">
                    <img
                      src={booking.image}
                      alt={booking.tourName}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {booking.tourName}
                      </p>
                      <div className="flex items-center gap-3 mr-2 mt-2">
                        <Icon
                          icon="octicon:star-fill-16"
                          className="text-orange-500 w-4 h-4"
                        />
                        <Icon
                          icon="octicon:star-fill-16"
                          className="text-orange-500 w-4 h-4"
                        />
                        <Icon
                          icon="octicon:star-fill-16"
                          className="text-orange-500 w-4 h-4"
                        />
                        <Icon
                          icon="octicon:star-fill-16"
                          className="text-orange-500 w-4 h-4"
                        />
                        <Icon
                          icon="clarity:half-star-line"
                          className="text-orange-500 w-4 h-4"
                        />
                      </div>
                    </div>
                  </li>
                  <p className="text-[12px] my-4">
                    Excellent 3 hours of whale watching. Lucky enough to see a
                    number of humpbacks and a full feeding frenzy with seabirds,
                    sealions and whales. Awe inspiring!!
                  </p>
                  <hr />
                </div>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-2 min-h-screen">
      <h1 className="text-2xl font-bold">Customer Details</h1>
      {/* Customer Header */}
      <div className="rounded-3xl">
        <div className="flex items-center justify-between mb-6 bg-white p-4 mt-5 rounded-xl">
          <div className="flex items-center space-x-4">
            <img
              src="https://shorturl.at/sdZp4"
              alt="Customer"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-bold">Oliver Thompson</h2>
              <p className="text-sm text-gray-500">
                ID: 839274561 | Lisbon, Portugal
              </p>
              <div className="flex space-x-2 mt-2">
                <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                  English
                </span>
                <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                  Portuguese
                </span>
                <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                  Farsi
                </span>
              </div>
            </div>
          </div>
          <button className="bg-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg flex items-center space-x-2">
            <span>Take Action</span>
            <Icon icon="mdi:chevron-down" className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 bg-white p-4 rounded-t-xl">
          {[{ name: "Overview", icon: "mynaui:hash" },
            { name: "Bookings", icon: "mynaui:clock-hexagon" },
            { name: "Reviews", icon: "zondicons:exclamation-outline" }].map((tab,index) => (
            <button
              key={index}
              className={`text-sm font-medium flex items-center justify-center gap-2 ${
                activeTab === tab.name
                  ? "text-black bg-gray-200 px-3 py-2 rounded-md"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              <Icon icon={tab.icon} className="text-lg" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}