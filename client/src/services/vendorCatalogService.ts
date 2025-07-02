import { apiRequest } from '@/lib/queryClient';
import { Frame } from '@shared/schema';

/**
 * Fetches all frames from the Larson-Juhl vendor catalog
 * @returns Promise with Larson-Juhl frames
 */
export async function fetchLarsonJuhlFrames(): Promise<Frame[]> {
  try {
    const response = await apiRequest('GET', '/api/vendor-api/frames/larson');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Larson frames: ${response.status}`);
    }
    
    const vendorFrames = await response.json();
    
    // Transform VendorFrame to Frame format
    return Array.isArray(vendorFrames) ? vendorFrames.map(frame => ({
      id: frame.id,
      name: frame.name,
      manufacturer: frame.vendor,
      material: frame.material,
      width: frame.width,
      depth: frame.depth,
      price: frame.price,
      catalogImage: frame.imageUrl || '',
      color: frame.color,
      edgeTexture: '',
      corner: ''
    })) : [];
  } catch (error) {
    console.error('Error fetching Larson-Juhl frames:', error);
    return [];
  }
}

/**
 * Fetches all frames from the Nielsen vendor catalog
 * @returns Promise with Nielsen frames
 */
export async function fetchNielsenFrames(): Promise<Frame[]> {
  try {
    const response = await apiRequest('GET', '/api/vendor-api/frames/bella');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Nielsen frames: ${response.status}`);
    }
    
    const vendorFrames = await response.json();
    
    return Array.isArray(vendorFrames) ? vendorFrames.map(frame => ({
      id: frame.id,
      name: frame.name,
      manufacturer: frame.vendor,
      material: frame.material,
      width: frame.width,
      depth: frame.depth,
      price: frame.price,
      catalogImage: frame.imageUrl || '',
      color: frame.color,
      edgeTexture: '',
      corner: ''
    })) : [];
  } catch (error) {
    console.error('Error fetching Nielsen frames:', error);
    return [];
  }
}

/**
 * Fetches all frames from the Roma vendor catalog
 * @returns Promise with Roma frames
 */
export async function fetchRomaFrames(): Promise<Frame[]> {
  try {
    const response = await apiRequest('GET', '/api/vendor-api/frames/roma');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Roma frames: ${response.status}`);
    }
    
    const vendorFrames = await response.json();
    
    return Array.isArray(vendorFrames) ? vendorFrames.map(frame => ({
      id: frame.id,
      name: frame.name,
      manufacturer: frame.vendor,
      material: frame.material,
      width: frame.width,
      depth: frame.depth,
      price: frame.price,
      catalogImage: frame.imageUrl || '',
      color: frame.color,
      edgeTexture: '',
      corner: ''
    })) : [];
  } catch (error) {
    console.error('Error fetching Roma frames:', error);
    return [];
  }
}

/**
 * Fetches all frames from all vendor catalogs
 * @returns Promise with combined vendor frames
 */
export async function fetchAllVendorFrames(): Promise<Frame[]> {
  try {
    const response = await apiRequest('GET', '/api/vendor-catalog/all');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch vendor frames: ${response.status}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching all vendor frames:', error);
    throw error;
  }
}

/**
 * Searches for frames by item number across all vendor catalogs
 * @param itemNumber The frame item number to search for
 * @returns Promise with matching frames
 */
export async function searchFramesByItemNumber(itemNumber: string): Promise<Frame[]> {
  try {
    const response = await apiRequest('GET', `/api/vendor-catalog/search/${itemNumber}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`No frames found for item number: ${itemNumber}`);
        return [];
      }
      throw new Error(`Search failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error searching for frames with item number ${itemNumber}:`, error);
    throw new Error(`Failed to search for frames: ${error.message}`);
  }
}

/**
 * Syncs all frames from vendor catalogs to the database
 * @returns Promise with sync status message
 */
export async function syncFramesWithDatabase(): Promise<{ message: string }> {
  try {
    const response = await apiRequest('POST', '/api/vendor-catalog/sync');
    return await response.json();
  } catch (error) {
    console.error('Error syncing frames with database:', error);
    throw error;
  }
}