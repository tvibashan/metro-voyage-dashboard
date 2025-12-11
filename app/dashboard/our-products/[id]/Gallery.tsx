"use client"
import Image from "next/image";
import React, { useState } from "react";

function Gallery({ data }: any) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  if (!data?.images || data.images.length === 0) return null;

  const openImage = (index: number) => {
    setSelectedImage(data.images[index].image);
    setCurrentIndex(index);
  };

  const nextImage = () => {
    if (currentIndex !== null && currentIndex < data.images.length - 1) {
      openImage(currentIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentIndex !== null && currentIndex > 0) {
      openImage(currentIndex - 1);
    }
  };

  return (
    <div className="my-5 w-full grid grid-cols-2 gap-4 relative">
      {/* Large Image (First One) */}
      <div className="col-span-2 md:col-span-1 relative">
        <Image
          className="rounded-lg w-full h-auto object-cover cursor-pointer"
          height={450}
          width={700}
          src={data.images[0]?.image}
          alt="gallery-1"
          onClick={() => openImage(0)}
        />
        {data.images.length > 5 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg cursor-pointer" onClick={() => openImage(1)}>
            +{data.images.length - 5}
          </div>
        )}
      </div>

      {/* Grid of Smaller Images */}
      <div className="col-span-2 md:col-span-1 grid grid-cols-2 gap-4">
        {data.images.slice(1, 5).map((image: any, index: number) => (
          <div key={image.id} className="w-full">
            <Image
              className="rounded-lg w-full h-auto object-cover cursor-pointer"
              height={200}
              width={560}
              src={image.image}
              alt={`gallery-${index + 2}`}
              onClick={() => openImage(index + 1)}
            />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50" onClick={() => setSelectedImage(null)}>
          <div className="relative p-4 max-w-3xl mx-auto" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 text-white text-3xl"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
            <Image
              className="rounded-lg w-auto h-auto max-w-full max-h-screen"
              height={700}
              width={900}
              src={selectedImage}
              alt="Selected"
            />
            <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full" onClick={prevImage}>
              &#8592;
            </button>
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full" onClick={nextImage}>
              &#8594;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
