"use client";
import React, { useState, useEffect, useRef, ReactNode } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useAuth } from "@/Helper/authContext";
import Image from "next/image";

interface SidebarLayoutProps {
  children: ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isBlogDropdownOpen, setIsBlogDropdownOpen] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("access_token");
    window.location.reload();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarMinimize = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const toggleProductDropdown = () => {
    setIsProductDropdownOpen(!isProductDropdownOpen);
  };

  const toggleOrderDropdown = () => {
    setIsOrderDropdownOpen(!isOrderDropdownOpen);
  };
  const toggleBlogDropdown = () => {
    setIsBlogDropdownOpen(!isBlogDropdownOpen);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to handle setting the active item
  const handleSetActiveItem = (item: string) => {
    setActiveItem(item);
  };

  return (
    <div>
      {/* Sidebar Toggle Button for Mobile */}
      <nav className="fixed top-0 z-10 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 lg:hidden">
        <div className="px-3 py-3 flex justify-between items-center">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg focus:outline-none"
          >
            <Icon icon="mdi:menu" className="w-8 h-8" />
          </button>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Image
                src={"/assets/logo.png"}
                alt="logo"
                height={80}
                width={120}
              />
            </Link>
            {/* <p className="text-2xl font-bold dark:text-white">Tour Geeky</p> */}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 h-full bg-gray-900 transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isSidebarMinimized ? "w-20" : "w-72"} lg:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          {/* Sidebar Header */}
          <div className=" flex items-center justify-between">
            <div className={`${isSidebarMinimized ? "hidden" : "block"}`}>
              <Image
                src={"/assets/logo.png"}
                alt="logo"
                height={60}
                width={100}
                className=""
              />
              {/* <p className="text-xl font-bold text-white">Tour Geeky</p> */}
            </div>
            <button
              onClick={toggleSidebarMinimize}
              className="text-gray-400 hover:text-gray-300 rounded-lg focus:outline-none hidden lg:block"
            >
              <Icon icon="hugeicons:sidebar-right-01" className="w-6 h-6" />
            </button>
          </div>
          {/* Sidebar Menu */}
          <p
            className={`text-gray-400 uppercase text-sm font-semibold mb-4 mt-10 ${
              isSidebarMinimized ? "text-xs" : "text-sm"
            }`}
          >
            Main Menu
          </p>
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard/dashboard-home"
                className={`flex items-center p-2 ${
                  activeItem === "Dashboard" ? "text-white" : "text-gray-400"
                } hover:bg-gray-700`}
                onClick={() => handleSetActiveItem("Dashboard")}
              >
                <Icon
                  icon="mdi:view-dashboard-outline"
                  className={`w-5 h-5 ${
                    activeItem === "Dashboard" ? "text-white" : "text-gray-400"
                  }`}
                />
                {!isSidebarMinimized && <span className="ml-3">Dashboard</span>}
              </Link>
            </li>

            {/* Product Management Dropdown */}
            <li>
              <button
                onClick={() => {
                  toggleProductDropdown();
                  handleSetActiveItem("Product Management");
                }}
                className="flex items-center justify-between p-2 text-gray-400 hover:bg-gray-700 w-full"
              >
                <div className="flex items-center">
                  <Icon
                    icon="mdi:package-variant"
                    className={`w-5 h-5 ${
                      activeItem === "Product Management"
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                  />
                  {!isSidebarMinimized && (
                    <span
                      className={`ml-3 flex-1  ${
                        activeItem === "Product Management"
                          ? "text-white"
                          : "text-gray-400"
                      }
                    }`}
                    >
                      Product Management
                    </span>
                  )}
                </div>
                {!isSidebarMinimized && (
                  <Icon
                    icon={
                      isProductDropdownOpen
                        ? "mdi:chevron-up"
                        : "mdi:chevron-down"
                    }
                    className="w-5 h-5"
                  />
                )}
              </button>
              {isProductDropdownOpen && !isSidebarMinimized && (
                <ul className="pl-8 space-y-2">
                  {/* create you own products  */}
                  <li>
                    <Link
                      href="/dashboard/create-product"
                      className={` p-2 flex items-center gap-2 ${
                        activeItem === "create-products"
                          ? "text-white"
                          : "text-gray-400"
                      } hover:bg-gray-700`}
                      onClick={() => handleSetActiveItem("create-products")}
                    >
                      <Icon icon="ic:round-plus" className="text-xl" />
                      Create own product
                    </Link>
                  </li>
                  {/* our products */}
                  <li>
                    <Link
                      href="/dashboard/our-products"
                      className={` p-2 flex items-center gap-2 ${
                        activeItem === "Products"
                          ? "text-white"
                          : "text-gray-400"
                      } hover:bg-gray-700`}
                      onClick={() => handleSetActiveItem("Products")}
                    >
                      <Icon icon="lets-icons:bag" className="text-xl" />
                      Our Products
                    </Link>
                  </li>

                  {/* affiliate products */}
                  <li>
                    <Link
                      href="/dashboard/affiliate-products"
                      className={` p-2 flex items-center gap-2 ${
                        activeItem === "Affiliate Products"
                          ? "text-white"
                          : "text-gray-400"
                      } hover:bg-gray-700`}
                      onClick={() => handleSetActiveItem("Affiliate Products")}
                    >
                      <Icon icon="lets-icons:bag" className="text-xl" />
                      Affiliate Products
                    </Link>
                  </li>

                  {/* arcive products  */}

                  <li>
                    <Link
                      href="/dashboard/archive-products"
                      className={` p-2 flex items-center gap-2 ${
                        activeItem === "archive"
                          ? "text-white"
                          : "text-gray-400"
                      } hover:bg-gray-700`}
                      onClick={() => handleSetActiveItem("archive")}
                    >
                      <Icon
                        icon="solar:archive-check-linear"
                        className="text-xl"
                      />
                      Archive Products
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Order Management Dropdown */}
            <li>
              <button
                onClick={() => {
                  toggleOrderDropdown();
                  handleSetActiveItem("Order Management");
                }}
                className="flex items-center justify-between p-2 text-gray-400 hover:bg-gray-700 w-full"
              >
                <div className="flex items-center">
                  <Icon
                    icon="mdi:clipboard-list-outline"
                    className={`w-5 h-5 ${
                      activeItem === "Order Management"
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                  />
                  {!isSidebarMinimized && (
                    <span
                      className={`ml-3 ${
                        activeItem === "Order Management"
                          ? "text-white"
                          : "text-gray-400"
                      }`}
                    >
                      Order Management
                    </span>
                  )}
                </div>
                {!isSidebarMinimized && (
                  <Icon
                    icon={
                      isOrderDropdownOpen
                        ? "mdi:chevron-up"
                        : "mdi:chevron-down"
                    }
                    className="w-5 h-5"
                  />
                )}
              </button>
              {isOrderDropdownOpen && !isSidebarMinimized && (
                <ul className="pl-8 space-y-2">
                  <li>
                    <Link
                      href="/dashboard/all-orders"
                      className={`block p-2 ${
                        activeItem === "Orders" ? "text-white" : "text-gray-400"
                      } hover:bg-gray-700`}
                      onClick={() => handleSetActiveItem("Orders")}
                    >
                      All Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/scan-tickets"
                      className={`block p-2 ${
                        activeItem === "Returns"
                          ? "text-white"
                          : "text-gray-400"
                      } hover:bg-gray-700`}
                      onClick={() => handleSetActiveItem("Returns")}
                    >
                      Scan Tickets
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Blog Management Dropdown */}
            <li>
              <button
                onClick={() => {
                  toggleBlogDropdown();
                  handleSetActiveItem("Blog Management");
                }}
                className="flex items-center justify-between p-2 text-gray-400 hover:bg-gray-700 w-full"
              >
                <div className="flex items-center">
                  <Icon
                    icon="mdi:clipboard-list-outline"
                    className={`w-5 h-5 ${
                      activeItem === "Blog Management"
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                  />
                  {!isSidebarMinimized && (
                    <span
                      className={`ml-3 ${
                        activeItem === "Blog Management"
                          ? "text-white"
                          : "text-gray-400"
                      }`}
                    >
                      Blog Management
                    </span>
                  )}
                </div>
                {!isSidebarMinimized && (
                  <Icon
                    icon={
                      isBlogDropdownOpen ? "mdi:chevron-up" : "mdi:chevron-down"
                    }
                    className="w-5 h-5"
                  />
                )}
              </button>
              {isBlogDropdownOpen && !isSidebarMinimized && (
                <ul className="pl-8 space-y-2">
                  <li>
                    <Link
                      href="/dashboard/all-blogs"
                      className={`block p-2 ${
                        activeItem === "Orders" ? "text-white" : "text-gray-400"
                      } hover:bg-gray-700`}
                      onClick={() => handleSetActiveItem("Orders")}
                    >
                      All Blogs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/categories"
                      className={`block p-2 ${
                        activeItem === "Category"
                          ? "text-white"
                          : "text-gray-400"
                      } hover:bg-gray-700`}
                      onClick={() => handleSetActiveItem("Category")}
                    >
                      Categories
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link
                href="/dashboard/calendar"
                className={`flex items-center p-2 ${
                  activeItem === "Calendar" ? "text-white" : "text-gray-400"
                } hover:bg-gray-700`}
                onClick={() => handleSetActiveItem("Calendar")}
              >
                <Icon
                  icon="mdi:calendar"
                  className={`w-5 h-5 ${
                    activeItem === "Calendar" ? "text-white" : "text-gray-400"
                  }`}
                />
                {!isSidebarMinimized && <span className="ml-3">Calendar</span>}
              </Link>
            </li>

            <li>
              <Link
                href="/dashboard/customers"
                className={`flex items-center p-2 ${
                  activeItem === "Customers" ? "text-white" : "text-gray-400"
                } hover:bg-gray-700`}
                onClick={() => handleSetActiveItem("Customers")}
              >
                <Icon
                  icon="mdi:account-multiple-outline"
                  className={`w-5 h-5 ${
                    activeItem === "Customers" ? "text-white" : "text-gray-400"
                  }`}
                />
                {!isSidebarMinimized && <span className="ml-3">Customers</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/reviews"
                className={`flex items-center p-2 ${
                  activeItem === "Customers" ? "text-white" : "text-gray-400"
                } hover:bg-gray-700`}
                onClick={() => handleSetActiveItem("Customers")}
              >
                <Icon
                  icon="mdi:account-multiple-outline"
                  className={`w-5 h-5 ${
                    activeItem === "Customers" ? "text-white" : "text-gray-400"
                  }`}
                />
                {!isSidebarMinimized && <span className="ml-3">Reviews</span>}
              </Link>
            </li>

            <li>
              <Link
                href="/dashboard/finance-invoicing"
                className={`flex items-center p-2 ${
                  activeItem === "Finance & Invoicing"
                    ? "text-white"
                    : "text-gray-400"
                } hover:bg-gray-700`}
                onClick={() => handleSetActiveItem("Finance & Invoicing")}
              >
                <Icon
                  icon="mdi:cash-multiple"
                  className={`w-5 h-5 ${
                    activeItem === "Finance & Invoicing"
                      ? "text-white"
                      : "text-gray-400"
                  }`}
                />
                {!isSidebarMinimized && (
                  <span className="ml-3">Finance & Invoicing</span>
                )}
              </Link>
            </li>

            <li onClick={handleLogout}>
              <button
                className="flex items-center p-2 text-gray-400 hover:bg-gray-700"
                onClick={() => handleSetActiveItem("Logout")}
              >
                <Icon
                  icon="mdi:logout"
                  className={`w-5 h-5 ${
                    activeItem === "Logout" ? "text-white" : "text-gray-400"
                  }`}
                />
                {!isSidebarMinimized && <span className="ml-3">Logout</span>}
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Content Area */}
      <main
        className={`transition-all w-full  ${
          isSidebarMinimized ? "ml-20 overflow-x-hidden" : "md:ml-72 "
        } bg-[#EBEFF0]  h-full`}
      >
        {children}
      </main>
    </div>
  );
};

export default SidebarLayout;
