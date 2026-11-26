'use client';

import React from 'react';

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

const DEFAULT_PLACEHOLDER_IMAGE = '/images/gallery/lab-exterior.png';

export default function Gallery({ galleryData = [] }: GalleryProps) {
  const defaultGalleryItems: GalleryItem[] = [
    {
      id: 'gallery-xray-room',
      title: 'X-Ray Examination Room',
      description: 'Ergonomic diagnostic examination table and ceiling-guided radiography system engineered for safe, comfortable patient positioning.',
      imageUrl: '/images/gallery/xray-examination-room.jpg',
      category: 'Radiology',
    },
    {
      id: 'gallery-siemens-xray',
      title: 'Siemens X-Ray Machine',
      description: 'High-precision Siemens digital radiography tube and column unit delivering sharp diagnostic imaging with optimized radiation dose control.',
      imageUrl: '/images/gallery/siemens-xray.jpg',
      category: 'Equipment',
    },
    {
      id: 'gallery-lab-exterior',
      title: 'Saraswathy Laboratory Exterior',
      description: 'Our central diagnostic laboratory facility on Madukkarai Main Road, Sundarapuram, Coimbatore, equipped for comprehensive healthcare testing.',
      imageUrl: '/images/gallery/lab-exterior.png',
      category: 'Facility',
    },
    {
      id: 'gallery-opg-dental',
      title: 'Digital OPG & Dental Imaging',
      description: 'Specialized digital Orthopantomagram (OPG) panoramic dental scanner for high-resolution maxillofacial and dentition diagnostic imaging.',
      imageUrl: '/images/gallery/opg-dental-imaging.jpg',
      category: 'Dental & OPG',
    },
  ];

  const hasValidCustomItems =
    galleryData &&
    galleryData.length > 0 &&
    !galleryData.some((item) => item.imageUrl.includes('unsplash.com'));

  const displayItems = hasValidCustomItems ? galleryData : defaultGalleryItems;

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
            Explore authentic photographs of our diagnostic imaging suites, clinical equipment, and Sundarapuram central facility.
          </p>
        </div>

        {/* Gallery Image Grid - 4 cards responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 group flex flex-col"
            >
              <div className="h-56 bg-slate-200 relative overflow-hidden">
                <img
                  src={item.imageUrl || DEFAULT_PLACEHOLDER_IMAGE}
                  alt={item.altText || item.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_PLACEHOLDER_IMAGE;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-sky-950/85 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs uppercase tracking-wider">
                  {item.category || 'Facility'}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1.5">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
