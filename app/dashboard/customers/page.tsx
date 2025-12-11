"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { deleteCustomer, fetchCustomers } from "@/services/userService";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null
  );

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const { customers, totalPages, nextPage, prevPage } =
        await fetchCustomers(page, searchQuery);
      setCustomers(customers);
      setTotalPages(totalPages);
      setNextPage(nextPage);
      setPrevPage(prevPage);
    } catch (error) {
      console.error("Error loading customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [page, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

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

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (customerToDelete) {
      try {
        await deleteCustomer(customerToDelete.id);
        toast.success("deleted successfully");
        loadCustomers();
      } catch (error) {
        console.error("Error deleting customer:", error);
        toast.error("Error deleting customer");
      } finally {
        setIsDeleteModalOpen(false);
        setCustomerToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setCustomerToDelete(null);
  };
  return (
    <div className="p-6 bg-[#F6F6F6] min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold">Customer List</h2>
          {/* Loading State */}
          {loading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* Search Bar */}
          <div className="flex gap-2 bg-gray-200 rounded-full px-3 py-2">
            <Icon icon="iconoir:user" className="text-xl text-black" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-transparent border-gray-300 text-sm text-black focus:outline-none"
              placeholder="Search by name, email, or phone"
            />
          </div>
        </div>
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {customers.map((customer) => (
          <Link
            href={`/dashboard/customers/${customer.id}`}
            key={customer.id}
            className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center space-y-3"
          >
            <div className="w-full flex justify-between items-center">
              <p className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                {customer.total_bookings} Bookings
              </p>
              <p
                className="bg-gray-100  p-2 rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteClick(customer);
                }}
              >
                <Icon
                  icon="mdi:trash-can-outline"
                  className="w-4 h-4 text-red-500"
                />
              </p>
            </div>
            <div className="relative">
              <img
                src={customer.image || "/default-avatar.png"}
                alt={customer.first_name}
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
            <p className="font-bold text-[15px] text-gray-800">
              {customer.first_name} {customer.last_name}
            </p>
            <p className="text-sm text-gray-500">ID: {customer.id}</p>
            <p className="text-sm text-gray-500">
              {customer.city}, {customer.country}
            </p>
            <span className="bg-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
              {customer.blood_group || "N/A"}
            </span>
          </Link>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        productName={customerToDelete?.first_name || ""}
      />

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
}
