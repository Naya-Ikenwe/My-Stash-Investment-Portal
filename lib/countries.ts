// lib/countries.ts
import { countries, getCountryData, type TCountryCode } from 'countries-list';

// Get an array of all countries formatted for a dropdown
export const getCountryOptions = () => {
  return Object.entries(countries).map(([code, data]) => ({
    value: code as TCountryCode, // e.g., 'NG', 'US', 'GB'
    label: data.name,           // e.g., 'Nigeria', 'United States'
    nativeName: data.native,
    // You can add other properties like `data.currency[0]` if needed
  }));
};

// Helper: Get a country's name from its code
export const getCountryName = (code: TCountryCode): string => {
  return countries[code]?.name || code;
};

// Helper: Get full country data
export const getCountryDetails = (code: TCountryCode) => {
  return getCountryData(code); // Returns ICountryData object
};

// If you need a simple list of { code, name } objects
export const allCountries = Object.entries(countries).map(([code, data]) => ({
  code: code as TCountryCode,
  name: data.name
}));