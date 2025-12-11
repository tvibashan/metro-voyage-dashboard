"use client";
import React, { useEffect, useState, use } from "react";
import "chart.js/auto";
import { fetchBookingDetails } from "@/services/bookingService";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import ticketIcon from "/public/icons/ticket.png";

export default function CustomerDetailsView({ params }: { params: any }) {
  const { id }: any = use(params);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBookingDetails = async () => {
      try {
        const data = await fetchBookingDetails(id);
        setBookingDetails(data);
      } catch (err) {
        setError("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    };
    loadBookingDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Booking Details</h2>

      {/* User Details */}
     <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
  <div className="flex justify-between">
    <h3 className="text-xl font-semibold mb-4 text-gray-700">
      User Information
    </h3>
    <Link href={`/dashboard/all-orders/${id}/edit`}>
      <button className="bg-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg flex items-center space-x-2">
        <span>Edit</span>
        <Icon icon="mdi:chevron-down" className="w-4 h-4" />
      </button>
    </Link>
  </div>

  <div className="flex items-center gap-6">
    {!bookingDetails?.is_guest && (
      <>
        {bookingDetails.user.image ? (
          <img
            src={bookingDetails.user.image}
            alt={`${bookingDetails.user.first_name} ${bookingDetails.user.last_name}`}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-20 h-20 rounded-full border-2 border-gray-200 flex items-center justify-center bg-gray-100">
            <svg fill="#ff8e24" width="64px" height="64px" viewBox="0 -2.93 32.537 32.537" xmlns="http://www.w3.org/2000/svg" stroke="#ff8e24" stroke-width="0.00032537"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g transform="translate(-481.391 -197.473)"> <path d="M512.928,224.152a.991.991,0,0,1-.676-.264,21.817,21.817,0,0,0-29.2-.349,1,1,0,1,1-1.322-1.5,23.814,23.814,0,0,1,31.875.377,1,1,0,0,1-.677,1.736Z"></path> <path d="M498.191,199.473a7.949,7.949,0,1,1-7.949,7.95,7.959,7.959,0,0,1,7.949-7.95m0-2a9.949,9.949,0,1,0,9.95,9.95,9.949,9.949,0,0,0-9.95-9.95Z"></path> </g> </g></svg>
          </div>
        )}
      </>
    )}

    <div className="space-y-2">
      <p className="text-gray-600">
        <span className="font-medium">Name:</span>{" "}
        {`${
          bookingDetails?.is_guest
            ? bookingDetails.first_name
            : bookingDetails.user.first_name
        } ${
          bookingDetails?.is_guest
            ? bookingDetails.last_name
            : bookingDetails.user.last_name
        }`}
      </p>
      <p className="text-gray-600">
        <span className="font-medium">Email:</span>{" "}
        {bookingDetails?.is_guest
          ? bookingDetails.email
          : bookingDetails.user.email}
      </p>
      <p className="text-gray-600">
        <span className="font-medium">Phone:</span>{" "}
        {bookingDetails?.is_guest
          ? bookingDetails.phone
          : bookingDetails.user.phone}
      </p>
      <p className="text-gray-600">
        <span className="font-medium">Address:</span>{" "}
        {`${
          bookingDetails?.is_guest
            ? bookingDetails.address
            : bookingDetails.user.address
        }, ${
          bookingDetails?.is_guest
            ? bookingDetails.city
            : bookingDetails.user.city
        }, ${
          bookingDetails?.is_guest
            ? bookingDetails.country
            : bookingDetails.user.country
        }`}
      </p>
    </div>
  </div>
</div>


      {/* Booking Info */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <h3 className="text-xl font-semibold mb-6 text-gray-700 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Booking Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Product */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-sm font-medium text-gray-600">Product</p>
            </div>
            <p className="text-lg font-semibold text-gray-800">
              {bookingDetails.product_title}
            </p>
          </div>

          {/* Status */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm font-medium text-gray-600">Status</p>
            </div>
            <p
              className={`text-lg font-semibold ${
                bookingDetails.status === "Confirmed"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {bookingDetails.status}
            </p>
          </div>

          {/* Departure From */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-sm font-medium text-gray-600">
                Departure From
              </p>
            </div>
            <p className="text-lg font-semibold text-gray-800">
              {bookingDetails.departure_from}
            </p>
          </div>

          {/* booking_reference */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Image alt="ticketIcon" src={ticketIcon} height={18} width={18} />

              <p className="text-sm font-medium text-gray-600">
                Booking Reference
              </p>
            </div>
            <p className="text-lg font-semibold text-green-500">
              {bookingDetails?.booking_reference}
            </p>
          </div>
          {/* Departure Date */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm font-medium text-gray-600">
                Departure Date
              </p>
            </div>
            <p className="text-lg font-semibold text-gray-800">
              {new Date(bookingDetails.departure_date_time).toLocaleString()}
            </p>
          </div>

          {/* Total Amount */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
            </div>
            <p className="text-lg font-semibold text-gray-800">
              ${bookingDetails.total_amount.toFixed(2)}
            </p>
          </div>

        </div>
      </div>

      {/* Participants */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Participants
        </h3>
        {bookingDetails.participants.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">
                    Cost per Unit
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookingDetails.participants.map((participant: any) => (
                  <tr
                    key={participant.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {participant?.first_name} {participant?.last_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {participant.participant_type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {participant.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      ${participant.cost_per_unit.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No participants available.</p>
        )}
      </div>
    </div>
  );
}
