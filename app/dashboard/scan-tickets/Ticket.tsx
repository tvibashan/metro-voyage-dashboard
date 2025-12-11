import React from "react";

function Ticket() {
  return (
    <div className="border-[1px] pb-8 rounded-lg">
      <div className="max-w-3xl mx-auto bg-white border rounded-lg shadow-lg mt-8">
        <div className="bg-[#296626] text-white text-center font-semibold rounded-t-lg py-4 mb-4">
          This is Valid Ticket
        </div>

        <div className="ml-10 text-[15px]">
          <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start">
            <p className="w-full sm:w-52">Product Title</p>
            <p className="text-gray-700 flex-1 font-bold">
              Rome: Colosseum, Roman Forum And Palatine Hill
            </p>
          </div>

          <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start">
            <p className="w-full sm:w-52">Reference Code</p>
            <p className="text-gray-700 flex-1">TOURfhgdlfhg</p>
          </div>

          <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start">
            <p className="w-full sm:w-52">Valid Date</p>
            <div className="flex-1">
              <p className="text-gray-700">
                Wed, Oct 21, 2024 (Valid: 1 Day)
              </p>
              <p className="text-[15px] font-bold text-[#1D62F0]">Edit</p>
            </div>
          </div>

          <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start">
            <p className="w-full sm:w-52">Lead Traveller</p>
            <div className="flex-1">
              <p className="text-gray-700 font-bold">
                Frederique Auvivue Marcelli (France)
              </p>
              <p className="text-gray-700">+33XXX XXX XXX</p>
              <p className="text-gray-700">
                Customer-yaeil45ds@reply.tourgeeky.com
              </p>
            </div>
          </div>

          <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start">
            <p className="w-full sm:w-52">Number of Travelers</p>
            <div className="flex-1">
              <p className="text-gray-700 font-bold">1 Adult (18-99) - $56.00</p>
              <p className="text-gray-700">Total: 1 Person</p>
            </div>
          </div>

          <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start">
            <p className="w-full sm:w-52">Payment Status</p>
            <div className="flex-1">
              <div className="mb-4 flex items-center space-x-4">
                <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full">
                  Paid
                </span>
                <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full">
                  Not Paid
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start">
            <p className="w-full sm:w-52">
              Please provide the full names of everyone in group
            </p>
            <div>
              <p className="font-medium">
                Traveler 1: First Name: Ahosan Last Name: Habib
              </p>
            </div>
          </div>

          <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start">
            <p className="w-full sm:w-52">Tickets</p>
            <div className="flex-1">
              <p className="text-gray-700 font-bold">1x Adult</p>
              <p className="text-gray-700 break-all">
                Z8vtJK;HNFJ;HG87SDFGNKJGDFHS76E78TYRGB
              </p>
              <p className="text-[15px] font-bold text-[#1D62F0]">Edit</p>
            </div>
          </div>

          <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start">
            <p className="w-full sm:w-52">Booked On</p>
            <p className="text-gray-700 flex-1">Tue, Sep 24, 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ticket;
