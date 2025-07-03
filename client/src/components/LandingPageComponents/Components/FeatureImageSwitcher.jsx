"use client";

import { useEffect, useRef } from "react";

export default function FeatureImageSwitcher({ features }) {
  const imgRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const img = imgRef.current;
    const items = itemsRef.current;

    if (!img || items.length === 0) return;

    // Initialize image & highlight first item
    img.src = features[0].image;
    img.alt = features[0].title;
    items[0]?.classList.add("bg-white/10");

    // Click handler to switch images
    const handlers = items.map((item, index) => {
      const onClick = () => {
        img.src = features[index].image;
        img.alt = features[index].title;

        items.forEach((el) => el.classList.remove("bg-white/10"));
        item.classList.add("bg-white/10");
      };

      item.addEventListener("click", onClick);
      return { item, onClick };
    });

    return () => {
      handlers.forEach(({ item, onClick }) => {
        item.removeEventListener("click", onClick);
      });
    };
  }, [features]);

  return (
    <div className="flex flex-col md:flex-row">
      {/* Image */}
      <div className="w-full max-w-full p-4">
        <img
          id="feature-image"
          ref={imgRef}
          className="w-full rounded h-full object-cover"
          src={features[0].image}
          alt={features[0].title}
        />
      </div>

      {/* Feature List */}
      <div className="w-full  flex flex-col gap-2 p-4" id="feature-list">
        {features.map((feature, i) => (
          <div
            key={feature.id}
            ref={(el) => (itemsRef.current[i] = el)}
            className="feature-item flex rounded gap-4 items-start cursor-pointer p-4 transition hover:bg-white/10"
          >
            {feature.icon}
            <div>
              <h4 className="text-lg font-semibold">{feature.title}</h4>
              <p className="text-white/80 text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
