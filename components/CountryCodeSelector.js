'use client';

import { useState, useRef, useEffect } from 'react';
import countries from '@/lib/countries.json';

export default function CountryCodeSelector({
  value = null,
  onChange = null,
  placeholder = 'Select country...',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(value);
  const containerRef = useRef(null);

  // Filter countries based on search term
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm)
  );

  // Handle country selection
  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchTerm('');
    
    // Call onChange callback if provided
    if (onChange) {
      onChange(country);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get display text
  const displayText = selectedCountry
    ? `${selectedCountry.name} (${selectedCountry.dialCode})`
    : placeholder;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Dropdown trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      >
        <div className="flex justify-between items-center">
          <span className={selectedCountry ? 'text-gray-900' : 'text-gray-500'}>
            {displayText}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          {/* Search input */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-2">
            <input
              type="text"
              placeholder="Search country or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Country list */}
          <ul className="max-h-64 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <li key={country.code}>
                  <button
                    onClick={() => handleSelectCountry(country)}
                    className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition ${
                      selectedCountry?.code === country.code
                        ? 'bg-blue-100 text-blue-900 font-semibold'
                        : 'text-gray-900'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{country.name}</span>
                      <span className="text-gray-600 font-mono">{country.dialCode}</span>
                    </div>
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-center text-gray-500">
                No countries found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
