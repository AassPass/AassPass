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
    <div className="max-w-7xl mx-auto py-8 space-y-4">

      {groupedAds[0]?.length > 0 && <AutoScrollRow ads={groupedAds[0]} />}
      {groupedAds[1]?.length > 0 && <AutoScrollBanner banners={groupedAds[1]} />}
      {groupedAds[2]?.length > 0 && <AutoScrollRow ads={groupedAds[2]} />}

    </div>
  );
};

// ⬇️ Reusable auto-scroll for normal ads
const AutoScrollRow = ({ ads }) => {
  const doubledAds = [...ads]; // duplicate for infinite scroll

  return (
    <div className="overflow-hidden">
      <div className="flex gap-4 animate-scroll-row w-max">
        {doubledAds.map((ad, index) => (
          <div
            key={`${ad.id}-${index}`}
            className="max-w-[200px] md:max-w-[300px] space-y-1 flex-shrink-0"
          >
            <div className="w-full aspect-[3/2]">
              <img
                src={ad.image}
                alt={ad.title}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <h2 className="text-sm text-start">{ad.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};



// ⬇️ Reusable auto-scroll for banner ads
const AutoScrollBanner = ({ banners }) => {
  const doubledBanners = [...banners];

  return (
    <div className="overflow-hidden">
      <div className="flex gap-8 animate-scroll-banner w-max">
        {doubledBanners.map((ad, index) => (
          <div key={`${ad.id}-${index}`} className="w-[60vw] flex-shrink-0 text-start">
            <div className="aspect-[3/1]">
              <img
                src={ad.image}
                alt={ad.title}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <h2 className="text-sm text-start">{ad.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};



export default AdsPage;
