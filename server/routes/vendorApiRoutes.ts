
import { Router } from 'express';
import { vendorApiService } from '../services/vendorApiService';
import { studioMouldingService } from '../services/studioMouldingService';

const router = Router();

// Existing vendor routes...

/**
 * Get Studio Moulding frame with all pricing options
 */
router.get('/studio-moulding/:itemNumber', async (req, res) => {
  try {
    const { itemNumber } = req.params;
    const result = await studioMouldingService.getFrameByItemNumber(itemNumber);
    
    if (!result.frame) {
      return res.status(404).json({
        success: false,
        message: 'Frame not found'
      });
    }

    res.json({
      success: true,
      frame: result.frame,
      pricingOptions: result.pricingOptions
    });
  } catch (error) {
    console.error('Error getting Studio Moulding frame:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get frame details'
    });
  }
});

/**
 * Calculate optimal pricing for Studio Moulding frame
 */
router.post('/studio-moulding/:itemNumber/optimize', async (req, res) => {
  try {
    const { itemNumber } = req.params;
    const { footageNeeded } = req.body;

    if (!footageNeeded || footageNeeded <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid footageNeeded is required'
      });
    }

    const optimization = studioMouldingService.calculateOptimalPricing(itemNumber, footageNeeded);
    
    if (!optimization.frame) {
      return res.status(404).json({
        success: false,
        message: 'Frame not found'
      });
    }

    res.json({
      success: true,
      ...optimization
    });
  } catch (error) {
    console.error('Error calculating pricing optimization:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate pricing optimization'
    });
  }
});

/**
 * Search Studio Moulding catalog
 */
router.get('/studio-moulding/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const frames = await studioMouldingService.searchFrames(query);

    res.json({
      success: true,
      frames,
      count: frames.length
    });
  } catch (error) {
    console.error('Error searching Studio Moulding:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
});

/**
 * Get full Studio Moulding catalog
 */
router.get('/studio-moulding/catalog', async (req, res) => {
  try {
    const frames = await studioMouldingService.fetchCatalog();

    res.json({
      success: true,
      frames,
      count: frames.length
    });
  } catch (error) {
    console.error('Error fetching Studio Moulding catalog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch catalog'
    });
  }
});

export default router;
