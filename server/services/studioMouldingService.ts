
import { VendorFrame } from '../types';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';

export interface StudioMouldingFrame {
  itemNumber: string;
  description: string;
  lengthPrice: number;
  straightCutPrice: number;
  chopPrice: number;
  joinPrice: number;
  boxPrice: number;
  boxQty: number;
  width: string;
  height: string;
  rabbet: string;
  catPage: string;
  collection?: string;
  material?: string;
  finish?: string;
  color?: string;
}

export interface StudioMouldingPricingOptions {
  method: 'length' | 'straight_cut' | 'chop' | 'join' | 'box';
  pricePerFoot: number;
  description: string;
  minimumOrder?: number;
  boxQuantity?: number;
}

export class StudioMouldingService {
  private baseUrl = 'https://api.studiomoulding.com';
  private apiKey: string | null = null;
  private catalogPath = './data/studio-moulding-catalog.csv';
  private catalogData: StudioMouldingFrame[] = [];

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.STUDIO_MOULDING_API_KEY || null;
    this.loadCatalogFromFile();
  }

  /**
   * Load catalog from CSV file
   */
  private async loadCatalogFromFile(): Promise<void> {
    try {
      if (!fs.existsSync(this.catalogPath)) {
        console.log('Studio Moulding catalog file not found, using sample data');
        this.catalogData = await this.getSampleCatalog();
        return;
      }

      const frames: StudioMouldingFrame[] = [];
      
      return new Promise((resolve, reject) => {
        fs.createReadStream(this.catalogPath)
          .pipe(csv())
          .on('data', (row: any) => {
            try {
              const frame: StudioMouldingFrame = {
                itemNumber: row.Item_Number || row.itemNumber,
                description: row.Description || row.description,
                lengthPrice: parseFloat(row.Length_Price || row.lengthPrice || '0'),
                straightCutPrice: parseFloat(row.Straight_Cut_Price || row.straightCutPrice || '0'),
                chopPrice: parseFloat(row.Chop_Price || row.chopPrice || '0'),
                joinPrice: parseFloat(row.Join_Price || row.joinPrice || '0'),
                boxPrice: parseFloat(row.Box_Price || row.boxPrice || '0'),
                boxQty: parseInt(row.Box_Qty || row.boxQty || '0'),
                width: row.Width || row.width || '1.0',
                height: row.Height || row.height || '1.0',
                rabbet: row.Rabbet_H || row.rabbet || '0.5',
                catPage: row.Cat_Page || row.catPage || 'A-01',
                collection: this.extractCollection(row.Description || ''),
                material: this.determineMaterial(row.Description || ''),
                finish: this.extractFinish(row.Description || ''),
                color: this.extractColor(row.Description || '')
              };
              frames.push(frame);
            } catch (error) {
              console.warn('Error parsing row:', error);
            }
          })
          .on('end', () => {
            this.catalogData = frames;
            console.log(`Loaded ${frames.length} Studio Moulding frames from file`);
            resolve();
          })
          .on('error', reject);
      });
    } catch (error) {
      console.error('Error loading Studio Moulding catalog:', error);
      this.catalogData = await this.getSampleCatalog();
    }
  }

  /**
   * Extract collection name from description
   */
  private extractCollection(description: string): string {
    const collections = [
      'B&B', 'MADERA', 'ETUDE', 'ADAGIO', 'FORTE', 'LEGATO', 'HONORS', 
      'KOTA', 'CHALET', 'ASH', 'SIERRA', 'HARMONY', 'BEECH', 'OLEA', 
      'PLUME', "D'ORME", 'LYRA', 'AVANT', 'DUNE', 'WILLOW', 'ETHOS', 
      'ELAN', 'NUANCE', 'GROVE', 'MILAN'
    ];
    
    const upperDesc = description.toUpperCase();
    for (const collection of collections) {
      if (upperDesc.includes(collection)) {
        return collection;
      }
    }
    return 'Studio Moulding';
  }

  /**
   * Determine material from description
   */
  private determineMaterial(description: string): string {
    const upperDesc = description.toUpperCase();
    if (upperDesc.includes('VENEER') || upperDesc.includes('MAPLE') || upperDesc.includes('ASH') || upperDesc.includes('BEECH')) {
      return 'wood';
    }
    if (upperDesc.includes('METAL') || upperDesc.includes('ALUMINUM')) {
      return 'metal';
    }
    return 'wood'; // Default assumption
  }

  /**
   * Extract finish from description
   */
  private extractFinish(description: string): string {
    const upperDesc = description.toUpperCase();
    if (upperDesc.includes('GLOSS')) return 'gloss';
    if (upperDesc.includes('MATT') || upperDesc.includes('MATTE')) return 'matte';
    if (upperDesc.includes('STAIN')) return 'stained';
    if (upperDesc.includes('WHITEWASH')) return 'whitewash';
    if (upperDesc.includes('FLOATER')) return 'float';
    return 'natural';
  }

  /**
   * Extract color from description
   */
  private extractColor(description: string): string {
    const colorMap: { [key: string]: string } = {
      'SABLE BROWN': '#8B4513',
      'COFFEE': '#6F4E37',
      'PECAN': '#C8860D',
      'HONEY': '#FFB347',
      'WALNUT': '#8B4513',
      'CHERRY': '#722F37',
      'NATURAL': '#DEB887',
      'CLEAR': '#F5F5DC',
      'BLACK': '#000000',
      'GRAY': '#808080',
      'GREY': '#808080',
      'MAHOGANY': '#C04000',
      'WHITE': '#FFFFFF',
      'WHITEWASH': '#F8F8FF',
      'GOLD': '#FFD700',
      'DARK BROWN': '#654321',
      'LIGHT WALNUT': '#D2B48C',
      'BUFF': '#F0DC82',
      'BEIGE': '#F5F5DC',
      'SAND': '#C2B280',
      'KHAKI': '#F0E68C',
      'BARK': '#8B4513',
      'TAUPE': '#483C32',
      'IVORY': '#FFFFF0',
      'EBONY': '#555D50',
      'CHARCOAL': '#36454F',
      'WENGE': '#645452'
    };

    const upperDesc = description.toUpperCase();
    for (const [colorName, hexValue] of Object.entries(colorMap)) {
      if (upperDesc.includes(colorName)) {
        return hexValue;
      }
    }
    return '#DEB887'; // Default beige/natural
  }

  /**
   * Get all pricing options for a frame
   */
  getPricingOptions(frame: StudioMouldingFrame): StudioMouldingPricingOptions[] {
    const options: StudioMouldingPricingOptions[] = [];

    if (frame.lengthPrice > 0) {
      options.push({
        method: 'length',
        pricePerFoot: frame.lengthPrice,
        description: 'Full length pricing (standard 8-foot sticks)'
      });
    }

    if (frame.straightCutPrice > 0) {
      options.push({
        method: 'straight_cut',
        pricePerFoot: frame.straightCutPrice,
        description: 'Straight cut to length'
      });
    }

    if (frame.chopPrice > 0) {
      options.push({
        method: 'chop',
        pricePerFoot: frame.chopPrice,
        description: 'Chopped to exact length'
      });
    }

    if (frame.joinPrice > 0) {
      options.push({
        method: 'join',
        pricePerFoot: frame.joinPrice,
        description: 'Joined corners (complete frame)'
      });
    }

    if (frame.boxPrice > 0 && frame.boxQty > 0) {
      options.push({
        method: 'box',
        pricePerFoot: frame.boxPrice,
        description: `Box pricing (${frame.boxQty} feet per box)`,
        boxQuantity: frame.boxQty
      });
    }

    return options;
  }

  /**
   * Calculate best pricing option for given footage
   */
  calculateOptimalPricing(itemNumber: string, footageNeeded: number): {
    frame: StudioMouldingFrame | null;
    options: Array<{
      method: string;
      totalCost: number;
      pricePerFoot: number;
      description: string;
      savings?: number;
    }>;
    recommendation: {
      method: string;
      totalCost: number;
      savings: number;
      reason: string;
    };
  } {
    const frame = this.catalogData.find(f => f.itemNumber === itemNumber);
    if (!frame) {
      return {
        frame: null,
        options: [],
        recommendation: { method: '', totalCost: 0, savings: 0, reason: 'Frame not found' }
      };
    }

    const pricingOptions = this.getPricingOptions(frame);
    const calculatedOptions = pricingOptions.map(option => {
      let totalCost = 0;
      let description = option.description;

      switch (option.method) {
        case 'length':
          // Assume 8-foot sticks, calculate waste
          const sticksNeeded = Math.ceil(footageNeeded / 8);
          totalCost = sticksNeeded * 8 * option.pricePerFoot;
          const waste = (sticksNeeded * 8) - footageNeeded;
          description += ` (${sticksNeeded} sticks, ${waste.toFixed(1)}' waste)`;
          break;
        
        case 'box':
          if (option.boxQuantity) {
            const boxesNeeded = Math.ceil(footageNeeded / option.boxQuantity);
            totalCost = boxesNeeded * option.boxQuantity * option.pricePerFoot;
            description += ` (${boxesNeeded} boxes)`;
          }
          break;
        
        default:
          totalCost = footageNeeded * option.pricePerFoot;
          break;
      }

      return {
        method: option.method,
        totalCost,
        pricePerFoot: option.pricePerFoot,
        description
      };
    });

    // Find best option
    const bestOption = calculatedOptions.reduce((best, current) => 
      current.totalCost < best.totalCost ? current : best
    );

    const worstOption = calculatedOptions.reduce((worst, current) => 
      current.totalCost > worst.totalCost ? current : worst
    );

    const savings = worstOption.totalCost - bestOption.totalCost;

    // Add savings to each option
    const optionsWithSavings = calculatedOptions.map(option => ({
      ...option,
      savings: option.totalCost - bestOption.totalCost
    }));

    let reason = '';
    switch (bestOption.method) {
      case 'length':
        reason = 'Full sticks provide best value despite potential waste';
        break;
      case 'chop':
        reason = 'Chopped pricing eliminates waste for exact footage';
        break;
      case 'straight_cut':
        reason = 'Straight cut offers good balance of cost and convenience';
        break;
      case 'join':
        reason = 'Joined corners save labor costs for complete frames';
        break;
      case 'box':
        reason = 'Box pricing offers volume discount';
        break;
    }

    return {
      frame,
      options: optionsWithSavings,
      recommendation: {
        method: bestOption.method,
        totalCost: bestOption.totalCost,
        savings,
        reason
      }
    };
  }

  /**
   * Fetch all Studio Moulding frames
   */
  async fetchCatalog(): Promise<VendorFrame[]> {
    try {
      console.log('Fetching Studio Moulding catalog...');
      
      if (this.catalogData.length === 0) {
        await this.loadCatalogFromFile();
      }

      console.log(`Found ${this.catalogData.length} Studio Moulding frames`);
      return this.catalogData.map(frame => this.convertToVendorFrame(frame));
    } catch (error) {
      console.error('Error fetching Studio Moulding catalog:', error);
      const sampleFrames = await this.getSampleCatalog();
      return sampleFrames.map(frame => this.convertToVendorFrame(frame));
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
   * Get frame by item number with pricing options
   */
  async getFrameByItemNumber(itemNumber: string): Promise<{
    frame: VendorFrame | null;
    pricingOptions: StudioMouldingPricingOptions[];
  }> {
    try {
      const studioFrame = this.catalogData.find(f => f.itemNumber === itemNumber);
      if (!studioFrame) {
        return { frame: null, pricingOptions: [] };
      }

      return {
        frame: this.convertToVendorFrame(studioFrame),
        pricingOptions: this.getPricingOptions(studioFrame)
      };
    } catch (error) {
      console.error('Error getting Studio Moulding frame:', error);
      return { frame: null, pricingOptions: [] };
    }
  }

  /**
   * Convert Studio Moulding frame to VendorFrame format
   */
  private convertToVendorFrame(frame: StudioMouldingFrame): VendorFrame {
    return {
      id: `studio-${frame.itemNumber}`,
      itemNumber: frame.itemNumber,
      name: frame.description,
      manufacturer: 'Studio Moulding',
      material: frame.material || 'wood',
      width: frame.width,
      depth: frame.height,
      color: frame.color || '#DEB887',
      price: frame.lengthPrice.toString(), // Default to length price
      collection: frame.collection || 'Studio Moulding',
      description: frame.description,
      imageUrl: this.generateImageUrl(frame.itemNumber),
      finish: frame.finish || 'natural',
      wholesalePrice: frame.lengthPrice * 0.8, // Assume 20% markup
      availability: 'in-stock'
    };
  }

  /**
   * Generate image URL for Studio Moulding frames
   */
  private generateImageUrl(itemNumber: string): string {
    return `https://www.studiomoulding.com/images/products/${itemNumber}_detail.jpg`;
  }

  /**
   * Sample catalog data for Studio Moulding (fallback)
   */
  private async getSampleCatalog(): Promise<StudioMouldingFrame[]> {
    return [
      {
        itemNumber: '1420',
        description: 'B&B SABLE BROWN',
        lengthPrice: 9.22,
        straightCutPrice: 11.74,
        chopPrice: 14.25,
        joinPrice: 17.06,
        boxPrice: 5.07,
        boxQty: 95,
        width: '3',
        height: '1 7/16',
        rabbet: '1/2',
        catPage: 'A-55',
        collection: 'B&B',
        material: 'wood',
        finish: 'stained',
        color: '#8B4513'
      },
      {
        itemNumber: '3020',
        description: 'MADERA COFFEE BROWN',
        lengthPrice: 2.30,
        straightCutPrice: 3.47,
        chopPrice: 4.64,
        joinPrice: 6.29,
        boxPrice: 1.27,
        boxQty: 475,
        width: '3/4',
        height: '3/4',
        rabbet: '1/2',
        catPage: 'A-43',
        collection: 'MADERA',
        material: 'wood',
        finish: 'stained',
        color: '#6F4E37'
      }
    ];
  }

  /**
   * Save catalog data to CSV file
   */
  async saveCatalogToFile(catalogData: StudioMouldingFrame[]): Promise<void> {
    try {
      const headers = [
        'Item_Number', 'Description', 'Length_Price', 'Straight_Cut_Price',
        'Chop_Price', 'Join_Price', 'Box_Price', 'Box_Qty',
        'Width', 'Height', 'Rabbet_H', 'Cat_Page'
      ];

      const csvContent = [
        headers.join(','),
        ...catalogData.map(frame => [
          frame.itemNumber,
          `"${frame.description}"`,
          frame.lengthPrice,
          frame.straightCutPrice,
          frame.chopPrice,
          frame.joinPrice,
          frame.boxPrice,
          frame.boxQty,
          `"${frame.width}"`,
          `"${frame.height}"`,
          `"${frame.rabbet}"`,
          frame.catPage
        ].join(','))
      ].join('\n');

      // Ensure data directory exists
      const dataDir = path.dirname(this.catalogPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      fs.writeFileSync(this.catalogPath, csvContent);
      console.log(`Saved ${catalogData.length} Studio Moulding frames to ${this.catalogPath}`);
    } catch (error) {
      console.error('Error saving catalog:', error);
    }
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
      const frames = await this.fetchCatalog();
      return frames.length > 0;
    } catch (error) {
      console.error('Studio Moulding connection test failed:', error);
      return false;
    }
  }
}

export const studioMouldingService = new StudioMouldingService();
