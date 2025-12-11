"use client";
import React, { useEffect, useState ,use} from "react";
import {
  fetchBookingDetails,
  updateBookingDetails,
} from "@/services/bookingService";
import { toast } from "sonner";

export default function CustomerDetailsView({ params }: { params: any }) {
  const { id }:any = use(params);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const updatedData = {
        ...bookingDetails,
      };

      const data = await updateBookingDetails(id, updatedData);

      if (data.success) {
        toast("Booking updated successfully!");
      } else {
        setError("Failed to update booking.");
      }
    } catch (err) {
      setError("An error occurred while updating booking.");
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingDetails((prevDetails: any) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

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
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-1 text-gray-800">Edit Booking</h1>
        <p className="text-sm mb-6 text-gray-600">Product Id: {bookingDetails?.product_id}</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
              <input
                type="text"
                disabled
                name="product_title"
                value={bookingDetails?.product_title || ""}
                onChange={handleChange}
                className="w-full disabled:bg-gray-300 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input
                type="text"
                disabled
                name="subtitle"
                value={bookingDetails?.subtitle || ""}
                onChange={handleChange}
                className="w-full disabled:bg-gray-300 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                name="duration"
                value={bookingDetails?.duration || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure From</label>
              <input
                type="text"
                name="departure_from"
                value={bookingDetails?.departure_from || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date & Time</label>
              <input
                type="datetime-local"
                name="departure_date_time"
                value={bookingDetails?.departure_date_time ? new Date(bookingDetails.departure_date_time).toISOString().slice(0, 16) : ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
              <input
                type="number"
                name="total_amount"
                value={bookingDetails?.total_amount || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={bookingDetails?.location || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={bookingDetails?.status || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="Reserved">Reserved</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Checker</label>
              <input
                type="text"
                name="ticket_checker"
                value={bookingDetails?.ticket_checker || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_valid"
                checked={bookingDetails?.is_valid || false}
                onChange={(e) => setBookingDetails((prevDetails: any) => ({
                  ...prevDetails,
                  is_valid: e.target.checked,
                }))}
                className="w-5 h-5 rounded border-gray-300 focus:ring-indigo-500"
              />
              <label className="text-sm font-medium text-gray-700">Is Valid</label>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              Update Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}