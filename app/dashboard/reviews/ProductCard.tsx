import React from "react";
import Image from "next/image";
import calenderIcon from "/public/icons/calendar.png";
import userIcon from "/public/icons/user.png";
import ticketIcon from "/public/icons/ticket.png";
import { Icon } from "@iconify/react/dist/iconify.js";
import cartIcon from "/public/icons/cart.png";
import Link from "next/link";

function ProductCard({
  review,
  handleDeleteClick,
}: {
  review: IReview;
  handleDeleteClick: any;
}) {
  return (
    <div className="flex flex-col md:flex-row items-start justify-between p-4 border-b ">
      <div className="flex-1 space-y-1">
        {/* content head text */}
        <div className="flex flex-col md:flex-row  gap-3 mb-4">
          {review.product_image ? (
            <Image
              alt="product thumbnail"
              src={review.product_image}
              height={80}
              width={80}
              className="object-cover h-20 w-20"
            />
          ) : (
            <Icon icon="bi:image-fill" className="text-5xl" />
          )}
          <div className="space-y-1">
            <div className="flex space-x-4">
              <h3 className="font-semibold text-gray-800">
                {review.product_title}
              </h3>

              {/* Review Section */}
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    icon="mdi:star"
                    className={`h-4 w-4 ${
                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-600">
              Partner Name:{review.api_category} | {review.product_duration} | 
              {review.product_location}
            </p>
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
              {new Date(review.departure_date_time).toLocaleString()}
            </p>{" "}
            <div className="flex items-center gap-2">
              <Image alt="ticketIcon" src={ticketIcon} height={18} width={18} />
              {review.id}
            </div>
          </div>
          <p className="text-[15px] flex items-center gap-2 text-black justify-center">
            <Image alt="userIcon" src={userIcon} height={18} width={18} />€
            {review.product_price}
          </p>
        </div>
      </div>
      <div className="md:text-right text-left mt-4 md:mt-0">
        <p className="text-xs text-gray-400 font-light flex items-center gap-2">
          {" "}
          <Image alt="cartIcon" src={cartIcon} height={18} width={18} />
          {new Date(review.created_at).toLocaleString()}
        </p>
        <div className="flex gap-2 mt-2">
          <Link href={`/dashboard/reviews/${review.id}`}>
            <button className="mt-2 text-blue-500 text-xs bg-blue-600 bg-opacity-20 px-3 py-1 rounded-3xl">
              See Details
            </button>
          </Link>
          <button
            onClick={() => handleDeleteClick(review)}
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
