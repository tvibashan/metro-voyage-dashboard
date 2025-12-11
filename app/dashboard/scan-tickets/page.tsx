import { Icon } from "@iconify/react";
import Scanner from './Scanner'
import ScanAgain from './ScanAgain'
import Ticket from './Ticket'

function ScanTickets() {
  return (
    <div className="p-2 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Scan Tickets</h2>
        <div className="flex items-center space-x-3">
          {/* View Options */}
          <button className="flex items-center space-x-2 bg-gray-200  rounded-md px-3 py-2 text-sm text-black hover:bg-gray-50">
            <Icon icon="system-uicons:file-download" className="w-5 h-5" />
          </button>

          {/* Add New Product Button */}
          <button className="flex items-center space-x-2 bg-gray-200 rounded-md px-3 py-2 text-sm hover:bg-gray-800">
            <Icon icon="iconamoon:printer-light" className="w-5 h-5" />
          </button>
        </div>
      </div>
      {/* Body */}
      {/* <Scanner /> */}
      {/* <ScanAgain/> */}

      <Ticket/>
      
    </div>
  );
}

export default ScanTickets;
