import { Request, Response } from 'express';
import { db } from '../db';
import { frames } from '@shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Fetches all frames from the database
 */
export async function getAllFrames(req: Request, res: Response) {
  try {
    let allFrames = await db.select().from(frames);

    // Validate the response data
    if (!Array.isArray(allFrames)) {
      console.warn('Frames data is not an array, returning empty array');
      return res.json([]);
    }

    // Ensure each frame has required properties
    const validFrames = allFrames.filter(frame =>
      frame &&
      typeof frame === 'object' &&
      frame.id &&
      frame.name
    );

    // Add programmatic colors to frames based on their name/material
    const enhancedFrames = validFrames.map(frame => addColorToFrame(frame));

    res.json(enhancedFrames);
  } catch (error) {
    console.error('Error fetching frames:', error);
    res.status(500).json({
      error: 'Failed to fetch frames',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Fetches a frame by ID
 */
export async function getFrameById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const [frame] = await db.select().from(frames).where(eq(frames.id, id));

    if (!frame) {
      return res.status(404).json({ error: 'Frame not found' });
    }

    if (typeof frame !== 'object' || !frame.id || !frame.name) {
      console.warn('Frame data is invalid, returning empty object');
      return res.json({});
    }

    // Add programmatic color to the frame
    const frameWithColor = addColorToFrame(frame);

    res.json(frameWithColor);
  } catch (error) {
    console.error('Error fetching frame by ID:', error);
    res.status(500).json({
      error: 'Failed to fetch frame',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Fetches frames by manufacturer
 */
export async function getFramesByManufacturer(req: Request, res: Response) {
  try {
    const { manufacturer } = req.params;

    const manufacturerFrames = await db.select().from(frames).where(eq(frames.manufacturer, manufacturer));

    // Validate the response data
    if (!Array.isArray(manufacturerFrames)) {
      console.warn('Frames data is not an array, returning empty array');
      return res.json([]);
    }

    // Ensure each frame has required properties
    const validFrames = manufacturerFrames.filter(frame =>
      frame &&
      typeof frame === 'object' &&
      frame.id &&
      frame.name
    );

    // Add programmatic colors to all frames
    const framesWithColors = validFrames.map(frame => addColorToFrame(frame));

    res.json(framesWithColors);
  } catch (error) {
    console.error('Error fetching frames by manufacturer:', error);
    res.status(500).json({
      error: 'Failed to fetch frames by manufacturer',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Helper function to add a color property to a frame based on its name and material
 */
function addColorToFrame(frame: any) {
  const defaultColors = {
    "Gold": "#D4AF37",
    "Silver": "#C0C0C0",
    "Black": "#000000",
    "White": "#F5F5F5",
    "Brown": "#8B4513",
    "Walnut": "#5C4033",
    "Cherry": "#722F37",
    "Mahogany": "#4E2728",
    "Oak": "#D8BE75",
    "Natural": "#E5D3B3"
  };

  // Default medium brown
  let frameColor = "#8B4513";

  // Find a matching color based on the frame name
  for (const [colorName, hexColor] of Object.entries(defaultColors)) {
    if (frame.name.toLowerCase().includes(colorName.toLowerCase()) ||
      (frame.material && frame.material.toLowerCase().includes(colorName.toLowerCase()))) {
      frameColor = hexColor;
      break;
    }
  }

  // Special case for true black
  if (frame.name.toLowerCase().includes('black') ||
    (frame.material && frame.material.toLowerCase().includes('black'))) {
    frameColor = "#000000";
  }

  // Add color to the frame object (will be included in the response but not stored in DB)
  return {
    ...frame,
    color: frameColor
  };
}