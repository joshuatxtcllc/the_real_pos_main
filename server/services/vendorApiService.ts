import axios from 'axios';
import { storage } from '../storage';
import { StudioMouldingService } from './studioMouldingService';

/**
 * VendorApiService
 * 
 * Connects to real vendor APIs to retrieve complete frame catalogs
 * and accurate wholesale pricing for Larson Juhl, Roma Moulding, and Bella Moulding
 */

// Define frame catalog interfaces
export interface VendorFrame {
  id: string;
  itemNumber: string;
  name: string;
  price: string;  // Wholesale price per foot
  material: string;
  color: string;
  width: string;
  height: string;
  depth: string;
  collection: string;
  description?: string;
  imageUrl?: string;
  inStock?: boolean;
  vendor: string;
}

// API configuration interfaces
interface VendorApiConfig {
  baseUrl: string;
  apiKey: string;
  apiSecret?: string;
}

// API response interfaces
interface LarsonApiResponse {
  frames: Array<{
    item_number: string;
    name: string;
    collection: string;
    material: string;
    color: string;
    width: number;
    height: number;
    depth: number;
    price_per_foot: number;
    description: string;
    image_url: string;
    in_stock: boolean;
  }>;
}

interface RomaApiResponse {
  mouldings: Array<{
    sku: string;
    name: string;
    collection: string;
    material: string;
    finish: string;
    dimensions: {
      width: number;
      height: number;
      depth: number;
    };
    wholesale_price: number;
    description: string;
    image: string;
    availability: string;
  }>;
}

interface BellaApiResponse {
  items: Array<{
    item_code: string;
    title: string;
    collection_name: string;
    material_type: string;
    color: string;
    measurements: {
      width_mm: number;
      height_mm: number;
      depth_mm: number;
    };
    price: {
      wholesale: number;
      currency: string;
    };
    description: string;
    image_urls: string[];
    inventory_status: string;
  }>;
}

/**
 * Vendor API Service for direct connections to frame suppliers
 */
class VendorApiService {
  private larsonConfig: VendorApiConfig;
  private romaConfig: VendorApiConfig;
  private bellaConfig: VendorApiConfig;
  private studioMouldingConfig = {
    apiKey: process.env.STUDIO_MOULDING_API_KEY || ''
  };

  constructor() {
    // Initialize vendor services when credentials are available
    this.initializeServices();
  }

  private studioMouldingService?: StudioMouldingService;

  private initializeServices() {
    // Initialize Studio Moulding service
    if (this.studioMouldingConfig.apiKey) {
      this.studioMouldingService = new StudioMouldingService(this.studioMouldingConfig.apiKey);
    }
    console.log('VendorApiService initialized');
  }

  /**
   * Fetches frames from Larson-Juhl's catalog
   * Uses real pricing data from imported price list document
   */
  async fetchLarsonCatalog(): Promise<VendorFrame[]> {
    try {
      console.log('Fetching Larson-Juhl catalog from database...');

      // Get Larson frames from database (imported from price list)
      const larsonFrames = await this.getLarsonFramesFromDatabase();

      if (larsonFrames.length > 0) {
        return larsonFrames;
      }

      // If no frames in database, try API connection
      try {
        const response = await this.connectToLarsonApi();

        if (response && response.frames) {
          return response.frames.map(frame => ({
            id: `larson-${frame.item_number}`,
            itemNumber: frame.item_number,
            name: frame.name,
            price: frame.price_per_foot.toString(),
            material: frame.material,
            color: frame.color,
            width: frame.width.toString(),
            height: frame.height.toString(),
            depth: frame.depth.toString(),
            collection: frame.collection,
            description: frame.description,
            imageUrl: frame.image_url,
            inStock: frame.in_stock,
            vendor: 'Larson Juhl'
          }));
        }
      } catch (apiError) {
        console.error('API connection failed, using database fallback:', apiError);
      }

      throw new Error('No Larson-Juhl frames available in database or API');
    } catch (error) {
      console.error('Error fetching Larson catalog:', error);
      return [];
    }
  }

  /**
   * Gets Larson-Juhl frames from database
   */
  private async getLarsonFramesFromDatabase(): Promise<VendorFrame[]> {
    try {
      const result = await storage.query(`
        SELECT * FROM frames 
        WHERE manufacturer = 'Larson-Juhl' 
        ORDER BY name
      `);

      return result.rows.map(frame => ({
        id: frame.id,
        itemNumber: frame.id.replace('larson-', ''),
        name: frame.name,
        price: frame.price,
        material: frame.material || 'Wood',
        color: frame.color || 'Natural',
        width: frame.width || '1.5',
        height: frame.width || '1.5', // Use width as height for moulding
        depth: frame.depth || '0.75',
        collection: frame.collection || 'Standard',
        description: frame.description || frame.name,
        imageUrl: frame.catalog_image || '',
        inStock: true,
        vendor: 'Larson Juhl'
      }));
    } catch (error) {
      console.error('Error fetching Larson frames from database:', error);
      return [];
    }
  }

  /**
   * Fetch complete catalog from Roma Moulding
   */
  async fetchRomaCatalog(): Promise<VendorFrame[]> {
    if (!this.romaConfig.apiKey) {
      throw new Error('Roma API key not configured. Please configure API credentials in vendor settings.');
    }

    try {
      const response = await axios.get<RomaApiResponse>(
        `${this.romaConfig.baseUrl}/catalog/mouldings`,
        {
          headers: {
            'X-Api-Key': this.romaConfig.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      // Transform API response to our internal format
      return response.data.mouldings.map(moulding => ({
        id: `roma-${moulding.sku}`,
        itemNumber: moulding.sku,
        name: `${moulding.name} (${moulding.collection})`,
        price: moulding.wholesale_price.toString(),
        material: moulding.material,
        color: moulding.finish,
        width: moulding.dimensions.width.toString(),
        height: moulding.dimensions.height.toString(),
        depth: moulding.dimensions.depth.toString(),
        collection: moulding.collection,
        description: moulding.description,
        imageUrl: moulding.image,
        inStock: moulding.availability === 'in_stock',
        vendor: 'Roma Moulding'
      }));
    } catch (error) {
      console.error('Error fetching Roma catalog:', error);
      throw new Error(`Failed to fetch Roma catalog: ${error.message}`);
    }
  }

  /**
   * Fetch complete catalog from Bella Moulding
   */
  async fetchBellaCatalog(): Promise<VendorFrame[]> {
    if (!this.bellaConfig.apiKey) {
      throw new Error('Bella API key not configured. Please configure API credentials in vendor settings.');
    }

    try {
      const response = await axios.get<BellaApiResponse>(
        `${this.bellaConfig.baseUrl}/products`,
        {
          headers: {
            'X-API-Key': this.bellaConfig.apiKey,
            'X-API-Secret': this.bellaConfig.apiSecret || '',
            'Content-Type': 'application/json'
          }
        }
      );

      // Transform API response to our internal format
      return response.data.items.map(item => ({
        id: `bella-${item.item_code}`,
        itemNumber: item.item_code,
        name: `${item.title} (${item.collection_name})`,
        price: item.price.wholesale.toString(),
        material: item.material_type,
        color: item.color,
        width: (item.measurements.width_mm / 25.4).toFixed(2), // Convert mm to inches
        height: (item.measurements.height_mm / 25.4).toFixed(2),
        depth: (item.measurements.depth_mm / 25.4).toFixed(2),
        collection: item.collection_name,
        description: item.description,
        imageUrl: item.image_urls[0],
        inStock: item.inventory_status === 'available',
        vendor: 'Bella Moulding'
      }));
    } catch (error) {
      console.error('Error fetching Bella catalog:', error);
      throw new Error(`Failed to fetch Bella catalog: ${error.message}`);
    }
  }

  /**
   * Fetch all catalogs from all vendors
   */
  async fetchAllCatalogs(): Promise<VendorFrame[]> {
    const allFrames: VendorFrame[] = [];

    try {
      // Fetch from all available vendors
      const [larsonFrames, romaFrames, bellaFrames, studioFrames] = await Promise.allSettled([
        this.fetchLarsonCatalog(),
        this.fetchRomaCatalog(),
        this.fetchBellaCatalog(),
        this.fetchStudioMouldingCatalog()
      ]);

      if (larsonFrames.status === 'fulfilled') {
        allFrames.push(...larsonFrames.value);
        console.log(`Added ${larsonFrames.value.length} Larson Juhl frames`);
      }

      if (romaFrames.status === 'fulfilled') {
        allFrames.push(...romaFrames.value);
        console.log(`Added ${romaFrames.value.length} Roma Moulding frames`);
      }

      if (bellaFrames.status === 'fulfilled') {
        allFrames.push(...bellaFrames.value);
        console.log(`Added ${bellaFrames.value.length} Bella Moulding frames`);
      }

      if (studioFrames.status === 'fulfilled') {
        allFrames.push(...studioFrames.value);
        console.log(`Added ${studioFrames.value.length} Studio Moulding frames`);
      }

    } catch (error) {
      console.error('Failed to fetch all catalogs:', error);
    }

    return allFrames;
  }

  /**
   * Search across all vendor catalogs for frames matching criteria
   * @param query Search query for name, material, or collection
   * @param vendor Optional vendor filter
   */
  async searchFrames(query: string, vendor?: string): Promise<VendorFrame[]> {
    console.log(`Searching for: "${query}" across vendor APIs`);

    let allFrames: VendorFrame[] = [];

    // First try regular API calls
    try {
      if (vendor) {
        switch (vendor.toLowerCase()) {
          case 'larson':
            allFrames = await this.fetchLarsonCatalog();
            break;
          case 'roma':
            allFrames = await this.fetchRomaCatalog();
            break;
          case 'bella':
            allFrames = await this.fetchBellaCatalog();
            break;
          default:
            allFrames = await this.fetchAllCatalogs();
        }
      } else {
        allFrames = await this.fetchAllCatalogs();
      }
    } catch (apiError) {
      console.log('API calls failed, trying fallback scraper:', apiError.message);

      // Use fallback scraper when APIs fail
      const { vendorScraperService } = await import('./vendorScraperService');

      try {
        if (/^[0-9]{5,6}$/.test(query)) {
          // Item number search
          console.log(`Using scraper for item number search: ${query}`);
          allFrames = await vendorScraperService.searchByItemNumber(query);
        } else {
          // General search
          console.log(`Using scraper for general search: ${query}`);
          const [larsonFrames, romaFrames] = await Promise.all([
            vendorScraperService.scrapeLarsonFrames(query),
            vendorScraperService.scrapeRomaFrames(query)
          ]);
          allFrames = [...larsonFrames, ...romaFrames];
        }

        if (allFrames.length > 0) {
          console.log(`Scraper found ${allFrames.length} frames`);
        }
      } catch (scraperError) {
        console.log('Scraper also failed, checking database:', scraperError.message);

        // Final fallback to database search
        try {
          const storage = await import('../storage');
          const exactFrames = await storage.default.searchFramesByItemNumber(query);
          if (exactFrames && exactFrames.length > 0) {
            return exactFrames.map(frame => ({
              id: frame.id,
              itemNumber: frame.id.split('-')[1] || query,
              name: frame.name,
              price: frame.price,
              material: frame.material || 'Wood',
              color: frame.color || 'Natural',
              width: '2.25',
              height: '0.75',
              depth: '1.25',
              collection: 'Standard',
              imageUrl: frame.thumbnailUrl || '',
              inStock: true,
              vendor: 'Larson Juhl'
            }));
          }
        } catch (dbError) {
          console.log('Database search also failed:', dbError.message);
        }
      }
    }

    // Try to fetch from real APIs first, but catch errors gracefully
    try {
      if (vendor) {
        switch (vendor.toLowerCase()) {
          case 'larson':
            allFrames = await this.fetchLarsonCatalog();
            break;
          case 'roma':
            allFrames = await this.fetchRomaCatalog();
            break;
          case 'bella':
            allFrames = await this.fetchBellaCatalog();
            break;
          default:
            allFrames = await this.fetchAllCatalogs();
        }
      } else {
        allFrames = await this.fetchAllCatalogs();
      }
    } catch (error) {
      console.log('API search failed, checking database:', error.message);

      // Fallback to database search
      try {
        const exactFrames = await storage.searchFramesByItemNumber(query);
        if (exactFrames && exactFrames.length > 0) {
          return exactFrames.map(frame => ({
            id: frame.id,
            itemNumber: frame.id.split('-')[1] || query,
            name: frame.name,
            price: frame.price,
            material: frame.material || 'Wood',
            color: frame.color || 'Natural',
            width: '2.25',
            height: '0.75',
            depth: '1.25',
            collection: 'Standard',
            imageUrl: frame.thumbnailUrl || '',
            inStock: true,
            vendor: 'Larson Juhl'
          }));
        }
      } catch (dbError) {
        console.log('Database search also failed:', dbError.message);
      }

      // Return empty array if all searches fail
      return [];
    }

    if (!query) return allFrames;

    const normalizedQuery = query.toLowerCase();
    const results = allFrames.filter(frame => 
      frame.name.toLowerCase().includes(normalizedQuery) ||
      frame.material.toLowerCase().includes(normalizedQuery) ||
      frame.color.toLowerCase().includes(normalizedQuery) ||
      frame.collection.toLowerCase().includes(normalizedQuery) ||
      frame.itemNumber.toLowerCase().includes(normalizedQuery)
    );

    console.log(`Found ${results.length} matches for "${query}"`);
    return results;
  }

  /**
   * Sync all vendor catalogs to database
   * This provides a complete catalog for the POS system
   */
  async syncCatalogsToDatabase(): Promise<{ added: number, updated: number }> {
    try {
      const allFrames = await this.fetchAllCatalogs();
      const existingFrames = await storage.getAllFrames();

      const existingIds = new Set(existingFrames.map(f => f.id));

      // Split frames into new additions and updates
      const framesToAdd = allFrames.filter(f => !existingIds.has(f.id));
      const framesToUpdate = allFrames.filter(f => existingIds.has(f.id));

      // Add new frames
      for (const frame of framesToAdd) {
        await storage.addFrame({
          id: frame.id,
          name: frame.name,
          price: frame.price,
          material: frame.material,
          color: frame.color,
          thumbnailUrl: frame.imageUrl || '',
          description: frame.description || ''
        });
      }

      // Update existing frames
      for (const frame of framesToUpdate) {
        await storage.updateFrame({
          id: frame.id,
          name: frame.name,
          price: frame.price,
          material: frame.material,
          color: frame.color,
          thumbnailUrl: frame.imageUrl || '',
          description: frame.description || ''
        });
      }

      return {
        added: framesToAdd.length,
        updated: framesToUpdate.length
      };
    } catch (error) {
      console.error('Error syncing catalogs to database:', error);
      throw error;
    }
  }

  /**
   * Get current API settings (excluding secrets)
   */
  async getSettings(): Promise<Record<string, string | boolean>> {
    return {
      larsonApiKey: this.larsonConfig.apiKey || '',
      larsonApiSecret: !!this.larsonConfig.apiSecret,

      romaApiKey: this.romaConfig.apiKey || '',
      romaApiSecret: !!this.romaConfig.apiSecret,

      bellaApiKey: this.bellaConfig.apiKey || '',
      bellaApiSecret: !!this.bellaConfig.apiSecret,
    };
  }

  /**
   * Update API settings
   * @param settings New settings
   */
  async updateSettings(settings: Record<string, string>): Promise<void> {
    // Update configuration
    if (settings.larsonApiKey !== undefined) {
      this.larsonConfig.apiKey = settings.larsonApiKey;
      process.env.LARSON_API_KEY = settings.larsonApiKey;
    }

    if (settings.larsonApiSecret !== undefined) {
      this.larsonConfig.apiSecret = settings.larsonApiSecret;
      process.env.LARSON_API_SECRET = settings.larsonApiSecret;
    }

    if (settings.romaApiKey !== undefined) {
      this.romaConfig.apiKey = settings.romaApiKey;
      process.env.ROMA_API_KEY = settings.romaApiKey;
    }

    if (settings.romaApiSecret !== undefined) {
      this.romaConfig.apiSecret = settings.romaApiSecret;
      process.env.ROMA_API_SECRET = settings.romaApiSecret;
    }

    if (settings.bellaApiKey !== undefined) {
      this.bellaConfig.apiKey = settings.bellaApiKey;
      process.env.BELLA_API_KEY = settings.bellaApiKey;
    }

    if (settings.bellaApiSecret !== undefined) {
      this.bellaConfig.apiSecret = settings.bellaApiSecret;
      process.env.BELLA_API_SECRET = settings.bellaApiSecret;
    }

    // In a real application, these settings would be saved to a database or config file
    console.log('API settings updated', { 
      larsonKeyUpdated: !!settings.larsonApiKey,
      larsonSecretUpdated: !!settings.larsonApiSecret,
      romaKeyUpdated: !!settings.romaApiKey,
      romaSecretUpdated: !!settings.romaApiSecret,
      bellaKeyUpdated: !!settings.bellaApiKey,
      bellaSecretUpdated: !!settings.bellaApiSecret
    });
  }

  /**
   * Test connection to Larson Juhl API
   */
  async testLarsonConnection(): Promise<{ success: boolean, message: string }> {
    try {
      if (!this.larsonConfig.apiKey) {
        return { 
          success: false, 
          message: 'API key not configured. Please enter a valid API key.' 
        };
      }

      // Try to fetch a single frame to test the connection
      const testResponse = await axios.get(
        `${this.larsonConfig.baseUrl}/catalog/frames?limit=1`,
        {
          headers: {
            'Authorization': `Bearer ${this.larsonConfig.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (testResponse.status === 200) {
        return { 
          success: true, 
          message: 'Successfully connected to Larson-Juhl API' 
        };
      } else {
        return { 
          success: false, 
          message: `Unexpected response status: ${testResponse.status}` 
        };
      }
    } catch (error: any) {
      console.error('Error testing Larson Juhl connection:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Connection failed' 
      };
    }
  }

  /**
   * Test connection to Roma Moulding API
   */
  async testRomaConnection(): Promise<{ success: boolean, message: string }> {
    try {
      if (!this.romaConfig.apiKey) {
        return { 
          success: false, 
          message: 'API key not configured. Please enter a valid API key.' 
        };
      }

      // Try to fetch a single frame to test the connection
      const testResponse = await axios.get(
        `${this.romaConfig.baseUrl}/catalog/mouldings?limit=1`,
        {
          headers: {
            'X-Api-Key': this.romaConfig.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      if (testResponse.status === 200) {
        return { 
          success: true, 
          message: 'Successfully connected to Roma Moulding API' 
        };
      } else {
        return { 
          success: false, 
          message: `Unexpected response status: ${testResponse.status}` 
        };
      }
    } catch (error: any) {
      console.error('Error testing Roma Moulding connection:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Connection failed' 
      };
    }
  }

  /**
   * Test connection to Bella Moulding API
   */
  async testBellaConnection(): Promise<{ success: boolean, message: string }> {
    try {
      if (!this.bellaConfig.apiKey) {
        return { 
          success: false, 
          message: 'API key not configured. Please enter a valid API key.' 
        };
      }

      // Try to fetch a single product to test the connection
      const testResponse = await axios.get(
        `${this.bellaConfig.baseUrl}/products?limit=1`,
        {
          headers: {
            'X-API-Key': this.bellaConfig.apiKey,
            'X-API-Secret': this.bellaConfig.apiSecret || '',
            'Content-Type': 'application/json'
          }
        }
      );

      if (testResponse.status === 200) {
        return { 
          success: true, 
          message: 'Successfully connected to Bella Moulding API' 
        };
      } else {
        return { 
          success: false, 
          message: `Unexpected response status: ${testResponse.status}` 
        };
      }
    } catch (error: any) {
      console.error('Error testing Bella Moulding connection:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Connection failed' 
      };
    }
  }

  /**
   * Fetch Bella Moulding catalog
   */
  private async fetchBellaMouldingCatalog(): Promise<VendorFrame[]> {
    try {
      console.log('Fetching Bella Moulding catalog...');
      // Placeholder - implement actual Bella Moulding API integration
      return [];
    } catch (error) {
      console.error('Error fetching Bella Moulding catalog:', error);
      return [];
    }
  }

  /**
   * Fetch Studio Moulding catalog
   */
  private async fetchStudioMouldingCatalog(): Promise<VendorFrame[]> {
    try {
      if (!this.studioMouldingService) {
        this.studioMouldingService = new StudioMouldingService();
      }
      return await this.studioMouldingService.fetchCatalog();
    } catch (error) {
      console.error('Error fetching Studio Moulding catalog:', error);
      return [];
    }
  }

  /**
   * Search Larson Juhl frames
   */
  private async searchLarsonJuhlFrames(query: string): Promise<VendorFrame[]> {
    try {
      // Placeholder - implement actual Larson Juhl search
      return [];
    } catch (error) {
      console.error('Error searching Larson Juhl:', error);
      return [];
    }
  }

  /**
   * Search Roma Moulding frames
   */
  private async searchRomaMouldingFrames(query: string): Promise<VendorFrame[]> {
    try {
      // Placeholder - implement actual Roma Moulding search
      return [];
    } catch (error) {
      console.error('Error searching Roma Moulding:', error);
      return [];
    }
  }

  /**
   * Search Bella Moulding frames
   */
  private async searchBellaMouldingFrames(query: string): Promise<VendorFrame[]> {
    try {
      // Placeholder - implement actual Bella Moulding search
      return [];
    } catch (error) {
      console.error('Error searching Bella Moulding:', error);
      return [];
    }
  }

  /**
   * Search Studio Moulding frames
   */
  private async searchStudioMouldingFrames(query: string): Promise<VendorFrame[]> {
    try {
      if (!this.studioMouldingService) {
        this.studioMouldingService = new StudioMouldingService();
      }
      return await this.studioMouldingService.searchFrames(query);
    } catch (error) {
      console.error('Error searching Studio Moulding:', error);
      return [];
    }
  }

  /**
   * Search across all vendor APIs
   * @param query Search query
   */
  async searchAllVendorFrames(query: string): Promise<VendorFrame[]> {
    const allFrames: VendorFrame[] = [];

    try {
      // Search all vendor catalogs
      const [larsonResults, romaResults, bellaResults, studioResults] = await Promise.allSettled([
        this.searchLarsonJuhlFrames(query),
        this.searchRomaMouldingFrames(query),
        this.searchBellaMouldingFrames(query),
        this.searchStudioMouldingFrames(query)
      ]);

      if (larsonResults.status === 'fulfilled') {
        allFrames.push(...larsonResults.value);
      }

      if (romaResults.status === 'fulfilled') {
        allFrames.push(...romaResults.value);
      }

      if (bellaResults.status === 'fulfilled') {
        allFrames.push(...bellaResults.value);
      }

      if (studioResults.status === 'fulfilled') {
        allFrames.push(...studioResults.value);
      }

    } catch (error) {
      console.error('Failed to search all vendors:', error);
    }

    return allFrames;
  }

}

export const vendorApiService = new VendorApiService();