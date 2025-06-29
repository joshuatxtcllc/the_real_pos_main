/**
 * Service for accessing Larson-Juhl wholesale pricing data
 */

export interface LarsonJuhlWholesalePrice {
  itemNumber: string;
  width: string;
  boxQty?: number;
  collection: string;
  basePricePerFoot: number;
  boxPrice?: number;
  lengthPrice?: number;
  chopPrice?: number;
  joinPrice?: number;
}

/**
 * Fetches all Larson-Juhl wholesale pricing data
 */
export async function fetchLarsonJuhlWholesalePricing(): Promise<LarsonJuhlWholesalePrice[]> {
  try {
    console.log('Fetching Larson-Juhl wholesale pricing data...');
    const response = await fetch('/api/vendor-catalog/larson/wholesale', {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Error fetching Larson-Juhl wholesale pricing: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Larson-Juhl wholesale pricing:', error);
    return [];
  }
}

/**
 * Fetches all available Larson-Juhl collections
 */
export async function fetchLarsonJuhlCollections(): Promise<string[]> {
  try {
    console.log('Fetching Larson-Juhl collections...');
    const response = await fetch('/api/vendor-catalog/larson/collections', {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Error fetching Larson-Juhl collections: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Larson-Juhl collections:', error);
    return [];
  }
}

/**
 * Fetches Larson-Juhl wholesale pricing for a specific collection
 */
export async function fetchLarsonJuhlWholesalePricingByCollection(
  collection: string
): Promise<LarsonJuhlWholesalePrice[]> {
  try {
    console.log(`Fetching Larson-Juhl wholesale pricing for collection: ${collection}...`);
    const response = await fetch(`/api/vendor-catalog/larson/wholesale/${encodeURIComponent(collection)}`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Error fetching Larson-Juhl wholesale pricing by collection: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Larson-Juhl wholesale pricing by collection:', error);
    return [];
  }
}

/**
 * Helper function to get base wholesale price per foot for a specific Larson-Juhl frame
 * @param larsonItemNumber The Larson-Juhl item number (with or without 'larson-' prefix)
 * @param wholesalePrices Array of wholesale prices (can be cached to avoid refetching)
 * @returns The wholesale price per foot or null if not found
 */
export function getLarsonJuhlBasePricePerFoot(
  larsonItemNumber: string,
  wholesalePrices: LarsonJuhlWholesalePrice[]
): number | null {
  // Normalize item number by removing "larson-" prefix if present
  const itemNumber = larsonItemNumber.startsWith('larson-') 
    ? larsonItemNumber.substring(7) 
    : larsonItemNumber;

  const priceData = wholesalePrices.find(price => price.itemNumber === itemNumber);

  return priceData ? priceData.basePricePerFoot : null;
}

export const fetchCrescentMatboards = async (): Promise<MatboardColor[]> => {
  try {
    console.log('Fetching Crescent matboards from Larson Juhl catalog...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch('/api/larson-juhl/crescent-matboards', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log('No Crescent matboards found in Larson Juhl catalog or empty response. Using static fallback data.');
      return getStaticMatboards();
    }

    console.log(`Successfully loaded ${data.length} Crescent matboards from API`);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Crescent matboards request timed out');
      } else {
        console.error('Error fetching Crescent matboards:', error.message);
      }
    } else {
      console.error('Unknown error fetching Crescent matboards:', error);
    }
    console.log('Loading static matboard data to prevent application freezing...');
    return getStaticMatboards();
  }
};