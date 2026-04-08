'use client';

import { useState } from 'react';
import CountryCodeSelector from './CountryCodeSelector';

export default function PhoneNumberForm() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submitted, setSubmitted] = useState(null);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedCountry || !phoneNumber) {
      alert('Please select a country and enter a phone number');
      return;
    }

    const fullPhoneNumber = `${selectedCountry.dialCode}${phoneNumber}`;
    setSubmitted({
      country: selectedCountry.name,
      dialCode: selectedCountry.dialCode,
      number: phoneNumber,
      fullNumber: fullPhoneNumber,
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Enter Phone Number</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Country Code Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <CountryCodeSelector
            value={selectedCountry}
            onChange={handleCountryChange}
            placeholder="Select your country..."
          />
        </div>

        {/* Phone Number Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="flex gap-2">
            {selectedCountry && (
              <div className="flex items-center px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-mono">
                {selectedCountry.dialCode}
              </div>
            )}
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>

      {/* Display submitted data */}
      {submitted && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            Phone Number Submitted
          </h3>
          <div className="space-y-1 text-sm text-green-800">
            <p>
              <strong>Country:</strong> {submitted.country}
            </p>
            <p>
              <strong>Dial Code:</strong> {submitted.dialCode}
            </p>
            <p>
              <strong>Phone Number:</strong> {submitted.number}
            </p>
            <p className="mt-2 p-2 bg-green-100 rounded font-mono">
              <strong>Full Number:</strong> {submitted.fullNumber}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
