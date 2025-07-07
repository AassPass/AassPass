'use client';

import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { getCoordinatesFromQuery } from '@/lib/mapboxGeocode';
import { useRole } from '@/Context/RoleContext';

const HeroClientEnhancements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { setUserLocation } = useRole();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.length >= 3) fetchSuggestions(searchTerm);
      else setSuggestions([]);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchSuggestions = async (value) => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&autocomplete=true&limit=5`
      );
      const data = await res.json();
      setSuggestions(data.features || []);
    } catch (error) {
      console.error('Mapbox error:', error);
    }
  };

  const handleSelect = (place) => {
    const [lng, lat] = place.center;
    setSearchTerm(place.place_name);
    setUserLocation({ latitude: lat, longitude: lng });
    setSuggestions([]);
  };

  const handleEnterSearch = async () => {
    const coords = await getCoordinatesFromQuery(searchTerm);
    if (coords) {
      setUserLocation(coords);
      setSuggestions([]);
    } else {
      alert('Location not found.');
    }
  };

  return (
    <div className="w-full max-w-2xl ">
      <div className="relative w-full">
        <span
          onClick={handleEnterSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-yellow-400 p-2 rounded-full z-10 cursor-pointer"
          title="Search"
        >
          <MapPin size={20} color="#fff" />
        </span>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleEnterSearch();
          }}
          onBlur={() => setTimeout(() => setSuggestions([]), 150)}
          placeholder="Search shops, locations..."
          className="w-full pl-4 pr-12 py-3 rounded-full focus:outline-none text-black placeholder-gray-500 shadow-md"
          style={{ border: '2px solid #facc15', backgroundColor: '#fff' }}
        />

        {suggestions.length > 0 && (
          <ul className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-60 overflow-y-auto">
            {suggestions.map((place) => (
              <li
                key={place.id}
                onClick={() => handleSelect(place)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {place.place_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HeroClientEnhancements;
