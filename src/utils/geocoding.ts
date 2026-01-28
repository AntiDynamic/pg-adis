/**
 * Geocoding utilities for converting addresses to coordinates
 */

export interface GeocodingResult {
  lat: number;
  lng: number;
  formattedAddress?: string;
  accuracy?: string;
}

/**
 * Geocode an address using Nominatim (OpenStreetMap) - Free, no API key needed
 * Good for India addresses
 */
export async function geocodeAddress(
  address: string
): Promise<GeocodingResult | null> {
  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1&countrycodes=in`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PG-Finder-App', // Required by Nominatim
      },
    });

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        formattedAddress: result.display_name,
        accuracy: result.class,
      };
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Verify if coordinates are close to expected location
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Batch geocode multiple addresses with rate limiting
 */
export async function batchGeocode(
  addresses: string[],
  delayMs: number = 1000
): Promise<Map<string, GeocodingResult | null>> {
  const results = new Map<string, GeocodingResult | null>();

  for (const address of addresses) {
    const result = await geocodeAddress(address);
    results.set(address, result);

    // Rate limiting - Nominatim allows 1 request per second
    if (addresses.indexOf(address) < addresses.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return results;
}
