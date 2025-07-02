'use client';
import { GetRandomAds } from '@/services/homeGetAds';
import React, { useEffect, useRef, useState } from 'react';

// const adsData = [
//   { id: 1, type: 'normal', title: 'Ad 1', image: '/ads/ad1.jpg' },
//   { id: 2, type: 'normal', title: 'Ad 2', image: '/ads/ad2.jpg' },
//   { id: 3, type: 'normal', title: 'Ad 3', image: '/ads/ad3.jpg' },
//   { id: 4, type: 'banner', title: 'Banner 1', image: '/ads/banner1.jpg' },
//   { id: 5, type: 'banner', title: 'Banner 2', image: '/ads/banner2.jpg' },
//   { id: 6, type: 'banner', title: 'Banner 3', image: '/ads/banner3.jpg' },
//   { id: 7, type: 'normal', title: 'Ad 4', image: '/ads/ad4.jpg' },
//   { id: 8, type: 'normal', title: 'Ad 5', image: '/ads/ad5.jpg' },
// ];

// Group consecutive ads of same type
const groupConsecutiveAds = (ads) => {
  let normalImages = [];
  let bannerImages = [];

  ads.forEach(ad => {
    ad.images.forEach(img => {
      const imageWithMeta = {
        ...img,
        title: ad.title,
        id: ad.id,
        image: img.url, // alias for <img src=...>
      };

      if (img.type === 'NORMAL') {
        normalImages.push(imageWithMeta);
      } else if (img.type === 'BANNER') {
        bannerImages.push(imageWithMeta);
      }
    });
  });

  const half = Math.floor(normalImages.length / 2);
  const firstHalf = normalImages.slice(0, half);
  const secondHalf = normalImages.slice(half);

  return [firstHalf, bannerImages, secondHalf];
};



const AdsPage = () => {
  const [groupedAds, setGroupedAds] = useState([[], [], []]);
  // const groupedAds = groupConsecutiveAds(adsData);

  useEffect(() => {
    const fetchAds = async () => {
      const ads = await GetRandomAds();
      console.log(ads);
      if (Array.isArray(ads)) {
        setGroupedAds(groupConsecutiveAds(ads));
      }
    };

    fetchAds();
  }, []);


  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">

      {groupedAds[0]?.length > 0 && <AutoScrollRow ads={groupedAds[0]} />}
      {groupedAds[1]?.length > 0 && <AutoScrollBanner banners={groupedAds[1]} />}
      {groupedAds[2]?.length > 0 && <AutoScrollRow ads={groupedAds[2]} />}

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
