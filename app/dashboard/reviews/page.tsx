"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import ProductCard from "./ProductCard";
import { deleteReview, fetchReviews } from "@/services/reviewService";
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";
import { toast } from "sonner";

function Review() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<IReview | null>(null);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const { reviews, totalPages } = await fetchReviews(
        page,
        searchQuery,
        starFilter
      );
      setReviews(reviews);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [page, searchQuery, starFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleStarChange = (star: number) => {
    setStarFilter(star === starFilter ? null : star);
    setPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleDeleteClick = (product: IReview) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await deleteReview(productToDelete.id);
        toast.success("deleted successfully");
        loadReviews();
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Error deleting product");
      } finally {
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  return (
    <div className="p-2 bg-[#F6F6F6] min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-4">
          <h2 className="text-xl font-bold">All Reviews</h2>
          {loading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* Star Rating Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600">
              Filter by:
            </span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarChange(star)}
                  className={`p-1 rounded-full transition-colors ${
                    starFilter && star <= starFilter
                      ? " text-white"
                      : " text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  <Icon
                    icon="mdi:star"
                    className={`w-5 h-5 ${
                      starFilter && star <= starFilter
                        ? "text-yellow-400"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-200 px-3 py-2 rounded-full">
            <Icon
              icon="solar:magnifer-outline"
              className="text-gray-400 w-5 h-5"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-gray-200 rounded-md text-sm text-black focus:outline-none"
              placeholder="Search by title"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-[20px] shadow-sm p-4 space-y-4 min-h-screen">
        {!loading &&
          reviews?.map((review) => (
            <ProductCard
              handleDeleteClick={handleDeleteClick}
              key={review.id}
              review={review}
            />
          ))}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        productName={productToDelete?.product_title || ""}
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

export default Review;
