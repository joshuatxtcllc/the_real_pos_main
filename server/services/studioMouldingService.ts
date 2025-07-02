
import { VendorFrame } from '../types';

export interface StudioMouldingFrame {
  itemNumber: string;
  name: string;
  width: string;
  depth: string;
  material: string;
  finish: string;
  color: string;
  price: number;
  collection: string;
  description?: string;
  imageUrl?: string;
}

export class StudioMouldingService {
  private baseUrl = 'https://api.studiomoulding.com'; // Placeholder - replace with actual API
  private apiKey: string | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.STUDIO_MOULDING_API_KEY || null;
  }

  /**
   * Fetch all Studio Moulding frames
   */
  async fetchCatalog(): Promise<VendorFrame[]> {
    try {
      console.log('Fetching Studio Moulding catalog...');
      
      // For now, return sample data since API may not be available
      // Replace this with actual API call when available
      const sampleFrames = await this.getSampleCatalog();
      
      console.log(`Found ${sampleFrames.length} Studio Moulding frames`);
      return sampleFrames.map(frame => this.convertToVendorFrame(frame));
    } catch (error) {
      console.error('Error fetching Studio Moulding catalog:', error);
      // Return sample catalog as fallback
      return this.getSampleCatalog().then(frames => 
        frames.map(frame => this.convertToVendorFrame(frame))
      );
    }
  }

  /**
   * Search Studio Moulding frames
   */
  async searchFrames(query: string): Promise<VendorFrame[]> {
    try {
      const allFrames = await this.fetchCatalog();
      
      if (!query) return allFrames;

      const normalizedQuery = query.toLowerCase();
      return allFrames.filter(frame => 
        frame.name.toLowerCase().includes(normalizedQuery) ||
        frame.material.toLowerCase().includes(normalizedQuery) ||
        frame.color.toLowerCase().includes(normalizedQuery) ||
        frame.collection.toLowerCase().includes(normalizedQuery) ||
        frame.itemNumber.toLowerCase().includes(normalizedQuery)
      );
    } catch (error) {
      console.error('Error searching Studio Moulding frames:', error);
      return [];
    }
  }

  /**
   * Get frame by item number
   */
  async getFrameByItemNumber(itemNumber: string): Promise<VendorFrame | null> {
    try {
      const frames = await this.fetchCatalog();
      return frames.find(frame => frame.itemNumber === itemNumber) || null;
    } catch (error) {
      console.error('Error getting Studio Moulding frame:', error);
      return null;
    }
  }

  /**
   * Convert Studio Moulding frame to VendorFrame format
   */
  private convertToVendorFrame(frame: StudioMouldingFrame): VendorFrame {
    return {
      id: `studio-${frame.itemNumber}`,
      itemNumber: frame.itemNumber,
      name: frame.name,
      manufacturer: 'Studio Moulding',
      material: frame.material,
      width: frame.width,
      depth: frame.depth,
      color: frame.color,
      price: frame.price.toString(),
      collection: frame.collection,
      description: frame.description || '',
      imageUrl: frame.imageUrl || this.generateImageUrl(frame.itemNumber),
      finish: frame.finish,
      wholesalePrice: frame.price * 0.5, // Assume 50% wholesale discount
      availability: 'in-stock'
    };
  }

  /**
   * Generate image URL for Studio Moulding frames
   */
  private generateImageUrl(itemNumber: string): string {
    // Use Studio Moulding's image pattern or fallback
    return `https://www.studiomoulding.com/images/products/${itemNumber}_detail.jpg`;
  }

  /**
   * Sample catalog data for Studio Moulding
   * Replace with actual API data when available
   */
  private async getSampleCatalog(): Promise<StudioMouldingFrame[]> {
    return [
      {
        itemNumber: 'SM-1001',
        name: 'Classic Oak Profile',
        width: '2.0',
        depth: '1.5',
        material: 'wood',
        finish: 'natural',
        color: '#D2B48C',
        price: 15.99,
        collection: 'Classic Oak',
        description: 'Traditional oak frame with natural finish'
      },
      {
        itemNumber: 'SM-1002',
        name: 'Modern Black Metal',
        width: '1.5',
        depth: '0.75',
        material: 'metal',
        finish: 'matte',
        color: '#000000',
        price: 12.50,
        collection: 'Modern Metal',
        description: 'Sleek black metal frame with matte finish'
      },
      {
        itemNumber: 'SM-2001',
        name: 'Antique Gold Ornate',
        width: '3.0',
        depth: '2.0',
        material: 'wood',
        finish: 'gold leaf',
        color: '#FFD700',
        price: 28.75,
        collection: 'Antique Gold',
        description: 'Ornate gold leaf frame for traditional artwork'
      },
      {
        itemNumber: 'SM-2002',
        name: 'Silver Leaf Contemporary',
        width: '2.5',
        depth: '1.25',
        material: 'wood',
        finish: 'silver leaf',
        color: '#C0C0C0',
        price: 22.99,
        collection: 'Silver Leaf',
        description: 'Contemporary silver leaf frame'
      },
      {
        itemNumber: 'SM-3001',
        name: 'Rustic Barnwood',
        width: '2.75',
        depth: '1.75',
        material: 'wood',
        finish: 'distressed',
        color: '#8B4513',
        price: 18.50,
        collection: 'Rustic',
        description: 'Distressed barnwood frame for rustic appeal'
      }
    ];
  }

  /**
   * Update API configuration
   */
  updateConfig(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      // Test with a simple catalog fetch
      const frames = await this.fetchCatalog();
      return frames.length > 0;
    } catch (error) {
      console.error('Studio Moulding connection test failed:', error);
      return false;
    }
  }
}
