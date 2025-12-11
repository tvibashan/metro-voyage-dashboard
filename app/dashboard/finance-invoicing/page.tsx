"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { fetchBookings, downloadBooking } from "@/services/bookingService"; // Add downloadBookings
import { format } from "date-fns";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const FinanceInvoicing: React.FC = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined
  );
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(
    undefined
  );

  const loadBookings = async () => {
    setLoading(true);
    try {
      const { bookings, totalPages, nextPage, prevPage } = await fetchBookings({
        page,
        searchQuery,
        statusFilter: statusFilter === "all" ? "" : statusFilter,
        year: selectedYear,
        month: selectedMonth
      });
      setBookings(bookings);
      setTotalPages(totalPages);
      setNextPage(nextPage);
      setPrevPage(prevPage);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [page, searchQuery, statusFilter, selectedYear, selectedMonth]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy, hh:mm a");
  };
  const handleDownload = async (
    booking: number,
    format: "excel" | "pdf",
    pdf_type: "invoice" | "booking"
  ) => {
    try {
      const response = await downloadBooking(booking, format, pdf_type);
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const fileLink = document.createElement("a");
      fileLink.href = fileURL;
      fileLink.setAttribute(
        "download",
        `booking_${booking}.${format === "excel" ? "xlsx" : "pdf"}`
      );

      document.body.appendChild(fileLink);
      fileLink.click();
      document.body.removeChild(fileLink);
    } catch (error) {
      console.error("Error downloading bookings:", error);
      alert("Failed to download the file. Please try again.");
    }
  };

  return (
    <div className="py-3 h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold mb-6">Finance & Invoicing</h1>
        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Export Button */}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            // onClick={() => handleDownload("excel")} // Trigger Excel download
          >
            <Icon icon="uil:file-download" className="text-lg" />
            Export Excel
          </button>
          {/* PDF Button */}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            // onClick={() => handleDownload("pdf")} // Trigger PDF download
          >
            <Icon icon="uil:file-download" className="text-lg" />
            Export PDF
          </button>
          {/* Print Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            <Icon icon="mdi:printer" className="text-lg" />
          </button>

          {/* Year Filter Dropdown */}
          <Select
            value={selectedYear?.toString() || ""}
            onValueChange={(value) => {
              setSelectedYear(value ? Number(value) : undefined);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                { length: 20 },
                (_, i) => new Date().getFullYear() - 10 + i
              ).map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Month Filter Dropdown */}
          <Select
            value={selectedMonth?.toString() || ""}
            onValueChange={(value) => {
              setSelectedMonth(value ? Number(value) : undefined);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <SelectItem key={month} value={month.toString()}>
                  {new Date(0, month - 1).toLocaleString("default", {
                    month: "long",
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Navigation Buttons */}
          <button
            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            onClick={() => handlePageChange(page - 1)}
            disabled={!prevPage}
          >
            <Icon icon="mdi:chevron-left" className="text-lg" />
          </button>
          <button
            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            onClick={() => handlePageChange(page + 1)}
            disabled={!nextPage}
          >
            <Icon icon="mdi:chevron-right" className="text-lg" />
          </button>
        </div>
      </div>

      {/* Header with Tabs and Controls */}
      <div className="flex flex-wrap items-center justify-between mb-6 bg-white rounded-xl p-3">
        {/* Tabs with Icons */}
        <div className="flex gap-4">
          {[
            { name: "Booking Payouts", icon: "mdi:cash-multiple" },
            { name: "Invoice", icon: "mdi:receipt" },
            { name: "Payment Confirmation", icon: "mdi:credit-card-check" },
          ].map((tab, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveTab(index);
                if (index === 2) {
                  setStatusFilter("Confirmed"); // Set statusFilter to "paid" for Payment Confirmation tab
                } else {
                  setStatusFilter(""); // Reset statusFilter for other tabs
                }
              }}
              className={`py-2 px-4 font-medium flex items-center gap-2 ${
                activeTab === index
                  ? "text-black text-sm bg-gray-100 rounded-lg px-5"
                  : "text-gray-500 font-light text-sm"
              }`}
            >
              <Icon icon={tab.icon} className="text-lg" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {/* Booking Payouts Tab */}
        {activeTab === 0 && (
          <div className="overflow-auto border bg-white p-2 sm:p-8 rounded-3xl">
            <table className="w-full">
              <thead className="text-left border-b">
                <tr>
                  <th className="p-3 rounded-md text-gray-500 text-[15px] font-light">
                    Booking Reference
                  </th>
                  <th className="p-3 rounded-md text-gray-500 text-[15px] font-light">
                    Lead Traveler
                  </th>
                  <th className="p-3 rounded-md text-gray-500 text-[15px] font-light">
                    Product Code
                  </th>
                  <th className="p-3 rounded-md text-gray-500 text-[15px] font-light">
                    Option Code
                  </th>
                  <th className="p-3 rounded-md text-gray-500 text-[15px] font-light">
                    Activity Date
                  </th>
                  <th className="p-3 rounded-md text-gray-500 text-[15px] font-light">
                    Purchase Date
                  </th>
                  <th className="p-3 rounded-md text-gray-500 text-[15px] font-light">
                    Retail Rate
                  </th>
                  <th className="p-3 rounded-md text-gray-500 text-[15px] font-light">
                    Discount
                  </th>
                  <th className="p-3 rounded-md text-gray-500 text-[15px] font-light">
                    Net Rate
                  </th>
                  <th className="p-3 rounded-md text-gray-500 text-[15px] font-light">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((item, index) => (
                  <tr key={index} className="bg-white border-b">
                    <td className="p-3">{item.booking_reference}</td>
                    <td className="p-3">{item.user?.email || item?.email || "Guest"}</td>
                    <td className="p-3">{item.product_id}</td>
                    <td className="p-3">{item.product_id}</td>
                    <td className="p-3">
                      {formatDate(item.departure_date_time)}
                    </td>
                    <td className="p-3">{formatDate(item.updated_at)}</td>
                    <td className="p-3">${item?.original_gross_amount}</td>
                    <td className="p-3">${(item?.original_gross_amount-item.original_total_amount).toFixed(2)}</td>
                    <td className="p-3">${item.original_total_amount}</td>
                    <td className="p-3">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Invoice Tab */}
        {activeTab === 1 && (
          <div className="overflow-auto border bg-white p-2 sm:p-8 rounded-3xl">
            <table className="w-full">
              <thead className="text-left rounded-md border-b">
                <tr>
                  <th className="p-3 rounded-md text-gray-500 text-[15px] font-light">
                    Date
                  </th>
                  <th className="p-3 rounded-md text-gray-500 text-[15px] font-light">
                    Invoice
                  </th>
                  <th className="p-3 rounded-md text-gray-500 text-[15px] font-light">
                    Amount
                  </th>
                  <th className="p-3 rounded-md text-gray-500 text-[15px] font-light">
                    Status
                  </th>
                  <th className="p-3 rounded-md text-gray-500 text-[15px] font-light">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((item: any, index) => (
                  <tr key={index} className="bg-white border-b">
                    <td className="p-3">
                      {formatDate(item.departure_date_time)}
                    </td>
                    <td className="p-3">
                      <span className="flex items-center gap-2">
                        <Icon icon="mdi:receipt-outline" />
                        {item.booking_reference}
                      </span>
                    </td>
                    <td className="p-3">${item.original_total_amount}</td>
                    <td className="p-3">{item.status}</td>
                    <td className="p-3">
                      <button className="hover:underline text-xl flex items-center gap-1">
                        <div className="flex items-center gap-4">
                          <button
                            className="flex items-center gap-2  text-gray-700"
                            onClick={() =>
                              handleDownload(item.id, "excel", "invoice")
                            }
                          >
                            <Icon
                              icon="vscode-icons:file-type-excel"
                              className="text-lg"
                            />
                          </button>

                          {/* PDF Download Button */}
                          <button
                            className="flex items-center gap-2  text-gray-700 "
                            onClick={() =>
                              handleDownload(item.id, "pdf", "invoice")
                            }
                          >
                            <Icon
                              icon="vscode-icons:file-type-pdf2"
                              className="text-lg"
                            />
                          </button>
                        </div>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Payment Confirmation Tab */}
        {activeTab === 2 && (
          <div className="overflow-auto border bg-white p-2 sm:p-8 rounded-3xl">
            <table className="w-full">
              <thead className="border-b text-left rounded-md">
                <tr>
                  <th className="p-3 rounded-md text-gray-500 text-[15px] font-light">
                    Date
                  </th>
                  <th className="p-3 rounded-md text-gray-500 text-[15px] font-light">
                    Transaction ID
                  </th>
                  <th className="p-3 rounded-md text-gray-500 text-[15px] font-light">
                    Amount
                  </th>
                  <th className="p-3 rounded-md text-gray-500 text-[15px] font-light">
                    Status
                  </th>
                  <th className="p-3 rounded-md text-gray-500 text-[15px] font-light">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((item: any, index) => (
                  <tr key={index} className="bg-white border-b">
                    <td className="p-3">
                      {formatDate(item.departure_date_time)}
                    </td>
                    <td className="p-3">{item.booking_reference}</td>
                    <td className="p-3">${item.original_total_amount}</td>
                    <td className="p-3">{item.status}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-4">
                        <button
                          className="flex items-center gap-2  text-gray-700"
                          onClick={() =>
                            handleDownload(item.id, "excel", "booking")
                          }
                        >
                          <Icon
                            icon="vscode-icons:file-type-excel"
                            className="text-lg"
                          />
                        </button>

                        {/* PDF Download Button */}
                        <button
                          className="flex items-center gap-2  text-gray-700 "
                          onClick={() =>
                            handleDownload(item.id, "pdf", "booking")
                          }
                        >
                          <Icon
                            icon="vscode-icons:file-type-pdf2"
                            className="text-lg"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={!prevPage}
          className={`mx-1 px-3 py-1 rounded-full ${
            !prevPage
              ? "bg-gray-100 text-gray-400"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          Previous
        </button>
        {getPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={`mx-1 px-3 py-1 rounded-full ${
              page === pageNumber
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={!nextPage}
          className={`mx-1 px-3 py-1 rounded-full ${
            !nextPage
              ? "bg-gray-100 text-gray-400"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FinanceInvoicing;
