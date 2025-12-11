"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axiosInstance from "@/axiosInstance";
import { ApiBaseMysql } from "@/Helper/ApiBase";
import { Trash2, Edit, ChevronLeft, ChevronRight } from "lucide-react";
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

interface Blog {
  id: number;
  title: string;
  details: string;
  category: { id: number; name: string };
  tags: { id: number; name: string }[];
  images: { id: number; image: string }[];
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

export default function BlogManagement() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<number | null>(null);

  // Fetch blogs
  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        search: searchQuery,
        ...(selectedCategory !== "all" && { category: selectedCategory }),
        ...(selectedTag !== "all" && { tags: selectedTag }),
      });

      const response = await axiosInstance.get(
        `${ApiBaseMysql}/blog/blogs/?${params.toString()}`
      );
      setBlogs(response.data.data.results);
      setTotalPages(response.data.data.total_pages);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories and tags
  const fetchCategoriesAndTags = async () => {
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

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;

    try {
      setIsMutating(true);
      await axiosInstance.delete(`${ApiBaseMysql}/blog/blogs/${blogToDelete}/`);
      toast.success("Blog deleted successfully");
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog");
    } finally {
      setIsMutating(false);
      setIsDeleteModalOpen(false);
      setBlogToDelete(null);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (id: number) => {
    setBlogToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Initial data fetch
  useEffect(() => {
    fetchBlogs();
    fetchCategoriesAndTags();
  }, [page, searchQuery, selectedCategory, selectedTag]);

  return (
    <div className="p-4 space-y-6">
      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              blog and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Blog Management</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Input
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-64"
          />
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedTag}
            onValueChange={(value) => {
              setSelectedTag(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {tags?.map((tag) => (
                <SelectItem key={tag.id} value={tag.id.toString()}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="bg-black hover:bg-gray-800"
            onClick={() => router.push("all-blogs/create")}
          >
            New Blog
          </Button>
        </div>
      </div>

      {/* Blog List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : blogs.length > 0 ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blog Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell className="font-medium">
                        {blog.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{blog.category.name}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {blog.tags.map((tag) => (
                            <Badge
                              key={tag.id}
                              variant="secondary"
                              className="whitespace-nowrap"
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(blog.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`all-blogs/${blog.id}`)}
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`all-blogs/edit/${blog.id}`)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteModal(blog.id)}
                            disabled={isMutating}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No blogs found</p>
            <Button
              onClick={() => router.push("all-blogs/create")}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700"
            >
              Create your first blog
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
