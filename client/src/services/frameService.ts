import { Frame } from '@shared/schema';

export interface FrameApiData {
  id: string;
  name: string;
  manufacturer: string;
  material: string;
  width: string;
  depth: string;
  price: string;
  catalog_image: string;
  edge_texture?: string;
  corner?: string;
}

/**
 * Fetches all frames from the catalog API
 * @returns Promise with the frame data
 */
export async function fetchFrameCatalog(): Promise<Frame[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch('/api/frames', {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data.frames) ? data.frames : [];
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('Frame fetch timeout - using fallback data');
    } else {
      console.error('Error fetching frames:', error?.message || error);
    }

    // Return static fallback data to prevent app crashes
    return [
      {
        id: 'fallback-1',
        name: 'Basic Black Frame',
        color: '#000000',
        width: 1.5,
        material: 'Wood',
        price: 25.00,
        image: '/images/black-frame.jpg',
        description: 'Classic black wood frame'
      }
    ];
  }
}

/**
 * Fetches frames from a specific manufacturer
 * @param manufacturer The manufacturer to filter by
 * @returns Promise with the frame data for that manufacturer
 */
export async function fetchFramesByManufacturer(manufacturer: string): Promise<Frame[]> {
  try {
    const response = await fetch(`/api/frames/manufacturer/${manufacturer}`);

    if (!response.ok) {
      throw new Error(`Error fetching frames by manufacturer: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error in fetchFramesByManufacturer(${manufacturer}):`, error);
    throw error;
  }
}

/**
 * Fetches a frame by ID
 * @param id The frame ID
 * @returns Promise with the frame data
 */
export async function fetchFrameById(id: string): Promise<Frame> {
  try {
    const response = await fetch(`/api/frames/${id}`);

    if (!response.ok) {
      throw new Error(`Error fetching frame by ID: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error in fetchFrameById(${id}):`, error);
    throw error;
  }
}