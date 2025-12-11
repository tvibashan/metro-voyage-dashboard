// app/dashboard/layout.tsx
"use client";
import React from "react";
import { usePathname } from "next/navigation";
import SidebarLayout from "./sidebar";
import CreateProduct from "./create-product/page";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  const isCreateProductPage = pathname === "/dashboard/create-product";

  return (
    <div className="lg:flex lg:justify-center h-full bg-black">
      <SidebarLayout>
        <div className="hidden">sidebar</div>
      </SidebarLayout>
      <div className="flex h-full bg-[#F6F6F6] w-full">
        <main
          className={`px-6 ${
            isCreateProductPage ? "bg-white" : "bg-[#F6F6F6]"
          } h-full w-full`}
        >
          {isCreateProductPage ? <CreateProduct /> : children}
        </main>
      </div>
    </div>
  );
}
