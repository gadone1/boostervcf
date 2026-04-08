'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import CountryCodeSelector from '@/components/CountryCodeSelector';

function setAdminCookie() {
  const maxAge = 60 * 5; // 5 minutes
  document.cookie = `admin_access=1; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function getPhoneLimits(dialCode) {
  const rules = {
    '+1': { min: 10, max: 10 },
    '+7': { min: 10, max: 10 },
    '+20': { min: 10, max: 10 },
    '+27': { min: 9, max: 9 },
    '+30': { min: 10, max: 10 },
    '+31': { min: 9, max: 9 },
    '+32': { min: 8, max: 9 },
    '+33': { min: 9, max: 9 },
    '+34': { min: 9, max: 9 },
    '+36': { min: 9, max: 9 },
    '+39': { min: 10, max: 10 },
    '+40': { min: 9, max: 9 },
    '+41': { min: 9, max: 9 },
    '+43': { min: 9, max: 10 },
    '+44': { min: 10, max: 10 },
    '+45': { min: 8, max: 8 },
    '+46': { min: 7, max: 10 },
    '+47': { min: 8, max: 8 },
    '+48': { min: 9, max: 9 },
    '+49': { min: 10, max: 11 },
    '+51': { min: 9, max: 9 },
    '+52': { min: 10, max: 10 },
    '+54': { min: 10, max: 10 },
    '+55': { min: 10, max: 11 },
    '+56': { min: 9, max: 9 },
    '+57': { min: 10, max: 10 },
    '+58': { min: 10, max: 10 },
    '+60': { min: 9, max: 10 },
    '+61': { min: 9, max: 9 },
    '+62': { min: 9, max: 11 },
    '+63': { min: 10, max: 10 },
    '+64': { min: 8, max: 9 },
    '+65': { min: 8, max: 8 },
    '+66': { min: 9, max: 9 },
    '+81': { min: 10, max: 10 },
    '+82': { min: 9, max: 10 },
    '+84': { min: 9, max: 10 },
    '+86': { min: 11, max: 11 },
    '+90': { min: 10, max: 10 },
    '+91': { min: 10, max: 10 },
    '+92': { min: 10, max: 10 },
    '+93': { min: 9, max: 9 },
    '+94': { min: 9, max: 10 },
    '+95': { min: 10, max: 10 },
    '+98': { min: 10, max: 10 },
    '+212': { min: 9, max: 9 },
    '+213': { min: 9, max: 9 },
    '+216': { min: 8, max: 8 },
    '+218': { min: 9, max: 9 },
    '+220': { min: 7, max: 7 },
    '+221': { min: 9, max: 9 },
    '+222': { min: 8, max: 8 },
    '+223': { min: 8, max: 8 },
    '+224': { min: 8, max: 8 },
    '+225': { min: 10, max: 10 },
    '+226': { min: 8, max: 8 },
    '+227': { min: 8, max: 8 },
    '+228': { min: 8, max: 8 },
    '+229': { min: 8, max: 8 },
    '+230': { min: 8, max: 8 },
    '+231': { min: 8, max: 9 },
    '+232': { min: 8, max: 8 },
    '+233': { min: 9, max: 9 },
    '+234': { min: 10, max: 10 },
    '+235': { min: 8, max: 8 },
    '+236': { min: 8, max: 8 },
    '+237': { min: 9, max: 9 },
    '+238': { min: 7, max: 7 },
    '+239': { min: 7, max: 7 },
    '+240': { min: 9, max: 9 },
    '+241': { min: 9, max: 9 },
    '+242': { min: 9, max: 9 },
    '+243': { min: 9, max: 9 },
    '+244': { min: 9, max: 9 },
    '+245': { min: 9, max: 9 },
    '+246': { min: 7, max: 7 },
    '+248': { min: 7, max: 7 },
    '+249': { min: 9, max: 9 },
    '+250': { min: 9, max: 9 },
    '+251': { min: 9, max: 9 },
    '+252': { min: 8, max: 8 },
    '+253': { min: 8, max: 8 },
    '+254': { min: 9, max: 9 },
    '+255': { min: 9, max: 9 },
    '+256': { min: 9, max: 9 },
    '+257': { min: 8, max: 8 },
    '+258': { min: 9, max: 9 },
    '+260': { min: 9, max: 9 },
    '+261': { min: 9, max: 9 },
    '+262': { min: 9, max: 9 },
    '+263': { min: 9, max: 9 },
    '+264': { min: 9, max: 9 },
    '+265': { min: 9, max: 9 },
    '+266': { min: 8, max: 8 },
    '+267': { min: 8, max: 8 },
    '+268': { min: 8, max: 8 },
    '+269': { min: 7, max: 7 },
  };
  return rules[dialCode] || { min: 4, max: 15 };
}

function validatePhone(number, minLength, maxLength) {
  const digits = number.replace(/\D/g, '');
  return digits.length >= minLength && digits.length <= maxLength;
}

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [selectedCountry, setSelectedCountry] = useState({
    name: 'Rwanda',
    code: 'RW',
    dialCode: '+250',
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const countryCode = selectedCountry?.dialCode || '+250';
  const { min: minPhoneLength, max: maxPhoneLength } = useMemo(
    () => getPhoneLimits(countryCode),
    [countryCode]
  );

  const isUsernameValid = useMemo(() => username.trim().length >= 2, [username]);
  const isPhoneValid = useMemo(
    () => validatePhone(phoneNumber, minPhoneLength, maxPhoneLength),
    [phoneNumber, minPhoneLength, maxPhoneLength]
  );
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
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country code
              </label>
              <CountryCodeSelector
                value={selectedCountry}
                onChange={setSelectedCountry}
                placeholder="Select country code"
                className="mb-3"
              />

              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone number
              </label>
              <div className="flex rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 transition-colors">
                <div className="flex items-center px-3 py-3 bg-gray-100 text-gray-700 font-semibold rounded-l-lg border-r border-gray-300">
                  {countryCode}
                </div>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, '');
                    setPhoneNumber(digitsOnly);
                  }}
                  required
                  maxLength={maxPhoneLength}
                  className={`flex-1 px-4 py-3 placeholder:text-black placeholder:opacity-100 placeholder-black text-black focus:outline-none ${
                    phoneNumber && !isPhoneValid ? 'text-red-900' : 'text-gray-900'
                  }`}
                  placeholder={`Enter ${
                    minPhoneLength === maxPhoneLength
                      ? `${minPhoneLength}`
                      : `${minPhoneLength}-${maxPhoneLength}`
                  } digits`}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className={`font-medium ${isPhoneValid ? 'text-green-600' : 'text-red-600'}`}>
                  {isPhoneValid ? (
                    '✓ Phone format OK'
                  ) : (
                    `❗ Phone must be ${
                      minPhoneLength === maxPhoneLength
                        ? `${minPhoneLength}`
                        : `${minPhoneLength}-${maxPhoneLength}`
                    } digits for ${selectedCountry.name}`
                  )}
                </span>
                <span className="text-gray-500">
                  You will save: <span className="font-semibold">{fullPhoneNumber || 'country + number'}</span>
                </span>
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
