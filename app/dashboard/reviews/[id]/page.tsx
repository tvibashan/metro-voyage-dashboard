"use client";
import React, { useEffect, useState, use } from "react";
import { fetchReviewDetails } from "@/services/reviewService";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { format } from "date-fns";

export default function ReviewDetailView({ params }: { params: any }) {
  const { id }: any = use(params);
  const [reviewDetails, setReviewDetails] = useState<IReview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReviewDetails = async () => {
      try {
        const data = await fetchReviewDetails(id);
        setReviewDetails(data);
      } catch (err) {
        setError("Failed to load review details.");
      } finally {
        setLoading(false);
      }
    };
    loadReviewDetails();
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

  if (!reviewDetails) {
    return <div className="text-center">No review details found.</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className=" mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="relative h-48">
          <img
            src={reviewDetails.product_image}
            alt={reviewDetails.product_title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4">
            <h1 className="text-white text-2xl font-bold">
              {reviewDetails.product_title}
            </h1>
          </div>
        </div>

        {/* User Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <img
              src={reviewDetails.user?.image || "/default-avatar.png"}
              alt={reviewDetails.user?.email}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h2 className="text-lg font-semibold">
                {reviewDetails.user?.email}
              </h2>
              <p className="text-sm text-gray-500">
                {format(new Date(reviewDetails.created_at), "dd-MM-yyyy")}
              </p>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                icon="mdi:star"
                className={`h-6 w-6 ${
                  i < reviewDetails.rating ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-gray-700">{reviewDetails.comment}</p>
        </div>

        {/* Product Details Section */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Product Details</h3>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Price:</span> $
              {reviewDetails.product_price}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Location:</span>{" "}
              {reviewDetails?.product_location}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Duration:</span>{" "}
              {reviewDetails?.product_duration}
            </p>
          </div>
        </div>

        {/* Footer Section */}
        <div className="p-6 bg-gray-50">
          <Link
            href="/dashboard/reviews"
            className="flex items-center space-x-2"
          >
            <span>
              <Icon icon="mdi:arrow-left" />
            </span>
            <p> Back to Reviews</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
