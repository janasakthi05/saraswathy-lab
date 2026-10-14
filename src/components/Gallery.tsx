'use client';

import React from 'react';
import { Camera } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  altText?: string;
  category?: string;
}

interface GalleryProps {
  galleryData?: GalleryItem[];
}

const DEFAULT_PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80';

export default function Gallery({ galleryData = [] }: GalleryProps) {
  const defaultGalleryItems: GalleryItem[] = [
    {
      id: 'default-gal-1',
      title: 'Automated Clinical Chemistry Analyzer',
      description: 'High-precision automated analyzer ensuring rapid, calibrated report turnaround under strict sanitary protocols.',
      imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
      category: 'Laboratory',
    },
    {
      id: 'default-gal-2',
      title: 'Sanitary Phlebotomy Sample Bay',
      description: 'Comfortable, sterile sample collection area designed for patient privacy, ease, and quick blood draws.',
      imageUrl: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&w=800&q=80',
      category: 'Facility',
    },
    {
      id: 'default-gal-3',
      title: 'Digital Radiography & Imaging Suite',
      description: 'Modern low-radiation digital X-ray infrastructure for accurate bone, chest, and structural imaging.',
      imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      category: 'Radiology',
    },
  ];

  const displayItems = (galleryData && galleryData.length > 0) ? galleryData : defaultGalleryItems;

  return (
    <section id="gallery" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left max-w-3xl mb-12">
          <span className="text-xs font-bold tracking-widest text-sky-700 uppercase bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
            Facility Infrastructure
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Laboratory & Clinical Equipment Gallery
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed font-medium">
            Explore photos of our clinical analyzers, sanitary draw bays, and Sundarapuram central facility.
          </p>
        </div>

        {/* Gallery Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 group"
            >
              <div className="h-52 bg-slate-200 relative overflow-hidden">
                <img
                  src={item.imageUrl || DEFAULT_PLACEHOLDER_IMAGE}
                  alt={item.altText || item.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_PLACEHOLDER_IMAGE;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs uppercase tracking-wider">
                  {item.category || 'Laboratory'}
                </span>
              </div>
              <div className="p-6 space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                {item.description && (
                  <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
