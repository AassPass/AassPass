'use client';
import React, { useEffect, useRef } from 'react';

const adsData = [
  { id: 1, type: 'normal', title: 'Ad 1', image: '/ads/ad1.jpg' },
  { id: 2, type: 'normal', title: 'Ad 2', image: '/ads/ad2.jpg' },
  { id: 3, type: 'normal', title: 'Ad 3', image: '/ads/ad3.jpg' },
  { id: 4, type: 'banner', title: 'Banner 1', image: '/ads/banner1.jpg' },
  { id: 5, type: 'banner', title: 'Banner 2', image: '/ads/banner2.jpg' },
  { id: 6, type: 'banner', title: 'Banner 3', image: '/ads/banner3.jpg' },
  { id: 7, type: 'normal', title: 'Ad 4', image: '/ads/ad4.jpg' },
  { id: 8, type: 'normal', title: 'Ad 5', image: '/ads/ad5.jpg' },
];

// Group consecutive ads of same type
const groupConsecutiveAds = (ads) => {
  const groups = [];
  let currentGroup = [];

  for (let i = 0; i < ads.length; i++) {
    const ad = ads[i];
    const prevType = currentGroup[0]?.type;

    if (currentGroup.length === 0 || ad.type === prevType) {
      currentGroup.push(ad);
    } else {
      groups.push([...currentGroup]);
      currentGroup = [ad];
    }
  }

  if (currentGroup.length > 0) groups.push(currentGroup);
  return groups;
};

const AdsPage = () => {
  const groupedAds = groupConsecutiveAds(adsData);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
     

      {groupedAds.map((group, index) => {
        const type = group[0]?.type;

        if (type === 'normal') {
          return <AutoScrollRow key={index} ads={group} />;
        }

        if (type === 'banner') {
          return <AutoScrollBanner key={index} banners={group} />;
        }

        return null;
      })}
    </div>
  );
};

// ⬇️ Reusable auto-scroll for normal ads
const AutoScrollRow = ({ ads }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollAmount = 0;
    const speed = 1.5;

    const step = () => {
      scrollAmount += speed;
      container.scrollLeft = scrollAmount;

      if (scrollAmount >= container.scrollWidth / 2) {
        scrollAmount = 0;
        container.scrollLeft = 0;
      }

      requestAnimationFrame(step);
    };

    container.innerHTML += container.innerHTML; // duplicate for infinite scroll
    requestAnimationFrame(step);

    return () => cancelAnimationFrame(step);
  }, []);

  return (
    <div
      ref={containerRef}
      className="overflow-x-hidden whitespace-nowrap flex gap-4 px-4"
      style={{ scrollBehavior: 'auto' }}
    >
      {[...ads, ...ads].map((ad, index) => (
        <div
          key={`${ad.id}-${index}`}
          className="min-w-[250px] md:min-w-[300px] flex-shrink-0 rounded shadow border p-2 bg-white"
        >
          <img
            src={ad.image}
            alt={ad.title}
            className="w-full h-40 object-cover rounded"
          />
          <h2 className="mt-2 text-lg font-semibold text-center">{ad.title}</h2>
        </div>
      ))}
    </div>
  );
};

// ⬇️ Reusable auto-scroll for banner ads
const AutoScrollBanner = ({ banners }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollAmount = 0;
    const speed = 2.5;

    const step = () => {
      scrollAmount += speed;
      container.scrollLeft = scrollAmount;

      if (scrollAmount >= container.scrollWidth / 2) {
        scrollAmount = 0;
        container.scrollLeft = 0;
      }

      requestAnimationFrame(step);
    };

    container.innerHTML += container.innerHTML;
    requestAnimationFrame(step);

    return () => cancelAnimationFrame(step);
  }, []);

  return (
    <div
      ref={containerRef}
      className="overflow-x-hidden whitespace-nowrap flex gap-6 px-4"
      style={{ scrollBehavior: 'auto' }}
    >
      {[...banners, ...banners].map((ad, index) => (
        <div
          key={`${ad.id}-${index}`}
          className="min-w-[300px] md:min-w-[800px] flex-shrink-0 rounded-lg shadow border bg-white"
        >
          <img
            src={ad.image}
            alt={ad.title}
            className="w-full h-60 object-cover rounded-t-lg"
          />
          <h2 className="p-4 text-xl font-bold text-center">{ad.title}</h2>
        </div>
      ))}
    </div>
  );
};

export default AdsPage;
