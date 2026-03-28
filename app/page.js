'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const countryOptions = [
  { label: 'Rwanda (+250)', value: '+250' },
  { label: 'Uganda (+256)', value: '+256' },
  { label: 'Kenya (+254)', value: '+254' },
  { label: 'Tanzania (+255)', value: '+255' },
  { label: 'Burundi (+257)', value: '+257' },
];

function setAdminCookie() {
  const maxAge = 60 * 5; // 5 minutes
  document.cookie = `admin_access=1; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function validatePhone(number) {
  const digits = number.replace(/\D/g, '');
  return digits.length === 9;
}

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [countryCode, setCountryCode] = useState('+250');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isUsernameValid = useMemo(() => username.trim().length >= 2, [username]);
  const isPhoneValid = useMemo(() => validatePhone(phoneNumber), [phoneNumber]);
  const canSubmit = isUsernameValid && isPhoneValid && !isSubmitting;

  const fullPhoneNumber = useMemo(() => {
    const cleaned = phoneNumber.replace(/\s+/g, '');
    if (!countryCode) return cleaned;
    return `${countryCode}${cleaned}`;
  }, [countryCode, phoneNumber]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setAdminCookie();
        router.push('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!canSubmit) {
      setError('Please fix any validation errors before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          countryCode,
          phoneNumber: phoneNumber.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Thank you! Your information has been saved.');
        setUsername('');
        setPhoneNumber('');
      } else {
        setError(data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-30 bg-blue-900 text-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center font-semibold">
          BOOSTER YOUR STATUS VIEWS
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-4 pt-24 pb-24">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 animate-slide-in">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-blue-900 mb-2"> Increase your Whatsapp status</h1>
            <p className="text-blue-600">Register your number securely and wait for the VCF file in Whatsapp group.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={`w-full px-4 py-3 border rounded-lg placeholder:text-black placeholder:opacity-100 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  username && !isUsernameValid ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your name"
              />
              {username && (
                <p className="text-xs mt-2">
                  {isUsernameValid ? (
                    <span className="text-green-600">✓ Looks good</span>
                  ) : (
                    <span className="text-red-600">Username must be at least 2 characters.</span>
                  )}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone number
              </label>
              <div className="flex rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 transition-colors">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-28 bg-transparent px-3 py-3 text-sm text-gray-700 border-r border-gray-300 focus:outline-none"
                >
                  {countryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.value || 'Code'}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, '');
                    setPhoneNumber(digitsOnly.slice(0, 9));
                  }}
                  required
                  className={`flex-1 px-4 py-3 placeholder:text-black placeholder:opacity-100 placeholder-black text-black focus:outline-none ${
                    phoneNumber && !isPhoneValid ? 'text-red-900' : 'text-gray-900'
                  }`}
                  placeholder="Enter 9-digit number"
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className={`font-medium ${isPhoneValid ? 'text-green-600' : 'text-red-600'}`}>
                  {isPhoneValid ? '✓ Phone format OK' : '❗ Phone must be exactly 9 digits'}
                </span>
                <span className="text-gray-500">You will save: <span className="font-semibold">{fullPhoneNumber || 'country + number'}</span></span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>

            {error && (
              <div className="mt-4 p-4 rounded-lg bg-red-50 text-red-800 border border-red-200">
                {error}
              </div>
            )}

            {message && (
              <div className="mt-4 p-4 rounded-lg bg-green-50 text-green-800 border border-green-200">
                {message}
              </div>
            )}

            <div className="mt-6 p-5 rounded-lg bg-green-50 border border-green-200 text-center">
              <h2 className="text-lg font-semibold text-green-800 mb-3">
                JOIN WHATSAPP GROUP TO GET THE VCF FILE
              </h2>
              <a
                href="https://chat.whatsapp.com/KSgrwcpX1mY56WskqvHrc4?mode=gi_t
"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full max-w-xs mx-auto bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                JOIN NOW
              </a>
            </div>
          </form>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-blue-900 backdrop-blur border-t border-white  text-center text-sm text-white py-3">
        <p>Location: City center near Makuza Peace Plaza</p>
        <p>Phone: +250780564825</p>
        <p>© {new Date().getFullYear()} ON TIME TECHNOLOGY</p>
      </footer>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-slide-in {
          animation: slideIn 450ms ease-out;
        }
      `}</style>
    </div>
  );
}
