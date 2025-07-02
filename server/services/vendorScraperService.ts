
import axios from 'axios';
import * as cheerio from 'cheerio';
import { VendorFrame } from '../types';

/**
 * Fallback scraper service for when vendor APIs are unavailable
 */
export class VendorScraperService {
  private readonly timeout = 30000; // 30 seconds

  /**
   * Scrape Larson-Juhl frames from their website
   */
  async scrapeLarsonFrames(searchTerm?: string): Promise<VendorFrame[]> {
    try {
      console.log('Scraping Larson-Juhl website for frames...');
      
      // Use their search or catalog page
      const searchUrl = searchTerm 
        ? `https://www.larsonjuhl.com/search?q=${encodeURIComponent(searchTerm)}`
        : 'https://www.larsonjuhl.com/mouldings';
      
      const response = await axios.get(searchUrl, {
        timeout: this.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      });

      const $ = cheerio.load(response.data);
      const frames: VendorFrame[] = [];

      // Look for product listings
      $('.product-item, .moulding-item, .frame-item, .product-card').each((_, element) => {
        const $element = $(element);
        
        // Extract frame data
        const name = $element.find('.product-title, .item-title, h3, h4').first().text().trim();
        const itemNumber = this.extractItemNumber($element.text()) || this.extractItemNumber(name);
        const priceText = $element.find('.price, .cost, .wholesale').first().text();
        const price = this.extractPrice(priceText);
        const imageUrl = $element.find('img').first().attr('src');
        
        if (name && itemNumber) {
          frames.push({
            id: `larson-${itemNumber}`,
            itemNumber,
            name: `Larson ${name}`,
            price: price || '0.00',
            material: this.determineMaterial(name),
            color: this.extractColor(name),
            width: '2.25',
            height: '0.75',
            depth: '1.25',
            collection: this.extractCollection(name),
            description: name,
            imageUrl: imageUrl ? this.resolveImageUrl(imageUrl, 'https://www.larsonjuhl.com') : '',
            inStock: true,
            vendor: 'Larson Juhl'
          });
        }
      });

      console.log(`Scraped ${frames.length} Larson frames`);
      return frames;
    } catch (error) {
      console.error('Error scraping Larson frames:', error);
      return this.getFallbackLarsonFrames(searchTerm);
    }
  }

  /**
   * Scrape Roma Moulding frames
   */
  async scrapeRomaFrames(searchTerm?: string): Promise<VendorFrame[]> {
    try {
      console.log('Scraping Roma Moulding website for frames...');
      
      const searchUrl = searchTerm
        ? `https://www.romamoulding.com/search?q=${encodeURIComponent(searchTerm)}`
        : 'https://www.romamoulding.com/products';
      
      const response = await axios.get(searchUrl, {
        timeout: this.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const frames: VendorFrame[] = [];

      $('.product-item, .moulding-card, .product-card').each((_, element) => {
        const $element = $(element);
        
        const name = $element.find('.product-name, .item-name, h3, h4').first().text().trim();
        const itemNumber = this.extractItemNumber($element.text()) || this.generateItemNumber();
        const priceText = $element.find('.price, .cost').first().text();
        const price = this.extractPrice(priceText);
        const imageUrl = $element.find('img').first().attr('src');
        
        if (name) {
          frames.push({
            id: `roma-${itemNumber}`,
            itemNumber,
            name: `Roma ${name}`,
            price: price || '0.00',
            material: this.determineMaterial(name),
            color: this.extractColor(name),
            width: '2.00',
            height: '0.75',
            depth: '1.00',
            collection: 'Roma Collection',
            description: name,
            imageUrl: imageUrl ? this.resolveImageUrl(imageUrl, 'https://www.romamoulding.com') : '',
            inStock: true,
            vendor: 'Roma Moulding'
          });
        }
      });

      console.log(`Scraped ${frames.length} Roma frames`);
      return frames;
    } catch (error) {
      console.error('Error scraping Roma frames:', error);
      return this.getFallbackRomaFrames(searchTerm);
    }
  }

  /**
   * Search for specific item numbers across vendor sites
   */
  async searchByItemNumber(itemNumber: string): Promise<VendorFrame[]> {
    console.log(`Scraping for item number: ${itemNumber}`);
    
    const [larsonResults, romaResults] = await Promise.all([
      this.scrapeLarsonFrames(itemNumber),
      this.scrapeRomaFrames(itemNumber)
    ]);
    
    // Filter results to match the exact item number
    const exactMatches = [...larsonResults, ...romaResults].filter(frame => 
      frame.itemNumber === itemNumber || 
      frame.itemNumber.includes(itemNumber) ||
      frame.id.includes(itemNumber)
    );
    
    return exactMatches;
  }

  // Helper methods
  private extractItemNumber(text: string): string | null {
    const matches = text.match(/\b\d{5,6}\b/);
    return matches ? matches[0] : null;
  }

  private extractPrice(priceText: string): string | null {
    const matches = priceText.match(/\$?(\d+\.?\d*)/);
    return matches ? matches[1] : null;
  }

  private determineMaterial(name: string): string {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('wood') || lowerName.includes('oak') || lowerName.includes('maple')) {
      return 'Wood';
    } else if (lowerName.includes('metal') || lowerName.includes('aluminum')) {
      return 'Metal';
    }
    return 'Wood';
  }

  private extractColor(name: string): string {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('white')) return 'White';
    if (lowerName.includes('black')) return 'Black';
    if (lowerName.includes('gold')) return 'Gold';
    if (lowerName.includes('silver')) return 'Silver';
    return 'Natural';
  }

  private extractCollection(name: string): string {
    const words = name.split(' ');
    return words.length > 1 ? words[0] : 'Standard';
  }

  private resolveImageUrl(url: string, baseUrl: string): string {
    if (url.startsWith('http')) return url;
    if (url.startsWith('//')) return `https:${url}`;
    if (url.startsWith('/')) return `${baseUrl}${url}`;
    return `${baseUrl}/${url}`;
  }

  private generateItemNumber(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Fallback static data for when scraping fails
  private getFallbackLarsonFrames(searchTerm?: string): VendorFrame[] {
    const staticFrames = [
      {
        id: 'larson-210285',
        itemNumber: '210285',
        name: 'Larson White Wood Frame',
        price: '16.75',
        material: 'Wood',
        color: 'White',
        width: '2.25',
        height: '0.75',
        depth: '1.25',
        collection: 'Academie',
        description: 'Professional quality white wood frame',
        imageUrl: 'https://www.larsonjuhl.com/images/products/210285.jpg',
        inStock: true,
        vendor: 'Larson Juhl'
      },
      {
        id: 'larson-210286',
        itemNumber: '210286',
        name: 'Larson Black Wood Frame',
        price: '16.75',
        material: 'Wood',
        color: 'Black',
        width: '2.25',
        height: '0.75',
        depth: '1.25',
        collection: 'Academie',
        description: 'Professional quality black wood frame',
        imageUrl: 'https://www.larsonjuhl.com/images/products/210286.jpg',
        inStock: true,
        vendor: 'Larson Juhl'
      }
    ];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return staticFrames.filter(frame => 
        frame.itemNumber.includes(term) ||
        frame.name.toLowerCase().includes(term) ||
        frame.color.toLowerCase().includes(term)
      );
    }

    return staticFrames;
  }

  private getFallbackRomaFrames(searchTerm?: string): VendorFrame[] {
    const staticFrames = [
      {
        id: 'roma-1234',
        itemNumber: '1234',
        name: 'Roma Classic Wood Frame',
        price: '14.50',
        material: 'Wood',
        color: 'Natural',
        width: '2.00',
        height: '0.75',
        depth: '1.00',
        collection: 'Roma Classic',
        description: 'Traditional wood frame with classic profile',
        imageUrl: '',
        inStock: true,
        vendor: 'Roma Moulding'
      }
    ];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return staticFrames.filter(frame => 
        frame.itemNumber.includes(term) ||
        frame.name.toLowerCase().includes(term)
      );
    }

    return staticFrames;
  }
}

export const vendorScraperService = new VendorScraperService();
