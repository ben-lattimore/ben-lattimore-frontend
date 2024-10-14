'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';

export default function ImageCarousel({ images }: { images: any[] | null }) {
  const [currentIndex, setCurrentIndex] = useState(0);

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
          key={index}
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
