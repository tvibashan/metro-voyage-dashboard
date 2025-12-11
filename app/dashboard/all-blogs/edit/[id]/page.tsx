"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import axiosInstance from "@/axiosInstance";
import { ApiBaseMysql } from "@/Helper/ApiBase";
import Image from "next/image";
import { Trash2, Save, ArrowLeft } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface BlogImage {
  id: number;
  image: string;
}

export default function BlogEditPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  // Form states
  const [title, setTitle] = useState("");
  const [short_desc, setShortDesc] = useState("");
  const [details, setDetails] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [existingImages, setExistingImages] = useState<BlogImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // Fetch blog data and categories/tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const [blogRes, categoriesRes, tagsRes] = await Promise.all([
          axiosInstance.get(`${ApiBaseMysql}/blog/blogs/${id}/`),
          axiosInstance.get(`${ApiBaseMysql}/blog/categories/`),
          axiosInstance.get(`${ApiBaseMysql}/blog/tags/`),
        ]);

        const blogData = blogRes.data.data;
        setTitle(blogData.title);
        setShortDesc(blogData.short_desc);
        setDetails(blogData.details);
        setSelectedCategoryId(blogData.category.id.toString());
        setSelectedTagIds(blogData.tags.map((tag: Tag) => tag.id));
        setExistingImages(blogData.images);

        setCategories(categoriesRes.data.data);
        setTags(tagsRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load blog data");
        router.push("/dashboard/all-blogs");
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [id, router]);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages([...newImages, ...files]);

      const previews = files.map((file) => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...previews]);
    }
  };

  // Remove existing image (mark for deletion)
  const removeExistingImage = (id: number) => {
    setImagesToDelete([...imagesToDelete, id]);
    setExistingImages(existingImages.filter((img) => img.id !== id));
  };

  // Remove new image from upload list
  const removeNewImage = (index: number) => {
    const updatedImages = [...newImages];
    updatedImages.splice(index, 1);
    setNewImages(updatedImages);

    const updatedPreviews = [...previewImages];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);
  };

  // Update blog
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !short_desc || !details || !selectedCategoryId) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("short_desc", short_desc);
    formData.append("details", details);
    formData.append("category", selectedCategoryId);
    formData.append("tags", JSON.stringify(selectedTagIds));
    formData.append("images_to_delete", JSON.stringify(imagesToDelete));
    newImages.forEach((image) => formData.append("images", image));

    try {
      setIsLoading(true);
      await axiosInstance.patch(`${ApiBaseMysql}/blog/blogs/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Blog updated successfully");
      router.push("/dashboard/all-blogs");
    } catch (error: any) {
      console.error("Error updating blog:", error);
      if (error.response?.data?.details) {
        const errors = error.response.data.details;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key].join(", ")}`);
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to update blog");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="p-4 max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-9 w-24 rounded-md bg-gray-200 animate-pulse"></div>
          <div className="h-9 w-24 rounded-md bg-gray-200 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ))}
          <div className="h-32 bg-gray-200 animate-pulse rounded"></div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 animate-pulse rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Blog</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/all-blogs")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blogs
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="short_desc">Short Description *</Label>
          <Textarea
            id="short_desc"
            value={short_desc}
            onChange={(e) => setShortDesc(e.target.value)}
            rows={3}
            placeholder="Enter a brief description of the blog..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="details">Details *</Label>
          <Textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={8}
            placeholder="Write your blog content here..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={selectedCategoryId}
            onValueChange={setSelectedCategoryId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Select
            value=""
            onValueChange={(value) => {
              if (value && !selectedTagIds.includes(parseInt(value))) {
                setSelectedTagIds([...selectedTagIds, parseInt(value)]);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tags" />
            </SelectTrigger>
            <SelectContent>
              {tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.id.toString()}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedTagIds.map((tagId) => {
              const tag = tags.find((t) => t.id === tagId);
              return (
                <Badge
                  key={tagId}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  {tag?.name}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedTagIds(
                        selectedTagIds.filter((id) => id !== tagId)
                      )
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="images">Images</Label>
          <Input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
            {existingImages.map((image) => (
              <div key={image.id} className="relative group">
                <Image
                  src={image.image}
                  alt={`Blog image ${image.id}`}
                  width={150}
                  height={150}
                  className="rounded-md object-cover h-24 w-full"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(image.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
            {previewImages.map((preview, index) => (
              <div key={`new-${index}`} className="relative group">
                <Image
                  src={preview}
                  alt={`Preview ${index}`}
                  width={150}
                  height={150}
                  className="rounded-md object-cover h-24 w-full"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/dashboard/all-blogs")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </span>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Blog
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
