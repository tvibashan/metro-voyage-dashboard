"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/axiosInstance";
import { ApiBaseMysql } from "@/Helper/ApiBase";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
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
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface Blog {
  id: number;
  title: string;
  slug: string;
  short_desc: string;
  details: string;
  category: { id: number; name: string };
  tags: { id: number; name: string }[];
  images: { id: number; image: string }[];
  created_at: string;
  updated_at: string;
}

export default function BlogViewPage() {
  const router = useRouter();
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axiosInstance.get(
          `${ApiBaseMysql}/blog/blogs/${id}/`
        );
        setBlog(response.data.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Failed to load blog");
        router.push("/dashboard/all-blogs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id, router]);

  // Handle blog deletion
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await axiosInstance.delete(`${ApiBaseMysql}/blog/blogs/${id}/`);
      toast.success("Blog deleted successfully");
      router.push("/dashboard/all-blogs");
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="p-4 max-w-4xl mx-auto text-center">
        <p className="text-gray-500">Blog not found</p>
        <Button
          onClick={() => router.push("/dashboard/all-blogs")}
          className="mt-4"
        >
          Back to Blogs
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
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
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header with back button and actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/dashboard/all-blogs")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/all-blogs/edit/${blog.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Blog Content */}
      <article className="space-y-6">
        <header className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">{blog.title}</h1>
          <p className="text-lg text-muted-foreground">{blog.short_desc}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Created:</span>{" "}
              {format(new Date(blog.created_at), "MMMM d, yyyy")}
            </div>
            <div>
              <span className="font-medium">Updated:</span>{" "}
              {format(new Date(blog.updated_at), "MMMM d, yyyy")}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{blog.category.name}</Badge>
            {blog.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
              </Badge>
            ))}
          </div>
        </header>

        {/* Blog Images */}
        {blog.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blog.images.map((image) => (
              <div
                key={image.id}
                className="relative aspect-video rounded-lg overflow-hidden"
              >
                <Image
                  src={image.image}
                  alt={`Blog image ${image.id}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        )}

        {/* Blog Details */}
        <div
          className="prose max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: blog.details }}
        />
      </article>
    </div>
  );
}
