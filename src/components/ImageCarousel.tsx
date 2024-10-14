'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';

export default function ImageCarousel({ images }: { images: any[] | null }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 500);

    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <div className="fixed right-0 top-0 w-1/2 h-screen">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 ${index === currentIndex ? 'block' : 'hidden'}`}
        >
          <Image
            src={urlFor(image).width(1000).height(1000).url()}
            alt={`Project image ${index + 1}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
      ))}
    </div>
  );
}
