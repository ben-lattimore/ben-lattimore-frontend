'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';
import { ImageAsset } from '@/types'; // Adjust the import path as needed

interface ImageCarouselProps {
  images: ImageAsset[] | null;
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 900);

    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-full">
      {images.map((image, index) => (
        <div
          key={image.asset._ref} // Use a unique identifier from the asset
          className={`absolute inset-0 flex items-center justify-center ${
            index === currentIndex ? 'block' : 'hidden'
          }`}
        >
          <Image
            src={urlFor(image).url()}
            alt={`Project image ${index + 1}`}
            style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }}
            width={1000}
            height={1000}
          />
        </div>
      ))}
    </div>
  );
}
