"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Trash2, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

export default function BlogCreatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [short_desc, setShortDesc] = useState("");
  const [details, setDetails] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // Generate slug from title
  const generateSlug = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove non-word characters
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/--+/g, "-") // Replace multiple - with single -
      .trim();
  };

  // Fetch categories and tags on mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          axiosInstance.get(`${ApiBaseMysql}/blog/categories/`),
          axiosInstance.get(`${ApiBaseMysql}/blog/tags/`),
        ]);
        setCategories(categoriesRes.data.data);
        setTags(tagsRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load categories and tags");
      }
    };
    fetchData();
  }, []);

  // Create new tag
  const createNewTag = async () => {
    if (!newTagName.trim()) {
      toast.error("Tag name cannot be empty");
      return;
    }

    try {
      setIsCreatingTag(true);
      const response = await axiosInstance.post(`${ApiBaseMysql}/blog/tags/`, {
        name: newTagName.trim(),
      });
      
      const newTag = response.data.data;
      setTags([...tags, newTag]);
      setSelectedTagIds([...selectedTagIds, newTag.id]);
      setNewTagName("");
      toast.success("Tag created successfully");
    } catch (error) {
      console.error("Error creating tag:", error);
      toast.error("Failed to create tag");
    } finally {
      setIsCreatingTag(false);
    }
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages([...images, ...files]);

      const previews = files.map((file) => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...previews]);
    }
  };

  // Remove image from upload list
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...previewImages];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
  };

  // Create new blog
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !short_desc || !details || !selectedCategoryId) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", generateSlug(title));
    formData.append("short_desc", short_desc);
    formData.append("details", details);
    formData.append("category", selectedCategoryId);
    formData.append("tags", JSON.stringify(selectedTagIds));
    images.forEach((image) => formData.append("images", image));

    try {
      setIsLoading(true);
      await axiosInstance.post(`${ApiBaseMysql}/blog/blogs/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Blog created successfully");
      router.push("/dashboard/all-blogs");
    } catch (error: any) {
      console.error("Error creating blog:", error);
      if (error.response?.data?.details) {
        const errors = error.response.data.details;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key].join(", ")}`);
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to create blog");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Blog</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/all-blogs")}>
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
          <div className="flex items-center justify-between">
            <Label htmlFor="tags">Tags</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-sm">
                  <Plus className="mr-1 h-3 w-3" /> Create New Tag
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Tag</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Enter tag name"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setNewTagName("")}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={createNewTag}
                      disabled={isCreatingTag || !newTagName.trim()}
                    >
                      {isCreatingTag ? "Creating..." : "Create Tag"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
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
                    <X className="h-3 w-3" />
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
            {previewImages.map((preview, index) => (
              <div key={index} className="relative group">
                <Image
                  src={preview}
                  alt={`Preview ${index}`}
                  width={150}
                  height={150}
                  className="rounded-md object-cover h-24 w-full"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
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
                Creating...
              </span>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Blog
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}