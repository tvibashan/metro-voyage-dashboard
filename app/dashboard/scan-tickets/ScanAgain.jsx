import Image from "next/image";
import React from "react";
import { Icon } from "@iconify/react";

function ScanAgain() {
  return (
    <div className="py-8 px-4 bg-white border border-gray-300 rounded-3xl">
      <div className="flex flex-col justify-center items-center bg-white w-full max-w-lg h-auto mx-auto rounded-3xl p-8 sm:p-12 md:p-16 lg:p-20">
        
        <Image src="/close-circle.png" width={100} height={100} className="sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px]" alt="Not found icon" />
        
        <p className="text-[16px] sm:text-[18px] text-[#010A15B2] font-medium mt-4 text-center px-4">
          Ticket information not found. This ticket may not be valid.
        </p>
        
        <button className="flex mt-4 gap-2 bg-black text-white py-2 px-4 rounded-md text-[12px] sm:text-[14px] font-bold items-center">
          <Icon icon="carbon:scan-alt" className="text-base" />
          Scan Again
        </button>
        
      </div>
    </div>
  );
}

export default ScanAgain;
