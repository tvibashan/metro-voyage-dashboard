import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import grid from '/public/icons/grid.png'
import search from '/public/icons/search.png'
import filter from '/public/icons/filter.png'
import Image from "next/image";

// Dummy Data
const products = [
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt-SwVhaBifcWTjOauTygf4X4mQX93mrxsTA&s", // Dummy image URL
    name: "Dubrovnik: The Ultimate Game of Thrones Tour",
    rating: 3.3,
    referenceCode: "T-804036",
    storeName: "Author Name",
    totalSales: 50,
    status: "Archived",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt-SwVhaBifcWTjOauTygf4X4mQX93mrxsTA&s", // Dummy image URL
    name: "Dubrovnik: The Ultimate Game of Thrones Tour",
    rating: 3.3,
    referenceCode: "T-804036",
    storeName: "Author Name",
    totalSales: 50,
    status: "Archived",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt-SwVhaBifcWTjOauTygf4X4mQX93mrxsTA&s", // Dummy image URL
    name: "Dubrovnik: The Ultimate Game of Thrones Tour",
    rating: 3.3,
    referenceCode: "T-804036",
    storeName: "Author Name",
    totalSales: 50,
    status: "Archived",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt-SwVhaBifcWTjOauTygf4X4mQX93mrxsTA&s", // Dummy image URL
    name: "Dubrovnik: The Ultimate Game of Thrones Tour",
    rating: 3.3,
    referenceCode: "T-804036",
    storeName: "Author Name",
    totalSales: 50,
    status: "Archived",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt-SwVhaBifcWTjOauTygf4X4mQX93mrxsTA&s", // Dummy image URL
    name: "Dubrovnik: The Ultimate Game of Thrones Tour",
    rating: 3.3,
    referenceCode: "T-804036",
    storeName: "Author Name",
    totalSales: 50,
    status: "Archived",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt-SwVhaBifcWTjOauTygf4X4mQX93mrxsTA&s", // Dummy image URL
    name: "Dubrovnik: The Ultimate Game of Thrones Tour",
    rating: 3.3,
    referenceCode: "T-804036",
    storeName: "Author Name",
    totalSales: 50,
    status: "Archived",
  },
  // Add more product objects as needed
];


export default function AffiliateProducts() {
  return (
    <div className="p-2 bg-[#F6F6F6] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <h2 className="text-xl font-bold mt-2">Affiliate Products</h2>
        <div className="flex items-center space-x-3">
          {/* Search Bar */}
          <div className="flex flex-col gap-3 md:flex-row mt-2">
          <div className="flex items-center gap-3 bg-gray-200 px-3 py-2 rounded-full">
          <Image alt="search" src={search} height={18} width={18}/>
            <input
              type="text"
              className="bg-gray-200 rounded-md text-[15px] text-black focus:outline-none"
              placeholder="Search Products"
            />
          </div>

          
            {/* Filter Button */}
            <button className="flex items-center space-x-2 bg-gray-200   rounded-md px-3 py-2 text-[15px] text-black hover:bg-gray-50">
            <Image alt="filter" src={filter} height={18} width={18}/>
              <span>Filter</span>
            </button>

            {/* View Options */}
            <button className="flex items-center space-x-2 bg-gray-200  rounded-md px-3 py-2 text-[15px] text-black hover:bg-gray-50">
            <Image alt="grid" src={grid} height={18} width={18}/>
              <span>Grid View</span>
              <Icon icon="mdi:chevron-down" className="wsemibold text-black" />
            </button>

            {/* Add New Product Button */}
            <button className="flex items-center space-x-2 bg-black text-white rounded-md px-4 py-2 text-[15px] hover:bg-gray-800">
              <Icon icon="mdi:plus" className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-[20px] border shadow-sm overflow-x-auto mt-8">
        <table className="min-w-full table-auto">
          <thead className="bg-[#FAFDF2]">
            <tr>
              <th className="px-6 py-3 text-left text-[15px] font-bold text-black">
                Product
              </th>
              <th className="px-2 py-3 text-center text-[15px] font-bold text-black">
                Reference Code
              </th>
              <th className="px-6 py-3 text-center text-[15px] font-bold text-black">
                Store Name
              </th>
              <th className="px-6 py-3 text-center text-[15px] font-bold text-black">
                Total Sale's
              </th>
              <th className="px-6 py-3 text-center text-[15px] font-bold text-black">
                Status
              </th>
              <th className="px-6 py-3 text-center text-[15px] font-bold text-black">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="border-b last:border-none">
                <td className="px-6 py-4 flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-[50px] h-[50px] rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold text-[15px] text-gray-800 mb-1">
                      {product.name}
                    </p>
                    <p className="text-[15px]">
                    Affiliate by Viator
                    </p>
                    <div className="flex  items-center space-x-1 tsemibold text-black">
                      <div className="flex items-center gap-1 mr-2">
                        <Icon
                          icon="octicon:star-fill-16"
                          className="text-orange-500 w-4 h-4"
                        />
                        <Icon
                          icon="octicon:star-fill-16"
                          className="text-orange-500 w-4 h-4"
                        />
                        <Icon
                          icon="octicon:star-fill-16"
                          className="text-orange-500 w-4 h-4"
                        />
                        <Icon
                          icon="octicon:star-fill-16"
                          className="text-orange-500 w-4 h-4"
                        />
                        <Icon
                          icon="clarity:half-star-line"
                          className="text-orange-500 w-4 h-4"
                        />
                      </div>
                      <span className="text-[15px] font-light ml-3 text-gray-500">
                        {product.rating} of 5 (External Rating)
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[15px] text-center text-gray-600">
                  {product.referenceCode}
                </td>
                <td className="px-6 py-4 text-[15px] text-center text-gray-600">
                  {product.storeName}
                </td>
                <td className="px-6 py-4 text-[15px] text-center text-gray-600">
                  {product.totalSales}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-[#010A151A] text-[#010A15B2] text-xs text-center  font-medium px-3 py-1 rounded-full">
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <Link href='/dashboard/product-details' className="flex justify-center w-max items-center mx-auto text-center space-x-1 px-3 py-1 rounded-full bg-blue-600 bg-opacity-25 text-blue-600 text-xs ">
                    <span>See Details</span> 
                    <Icon icon="mdi:chevron-down" className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
