"use client";
import "./globals.css";
import { AuthProvider } from "@/Helper/authContext";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import { useDasboardStore } from "./store/useDashboardStore";
import { usePathname } from "next/navigation";
const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { fetchData } = useDasboardStore();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/login") {
      fetchData();
    }
  }, [fetchData, pathname]);

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}