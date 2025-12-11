"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { X, Trash2, Search, Plus, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { fetchTags, createTags, deleteTag } from "@/services/productService";
import { toast } from "sonner";
import Image from "next/image";

export interface Tag {
  id: number;
  name: string;
  image?: string;
}

interface ProductTagsSectionProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  productData: any;
  setProductData: any;
}

const ProductTagsSection: React.FC<ProductTagsSectionProps> = ({
  selectedTags,
  onTagsChange,
  productData,
  setProductData,
}) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [tagImage, setTagImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const newTagInputRef = useRef<HTMLInputElement>(null);

  const loadTags = useCallback(async () => {
    try {
      setIsLoading(true);
      const {results}: any = await fetchTags(searchTerm);
      const allTags = [...(results || [])];
      setTags(allTags);
    } catch (error) {
      toast.error("Failed to load tags");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim()) {
        loadTags();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [loadTags, searchTerm]);

  const handleTagSelect = (tag: Tag) => {
    if (!selectedTags.some((t) => t.id === tag.id)) {
      onTagsChange([...selectedTags, tag]);
      setSearchTerm("");
    }

    setProductData({
      ...productData,
      tags: [...(productData.tags || []), tag],
    });
  };

  const handleTagRemove = (tagId: number) => {
    onTagsChange(selectedTags.filter((tag) => tag.id !== tagId));
    setProductData({
      ...productData,
      tags: productData.tags.filter((tag: Tag) => tag.id !== tagId),
    });
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      formData.append('name', newTagName.trim());
      if (tagImage) {
        formData.append('image', tagImage);
      }

      const createdTag = await createTags(formData);
      if (createdTag?.data) {
        const newTag = createdTag.data;
        setTags((prevTags) => [...prevTags, newTag]);
        onTagsChange([...selectedTags, newTag]);
        setNewTagName("");
        setTagImage(null);
        toast.success(`Tag "${newTagName.trim()}" created successfully`);
        setSearchTerm("");
        setIsTagModalOpen(false);

        setProductData({
          ...productData,
          tags: [...(productData.tags || []), newTag],
        });
      }
    } catch (error) {
      toast.error("Failed to create tag");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTagName.trim() && !isLoading) {
      handleCreateTag();
    }
  };

  const confirmDeleteTag = (tag: Tag, e: React.MouseEvent) => {
    e.stopPropagation();
    setTagToDelete(tag);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteTag = async () => {
    if (!tagToDelete) return;

    try {
      setIsLoading(true);
      await deleteTag(tagToDelete.id);
      setTags((prevTags) => prevTags.filter((tag) => tag.id !== tagToDelete.id));
      onTagsChange(selectedTags.filter((tag) => tag.id !== tagToDelete.id));
      toast.success(`Tag "${tagToDelete.name}" deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete tag");
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setTagToDelete(null);
    }
  };

  const handleOpenTagModal = () => {
    setIsTagModalOpen(true);
    setTimeout(() => {
      if (newTagInputRef.current) {
        newTagInputRef.current.focus();
      }
    }, 0);
  };

  const availableTags = tags.filter(
    (tag) => !selectedTags.some((selected) => selected.id === tag.id)
  );

  return (
    <div className="space-y-4 mb-10">
      {/* Selected Tags Section */}
      <p className="text-black font-semibold text-lg mb-[10px]">
        Select Tags to find your product faster
      </p>
      <div className="flex flex-wrap gap-2 min-h-8">
        {productData?.tags?.length === 0 ? (
          <p className="text-gray-500 text-sm">No tags selected</p>
        ) : (
          productData?.tags?.map((tag: Tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="px-3 py-1 flex items-center gap-1"
            >
              {tag.image ? (
                <Image
                  src={tag.image}
                  alt={tag.name}
                  width={16}
                  height={16}
                  className="h-4 w-4 object-cover rounded-full"
                />
              ) : (
                <Tag className="h-3 w-3" />
              )}
              <span>{tag.name}</span>
              <button
                onClick={() => handleTagRemove(tag.id)}
                className="ml-1 hover:text-red-500 focus:outline-none"
                disabled={isLoading}
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        )}
      </div>

      {/* Search and Add Section */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tags..."
            className="pl-8"
          />
        </div>

        <Dialog open={isTagModalOpen} onOpenChange={setIsTagModalOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              size="sm"
              className="whitespace-nowrap"
              onClick={handleOpenTagModal}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Tag</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                ref={newTagInputRef}
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyPress={handleNewTagKeyPress}
                placeholder="Tag name"
                disabled={isLoading}
                autoFocus
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Tag Image (Optional)</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setTagImage(e.target.files?.[0] || null)}
                  disabled={isLoading}
                />
                {tagImage && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-gray-500">Selected:</span>
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {tagImage.name}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isLoading}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  onClick={handleCreateTag}
                  disabled={!newTagName.trim() || isLoading}
                >
                  {isLoading ? "Creating..." : "Create Tag"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Results */}
      {searchTerm && (
        <div
          className={
            availableTags.length > 0
              ? "border rounded-lg mt-2 max-h-60 overflow-y-auto shadow-sm"
              : ""
          }
        >
          {isLoading ? (
            <div className="text-center p-4 text-gray-500">Loading...</div>
          ) : availableTags.length > 0 ? (
            availableTags.map((tag) => (
              <div
                key={tag.id}
                className="flex justify-between items-center p-3 hover:bg-gray-50 border-b last:border-b-0 cursor-pointer"
                onClick={() => handleTagSelect(tag)}
              >
                <div className="flex items-center gap-2">
                  {tag.image ? (
                    <Image
                      src={tag.image}
                      alt={tag.name}
                      width={16}
                      height={16}
                      className="h-4 w-4 object-cover rounded-full"
                    />
                  ) : (
                    <Tag className="h-4 w-4 text-gray-500" />
                  )}
                  <span>{tag.name}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => confirmDeleteTag(tag, e)}
                  className="text-gray-400 hover:text-red-500 p-1 focus:outline-none"
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-gray-500">
              No matching tags found
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the tag "{tagToDelete?.name}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button" disabled={isLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              type="button"
              onClick={handleDeleteTag}
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductTagsSection;