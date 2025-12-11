// components/MockRichTextEditor.tsx
import React from "react";
import { Icon } from "@iconify/react";

const MockRichTextEditor: React.FC = () => {
  return (
    <div className="p-4 border rounded-[12px] bg-white">
      <div className="flex flex-col md:flex-row gap-5 justify-between bg-gray-100 py-2 px-3 rounded-lg">
        <select className="bg-white py-1 rounded-md px-3 outline-none border">
          <option value="heading1">Heading 1</option>
          <option value="heading2">Heading 2</option>
          <option value="heading3">Heading 3</option>
          <option value="heading4">Heading 4</option>
          <option value="heading5">Heading 5</option>
        </select>
        {/* Toolbar */}
        <div className="flex gap-2 mb-2 flex-wrap text-xl">
          {/* Heading Options */}
          <button
            className="p-2 hover:bg-gray-200 rounded-lg"
            title="Heading 1"
          >
            <Icon icon="mdi:format-header-1" className="text-gray-700" />
          </button>
          <button
            className="p-2 hover:bg-gray-200 rounded-lg"
            title="Heading 2"
          >
            <Icon icon="mdi:format-header-2" className="text-gray-700" />
          </button>

          {/* Formatting Options */}
          <button className="p-2 hover:bg-gray-200 rounded-lg" title="Bold">
            <Icon icon="mdi:format-bold" className="text-gray-700" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-lg" title="Italic">
            <Icon icon="mdi:format-italic" className="text-gray-700" />
          </button>
          <button
            className="p-2 hover:bg-gray-200 rounded-lg"
            title="Underline"
          >
            <Icon icon="mdi:format-underline" className="text-gray-700" />
          </button>

          {/* Alignment Options */}
          <button
            className="p-2 hover:bg-gray-200 rounded-lg"
            title="Align Left"
          >
            <Icon icon="mdi:format-align-left" className="text-gray-700" />
          </button>
          <button
            className="p-2 hover:bg-gray-200 rounded-lg"
            title="Align Center"
          >
            <Icon icon="mdi:format-align-center" className="text-gray-700" />
          </button>
          <button
            className="p-2 hover:bg-gray-200 rounded-lg"
            title="Align Right"
          >
            <Icon icon="mdi:format-align-right" className="text-gray-700" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-lg" title="Justify">
            <Icon icon="mdi:format-align-justify" className="text-gray-700" />
          </button>

          {/* Link and Image */}
          <button
            className="p-2 hover:bg-gray-200 rounded-lg"
            title="Insert Link"
          >
            <Icon icon="mdi:link" className="text-gray-700" />
          </button>
          <button
            className="p-2 hover:bg-gray-200 rounded-lg"
            title="Insert Image"
          >
            <Icon icon="mdi:image" className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Placeholder for editor area */}
      <textarea className="w-full p-2 h-52  rounded-lg  bg-transparent text-sm text-gray-700 mt-3 focus:border outline-none focus:border-green-500 focus:border-opacity-30 ">
        Please insert your text in English
      </textarea>
    </div>
  );
};

export default MockRichTextEditor;
