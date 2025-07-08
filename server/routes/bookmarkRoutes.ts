import { Router } from 'express';
import { db } from '../db';
import { frameConfigurationBookmarks, insertFrameConfigurationBookmarkSchema } from '../../shared/schema';
import { eq, desc, and, ilike, sql } from 'drizzle-orm';

const router = Router();

// Get all bookmarks
router.get('/bookmarks', async (req, res) => {
  try {
    const bookmarks = await db
      .select()
      .from(frameConfigurationBookmarks)
      .orderBy(desc(frameConfigurationBookmarks.isFavorite), desc(frameConfigurationBookmarks.lastUsed), desc(frameConfigurationBookmarks.createdAt));
    
    res.json(bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

// Get bookmark by ID
router.get('/bookmarks/:id', async (req, res) => {
  try {
    const bookmark = await db
      .select()
      .from(frameConfigurationBookmarks)
      .where(eq(frameConfigurationBookmarks.id, parseInt(req.params.id)))
      .limit(1);
    
    if (bookmark.length === 0) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    
    res.json(bookmark[0]);
  } catch (error) {
    console.error('Error fetching bookmark:', error);
    res.status(500).json({ error: 'Failed to fetch bookmark' });
  }
});

// Create new bookmark
router.post('/bookmarks', async (req, res) => {
  try {
    const bookmarkData = insertFrameConfigurationBookmarkSchema.parse(req.body);
    
    const newBookmark = await db
      .insert(frameConfigurationBookmarks)
      .values(bookmarkData)
      .returning();
    
    res.status(201).json(newBookmark[0]);
  } catch (error) {
    console.error('Error creating bookmark:', error);
    res.status(500).json({ error: 'Failed to create bookmark' });
  }
});

// Update bookmark
router.put('/bookmarks/:id', async (req, res) => {
  try {
    const bookmarkData = insertFrameConfigurationBookmarkSchema.parse(req.body);
    
    const updatedBookmark = await db
      .update(frameConfigurationBookmarks)
      .set({
        ...bookmarkData,
        updatedAt: new Date()
      })
      .where(eq(frameConfigurationBookmarks.id, parseInt(req.params.id)))
      .returning();
    
    if (updatedBookmark.length === 0) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    
    res.json(updatedBookmark[0]);
  } catch (error) {
    console.error('Error updating bookmark:', error);
    res.status(500).json({ error: 'Failed to update bookmark' });
  }
});

// Delete bookmark
router.delete('/bookmarks/:id', async (req, res) => {
  try {
    const deletedBookmark = await db
      .delete(frameConfigurationBookmarks)
      .where(eq(frameConfigurationBookmarks.id, parseInt(req.params.id)))
      .returning();
    
    if (deletedBookmark.length === 0) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    
    res.json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    res.status(500).json({ error: 'Failed to delete bookmark' });
  }
});

// Apply bookmark (increment usage count and update last used)
router.post('/bookmarks/:id/apply', async (req, res) => {
  try {
    const updatedBookmark = await db
      .update(frameConfigurationBookmarks)
      .set({
        usageCount: sql`${frameConfigurationBookmarks.usageCount} + 1`,
        lastUsed: new Date()
      })
      .where(eq(frameConfigurationBookmarks.id, parseInt(req.params.id)))
      .returning();
    
    if (updatedBookmark.length === 0) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    
    res.json(updatedBookmark[0]);
  } catch (error) {
    console.error('Error applying bookmark:', error);
    res.status(500).json({ error: 'Failed to apply bookmark' });
  }
});

// Toggle favorite status
router.post('/bookmarks/:id/favorite', async (req, res) => {
  try {
    const bookmark = await db
      .select()
      .from(frameConfigurationBookmarks)
      .where(eq(frameConfigurationBookmarks.id, parseInt(req.params.id)))
      .limit(1);
    
    if (bookmark.length === 0) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    
    const updatedBookmark = await db
      .update(frameConfigurationBookmarks)
      .set({
        isFavorite: !bookmark[0].isFavorite,
        updatedAt: new Date()
      })
      .where(eq(frameConfigurationBookmarks.id, parseInt(req.params.id)))
      .returning();
    
    res.json(updatedBookmark[0]);
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
});

// Search bookmarks
router.get('/bookmarks/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const bookmarks = await db
      .select()
      .from(frameConfigurationBookmarks)
      .where(
        sql`${frameConfigurationBookmarks.name} ILIKE ${'%' + query + '%'} OR 
            ${frameConfigurationBookmarks.description} ILIKE ${'%' + query + '%'} OR 
            array_to_string(${frameConfigurationBookmarks.tags}, ' ') ILIKE ${'%' + query + '%'}`
      )
      .orderBy(desc(frameConfigurationBookmarks.isFavorite), desc(frameConfigurationBookmarks.lastUsed));
    
    res.json(bookmarks);
  } catch (error) {
    console.error('Error searching bookmarks:', error);
    res.status(500).json({ error: 'Failed to search bookmarks' });
  }
});

export default router;