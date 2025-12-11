"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import ProductCard from "./ProductCard";
import { deleteBooking, fetchBookings } from "@/services/bookingService";
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { fetchProducts } from "@/services/productService";
import { Button } from "@/components/ui/button";

function AllOrders() {
  // Bookings state
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [bookingToDelete, setBookingToDelete] = useState<IBooking | null>(null);

  // Products state for filtering
  const [products, setProducts] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState<string>("");
  const [productPage, setProductPage] = useState<number>(1);
  const [productTotalPages, setProductTotalPages] = useState<number>(1);
  const [productLoading, setProductLoading] = useState<boolean>(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [departureDate, setDepartureDate] = useState<Date | undefined>();
  const [ordering, setOrdering] = useState<string>("-created_at");

  // Load bookings with current filters
  const loadBookings = async () => {
    setLoading(true);
    try {
      const { bookings, totalPages } = await fetchBookings({
        page,
        searchQuery,
        statusFilter: statusFilter === "all" ? "" : statusFilter,
        productIdFilter: productFilter === "all" ? "" : productFilter,
        departureDateFilter: departureDate ? format(departureDate, "yyyy-MM-dd") : "",
        ordering
      });
      setBookings(bookings);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  // Load products for filter dropdown
  const loadProducts = async () => {
    setProductLoading(true);
    try {
      const { products, totalPages } = await fetchProducts(
        productSearch,
        {},
        "title",
        productPage,
        10
      );
      setProducts((prev) =>
        productPage === 1 ? products : [...prev, ...products]
      );
      setProductTotalPages(totalPages);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setProductLoading(false);
    }
  };

  // Handle product search
  const handleProductSearch = (query: string) => {
    setProductSearch(query);
    setProductPage(1);
  };

  // Load more products
  const loadMoreProducts = () => {
    if (productPage < productTotalPages) {
      setProductPage((prev) => prev + 1);
    }
  };

  // Handle booking deletion
  const handleDeleteClick = (booking: IBooking) => {
    setBookingToDelete(booking);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (bookingToDelete) {
      try {
        await deleteBooking(bookingToDelete.id);
        toast.success("Booking deleted successfully");
        loadBookings();
      } catch (error) {
        console.error("Error deleting booking:", error);
        toast.error("Failed to delete booking");
      } finally {
        setIsDeleteModalOpen(false);
        setBookingToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setBookingToDelete(null);
  };

  // Load data on component mount and filter changes
  useEffect(() => {
    loadBookings();
  }, [page, searchQuery, statusFilter, productFilter, departureDate, ordering]);

  useEffect(() => {
    loadProducts();
  }, [productPage, productSearch]);

  // Get page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="p-2 bg-[#F6F6F6] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
        {/* Left Section - Title and Product Filter */}
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold whitespace-nowrap">All Bookings</h2>

          {/* Product Filter with Search */}
          <Select
            value={productFilter}
            onValueChange={(value) => {
              setProductFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="bg-white w-[200px]">
              <SelectValue placeholder="Select Product" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              <div className="p-2 sticky top-0 bg-white z-10 border-b">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => handleProductSearch(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
              <SelectItem value="all">All Products</SelectItem>
              {products.map((product) => (
                <SelectItem
                  key={product.id}
                  value={product.id.toString()}
                  className="truncate"
                >
                  {product.title}
                </SelectItem>
              ))}
              {productPage < productTotalPages && (
                <div className="p-2 text-center sticky bottom-0 bg-white border-t">
                  <button
                    onClick={loadMoreProducts}
                    disabled={productLoading}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {productLoading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </SelectContent>
          </Select>

          {loading && (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          )}
        </div>

        {/* Right Section - Filters */}
        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="bg-white w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Reserved">Reserved</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          {/* Departure Date Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[140px] justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {departureDate ? format(departureDate, "MMM dd") : "Departure"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={departureDate}
                onSelect={setDepartureDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Sort By */}
          <Select value={ordering} onValueChange={setOrdering}>
            <SelectTrigger className="bg-white w-[140px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-created_at">Newest First</SelectItem>
              <SelectItem value="created_at">Oldest First</SelectItem>
              <SelectItem value="-departure_date_time">
                Departure (Newest)
              </SelectItem>
              <SelectItem value="departure_date_time">
                Departure (Oldest)
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Search Input */}
          <div className="relative w-[160px]">
            <Icon
              icon="solar:ticket-outline"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 bg-gray-200 rounded-full text-sm text-black focus:outline-none"
              placeholder="Reference Code"
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white border rounded-[20px] shadow-sm p-4 space-y-4 min-h-screen">
        {!loading && bookings.length > 0 ? (
          bookings.map((booking) => (
            <ProductCard
              handleDeleteClick={handleDeleteClick}
              key={booking.id}
              booking={booking}
            />
          ))
        ) : !loading ? (
          <div className="flex justify-center items-center h-[200px]">
            <p className="text-gray-500">No bookings found</p>
          </div>
        ) : null}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        productName={bookingToDelete?.product_title || ""}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`mx-1 px-3 py-1 rounded-full ${
              page === 1
                ? "bg-gray-100 text-gray-400"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Previous
          </button>

          {getPageNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
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
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`mx-1 px-3 py-1 rounded-full ${
              page === totalPages
                ? "bg-gray-100 text-gray-400"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default AllOrders;
