"use client";
import React, { useEffect, useState } from "react";
import { deleteCategory, fetchCategories } from "@/services/blogService";
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/axiosInstance";
import { ApiBaseMysql } from "@/Helper/ApiBase";
import { Skeleton } from "@/components/ui/skeleton";
import CategoryCard from "./CategoryCard";

function AllCategories() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ICategory | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<ICategory | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [isMutating, setIsMutating] = useState<boolean>(false);

  // Load categories
  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const categoryData: ICategory[] = await fetchCategories();
      setCategories(categoryData);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle category deletion
  const handleDeleteClick = (category: ICategory) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      setIsMutating(true);
      await deleteCategory(categoryToDelete.id);
      toast.success("Category deleted successfully");
      await loadCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    } finally {
      setIsMutating(false);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  // Handle edit category
  const handleEditClick = (category: ICategory) => {
    setCurrentCategory(category);
    setIsEditModalOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!currentCategory) return;

    try {
      setIsMutating(true);
      await axiosInstance.put(
        `${ApiBaseMysql}/blog/categories/${currentCategory.id}/`,
        { name: currentCategory.name }
      );
      toast.success("Category updated successfully");
      await loadCategories();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    } finally {
      setIsMutating(false);
    }
  };

  // Handle create category
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      setIsMutating(true);
      await axiosInstance.post(`${ApiBaseMysql}/blog/categories/`, {
        name: newCategoryName,
      });
      toast.success("Category created successfully");
      setNewCategoryName("");
      setIsCreateModalOpen(false);
      await loadCategories();
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    } finally {
      setIsMutating(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
          {isLoading && (
            <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800 text-white">
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-gray-800">
                Create New Category
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={isMutating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateCategory}
                disabled={isMutating}
                className="bg-black hover:bg-gray-800"
              >
                {isMutating ? "Creating..." : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                handleDeleteClick={handleDeleteClick}
                handleEditClick={handleEditClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <p className="text-gray-500">No categories found</p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-black hover:bg-gray-800"
            >
              Create your first category
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        productName="Delete Category"
      />

      {/* Edit Category Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-gray-800">Edit Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">
                Name
              </Label>
              <Input
                id="name"
                value={currentCategory?.name || ""}
                onChange={(e) =>
                  setCurrentCategory({
                    ...currentCategory!,
                    name: e.target.value,
                  })
                }
                className="bg-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isMutating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateCategory}
              disabled={isMutating}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isMutating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AllCategories;
