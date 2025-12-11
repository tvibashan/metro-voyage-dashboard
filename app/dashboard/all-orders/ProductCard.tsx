import React from "react";
import Image from "next/image";
import calenderIcon from "/public/icons/calendar.png";
import userIcon from "/public/icons/user.png";
import ticketIcon from "/public/icons/ticket.png";
import { Icon } from "@iconify/react/dist/iconify.js";
import cartIcon from "/public/icons/cart.png";
import Link from "next/link";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "reserved":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

function ProductCard({
  booking,
  handleDeleteClick,
}: {
  booking: IBooking;
  handleDeleteClick: any;
}) {
  return (
    <div className="flex flex-col md:flex-row items-start justify-between p-4 border-b ">
      <div className="flex-1 space-y-1">
        {/* content head text */}
        <div className="flex flex-col md:flex-row  gap-3 mb-4">
          {booking.product_thumbnail ? (
            <Image
              alt="product thumbnail"
              src={
                booking.product_thumbnail.startsWith("http")
                  ? booking.product_thumbnail
                  : "/default-image.png"
              }
              height={80}
              width={80}
              className="object-cover h-20 w-20"
            />
          ) : (
            <Icon icon="bi:image-fill" className="text-5xl" />
          )}

          <div className="space-y-1">
            <h3 className="font-semibold text-gray-800">
              <Link href={`/dashboard/all-orders/${booking.id}`}>
                {booking.product_title}
              </Link>
            </h3>
            <p className="text-sm text-gray-600">
              Partner Name:{booking.api_category} | {booking.duration} |
              <span className="text-red-500 font-semibold">
                {booking?.is_guest ? "GUEST" : ""}
              </span>
            </p>
            {/* Booking status badge */}
            <div
              className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(
                booking.status
              )}`}
            >
              {booking.status}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-8 md:flex-wrap ">
          <div className="text-[15px] flex flex-col md:flex-row md:items-center gap-8 text-black">
            <p className="flex  items-center gap-2">
              {" "}
              <Image
                alt="calenderIcon"
                src={calenderIcon}
                height={18}
                width={18}
              />
              Departure Date:{" "}
              {new Date(booking.departure_date_time).toLocaleString()}
            </p>{" "}
            <div className="flex items-center gap-2">
              <Image alt="ticketIcon" src={ticketIcon} height={18} width={18} />
              {booking?.booking_reference}
            </div>
          </div>
          <p className="text-[15px] flex items-center gap-2 text-black justify-center">
            <Image alt="userIcon" src={userIcon} height={18} width={18} />
            {booking?.total_persons} person - ${booking.original_total_amount}
          </p>
        </div>
      </div>
      <div className="md:text-right text-left mt-4 md:mt-0">
        <p className="text-xs text-gray-400 font-light flex items-center gap-2">
          {" "}
          <Image alt="cartIcon" src={cartIcon} height={18} width={18} />
          {new Date(booking.created_at).toLocaleString()}
        </p>
        <div className="flex gap-2 mt-2">
          <Link href={`/dashboard/all-orders/${booking.id}`}>
            <button className=" text-blue-500 text-xs bg-blue-600 bg-opacity-20 px-3 py-1 rounded-3xl">
              See Details
            </button>
          </Link>
          <button
            onClick={() => handleDeleteClick(booking)}
            className="flex justify-center w-max items-center mx-auto text-center px-3 py-1 rounded-full bg-red-600 bg-opacity-25 text-red-600 text-xs"
          >
            <Icon icon="mdi:trash-can-outline" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
