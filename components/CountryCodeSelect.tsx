import React from 'react';

interface CountryCodeSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

// List of common country codes with ISO country codes for reference
const countryCodes = [
  { code: '+1', country: 'US' },
  { code: '+44', country: 'GB' },
  { code: '+33', country: 'FR' },
  { code: '+49', country: 'DE' },
  { code: '+81', country: 'JP' },
  { code: '+86', country: 'CN' },
  { code: '+91', country: 'IN' },
  { code: '+7', country: 'RU' },
  { code: '+55', country: 'BR' },
  { code: '+61', country: 'AU' },
  { code: '+82', country: 'KR' },
  { code: '+39', country: 'IT' },
  { code: '+34', country: 'ES' },
  { code: '+46', country: 'SE' },
  { code: '+47', country: 'NO' },
  { code: '+31', country: 'NL' },
  { code: '+41', country: 'CH' },
  { code: '+32', country: 'BE' },
  { code: '+45', country: 'DK' },
  { code: '+358', country: 'FI' },
];

// Function to get flag emoji from country code
const getFlagEmoji = (countryCode: string) => {
  // Convert country code to regional indicator symbols
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export const CountryCodeSelect: React.FC<CountryCodeSelectProps> = ({ value, onChange, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[42px] appearance-none bg-white border border-slate-200 rounded-l text-sm pl-2 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-overleaf-500 focus:border-overleaf-500"
      >
        {countryCodes.map((country) => (
          <option key={country.code} value={country.code}>
            {getFlagEmoji(country.country)} {country.code}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};
