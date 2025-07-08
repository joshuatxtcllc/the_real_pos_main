import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bookmark, Star, Search, Plus, Trash2, Edit, Clock } from 'lucide-react';
import { FrameConfigurationBookmark, Frame, MatColor, GlassOption } from '../../../shared/schema';
import { useToast } from '@/hooks/use-toast';

interface BookmarkManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBookmark: (bookmark: FrameConfigurationBookmark) => void;
  currentConfiguration?: {
    frames: { frame: Frame; position: number; distance: number }[];
    mats: { matboard: MatColor; position: number; width: number; offset: number }[];
    glassOption: GlassOption | null;
    useMultipleMats: boolean;
    useMultipleFrames: boolean;
    artworkWidth?: number;
    artworkHeight?: number;
    matWidth?: number;
  };
}

export const BookmarkManager = ({ 
  isOpen, 
  onClose, 
  onApplyBookmark, 
  currentConfiguration 
}: BookmarkManagerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [bookmarkName, setBookmarkName] = useState('');
  const [bookmarkDescription, setBookmarkDescription] = useState('');
  const [bookmarkTags, setBookmarkTags] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch bookmarks
  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey: ['/api/bookmarks'],
    enabled: isOpen
  });

  // Create bookmark mutation
  const createBookmarkMutation = useMutation({
    mutationFn: async (bookmarkData: any) => {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookmarkData)
      });
      if (!response.ok) throw new Error('Failed to create bookmark');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks'] });
      setShowSaveDialog(false);
      setBookmarkName('');
      setBookmarkDescription('');
      setBookmarkTags('');
      toast({
        title: "Bookmark saved",
        description: "Your frame configuration has been bookmarked successfully."
      });
    }
  });

  // Delete bookmark mutation
  const deleteBookmarkMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/bookmarks/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete bookmark');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks'] });
      toast({
        title: "Bookmark deleted",
        description: "The bookmark has been removed."
      });
    }
  });

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/bookmarks/${id}/favorite`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to toggle favorite');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks'] });
    }
  });

  // Apply bookmark mutation
  const applyBookmarkMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/bookmarks/${id}/apply`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to apply bookmark');
      return response.json();
    },
    onSuccess: (bookmark) => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks'] });
      onApplyBookmark(bookmark);
      onClose();
      toast({
        title: "Configuration applied",
        description: `Applied "${bookmark.name}" bookmark to your current order.`
      });
    }
  });

  const handleSaveCurrentConfiguration = () => {
    if (!currentConfiguration) return;

    const bookmarkData = {
      name: bookmarkName,
      description: bookmarkDescription,
      frames: currentConfiguration.frames.map(f => ({
        frameId: f.frame.id,
        position: f.position,
        distance: f.distance
      })),
      mats: currentConfiguration.mats.map(m => ({
        matColorId: m.matboard.id,
        position: m.position,
        width: m.width,
        offset: m.offset
      })),
      glassOptionId: currentConfiguration.glassOption?.id || null,
      useMultipleMats: currentConfiguration.useMultipleMats,
      useMultipleFrames: currentConfiguration.useMultipleFrames,
      defaultArtworkWidth: currentConfiguration.artworkWidth?.toString(),
      defaultArtworkHeight: currentConfiguration.artworkHeight?.toString(),
      defaultMatWidth: currentConfiguration.matWidth?.toString(),
      tags: bookmarkTags ? bookmarkTags.split(',').map(tag => tag.trim()) : [],
      isFavorite: false,
      isPublic: false,
      createdBy: 1 // TODO: Replace with actual user ID when auth is implemented
    };

    createBookmarkMutation.mutate(bookmarkData);
  };

  const filteredBookmarks = bookmarks.filter((bookmark: FrameConfigurationBookmark) =>
    bookmark.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (bookmark.tags && bookmark.tags.some(tag => 
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );

  const favoriteBookmarks = filteredBookmarks.filter((b: FrameConfigurationBookmark) => b.isFavorite);
  const regularBookmarks = filteredBookmarks.filter((b: FrameConfigurationBookmark) => !b.isFavorite);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            Frame Configuration Bookmarks
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          {/* Search and Actions */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            {currentConfiguration && (
              <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Save Current
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Current Configuration</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bookmark-name">Name</Label>
                      <Input
                        id="bookmark-name"
                        value={bookmarkName}
                        onChange={(e) => setBookmarkName(e.target.value)}
                        placeholder="e.g., Gold Classic with Double Mat"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bookmark-description">Description (Optional)</Label>
                      <Textarea
                        id="bookmark-description"
                        value={bookmarkDescription}
                        onChange={(e) => setBookmarkDescription(e.target.value)}
                        placeholder="Describe this configuration..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bookmark-tags">Tags (Optional)</Label>
                      <Input
                        id="bookmark-tags"
                        value={bookmarkTags}
                        onChange={(e) => setBookmarkTags(e.target.value)}
                        placeholder="e.g., wedding, portrait, landscape (comma-separated)"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSaveCurrentConfiguration}
                        disabled={!bookmarkName.trim() || createBookmarkMutation.isPending}
                      >
                        {createBookmarkMutation.isPending ? 'Saving...' : 'Save Bookmark'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Bookmarks List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8">Loading bookmarks...</div>
            ) : filteredBookmarks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No bookmarks match your search.' : 'No bookmarks saved yet.'}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Favorites */}
                {favoriteBookmarks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      Favorites
                    </h3>
                    <div className="grid gap-2">
                      {favoriteBookmarks.map((bookmark: FrameConfigurationBookmark) => (
                        <BookmarkCard
                          key={bookmark.id}
                          bookmark={bookmark}
                          onApply={applyBookmarkMutation.mutate}
                          onDelete={deleteBookmarkMutation.mutate}
                          onToggleFavorite={toggleFavoriteMutation.mutate}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Regular Bookmarks */}
                {regularBookmarks.length > 0 && (
                  <div>
                    {favoriteBookmarks.length > 0 && (
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        All Bookmarks
                      </h3>
                    )}
                    <div className="grid gap-2">
                      {regularBookmarks.map((bookmark: FrameConfigurationBookmark) => (
                        <BookmarkCard
                          key={bookmark.id}
                          bookmark={bookmark}
                          onApply={applyBookmarkMutation.mutate}
                          onDelete={deleteBookmarkMutation.mutate}
                          onToggleFavorite={toggleFavoriteMutation.mutate}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface BookmarkCardProps {
  bookmark: FrameConfigurationBookmark;
  onApply: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

const BookmarkCard = ({ bookmark, onApply, onDelete, onToggleFavorite }: BookmarkCardProps) => {
  const frames = Array.isArray(bookmark.frames) ? bookmark.frames : [];
  const mats = Array.isArray(bookmark.mats) ? bookmark.mats : [];
  
  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium">{bookmark.name}</h4>
              {bookmark.isFavorite && (
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              )}
            </div>
            
            {bookmark.description && (
              <p className="text-sm text-muted-foreground mb-2">{bookmark.description}</p>
            )}
            
            <div className="flex flex-wrap gap-1 mb-2">
              <Badge variant="outline" className="text-xs">
                {frames.length} Frame{frames.length !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {mats.length} Mat{mats.length !== 1 ? 's' : ''}
              </Badge>
              {bookmark.glassOptionId && (
                <Badge variant="outline" className="text-xs">Glass</Badge>
              )}
            </div>
            
            {bookmark.tags && bookmark.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {bookmark.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {bookmark.usageCount > 0 && (
                <span>Used {bookmark.usageCount} time{bookmark.usageCount !== 1 ? 's' : ''}</span>
              )}
              {bookmark.lastUsed && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(bookmark.lastUsed).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-1 ml-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onToggleFavorite(bookmark.id)}
            >
              <Star className={`h-4 w-4 ${bookmark.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </Button>
            <Button
              size="sm"
              onClick={() => onApply(bookmark.id)}
            >
              Apply
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(bookmark.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookmarkManager;