import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, Zap, DollarSign, Ruler, Frame, Square, Shield, Palette } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface Frame {
  id: string;
  name: string;
  price: string;
  material: string;
  manufacturer: string;
  color?: string;
}

interface MatColor {
  id: string;
  name: string;
  color: string;
  price: string;
  category?: string;
}

interface GlassOption {
  id: string;
  name: string;
  price: string;
  description: string;
}

interface PricingEstimate {
  framePrice: number;
  matPrice: number;
  glassPrice: number;
  laborCost: number;
  materialCost: number;
  subtotal: number;
  totalPrice: number;
  unitedInches: number;
  finishedDimensions: {
    width: number;
    height: number;
  };
  breakdown: {
    materials: number;
    labor: number;
    markup: number;
  };
}

export const AutomatedCostEstimator: React.FC = () => {
  // Form state
  const [artworkWidth, setArtworkWidth] = useState<number>(16);
  const [artworkHeight, setArtworkHeight] = useState<number>(20);
  const [matWidth, setMatWidth] = useState<number>(2);
  const [frameId, setFrameId] = useState<string>('');
  const [matColorId, setMatColorId] = useState<string>('');
  const [glassOptionId, setGlassOptionId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  
  // Pricing state
  const [estimate, setEstimate] = useState<PricingEstimate | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [autoCalculate, setAutoCalculate] = useState(true);

  // Fetch catalog data
  const { data: frames = [] } = useQuery<Frame[]>({
    queryKey: ['/api/frames'],
  });

  const { data: matColors = [] } = useQuery<MatColor[]>({
    queryKey: ['/api/mat-colors'],
  });

  const { data: glassOptions = [] } = useQuery<GlassOption[]>({
    queryKey: ['/api/glass-options'],
  });

  // Calculate estimate
  const calculateEstimate = async () => {
    if (!frameId || !matColorId || !glassOptionId || artworkWidth <= 0 || artworkHeight <= 0) {
      return;
    }

    setIsCalculating(true);
    try {
      const response = await apiRequest('POST', '/api/pricing/calculate', {
        frameId,
        matColorId,
        glassOptionId,
        artworkWidth,
        artworkHeight,
        matWidth,
        quantity,
        includeWholesalePrices: false
      });

      const result = await response.json();
      
      // Calculate additional metrics
      const unitedInches = artworkWidth + artworkHeight;
      const finishedWidth = artworkWidth + (matWidth * 2);
      const finishedHeight = artworkHeight + (matWidth * 2);
      
      const enhancedEstimate: PricingEstimate = {
        ...result,
        unitedInches,
        finishedDimensions: {
          width: finishedWidth,
          height: finishedHeight
        },
        breakdown: {
          materials: result.materialCost || (result.framePrice + result.matPrice + result.glassPrice),
          labor: result.laborCost || 0,
          markup: result.totalPrice - (result.materialCost || 0) - (result.laborCost || 0)
        }
      };

      setEstimate(enhancedEstimate);
    } catch (error) {
      console.error('Error calculating estimate:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Auto-calculate when inputs change
  useEffect(() => {
    if (autoCalculate) {
      const timeoutId = setTimeout(() => {
        calculateEstimate();
      }, 500); // Debounce calculations

      return () => clearTimeout(timeoutId);
    }
  }, [frameId, matColorId, glassOptionId, artworkWidth, artworkHeight, matWidth, quantity, autoCalculate]);

  // Get selected items for display
  const selectedFrame = frames.find(f => f.id === frameId);
  const selectedMat = matColors.find(m => m.id === matColorId);
  const selectedGlass = glassOptions.find(g => g.id === glassOptionId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Automated Cost Estimator
            <Badge variant="secondary" className="ml-2">
              <Zap className="h-3 w-3 mr-1" />
              Real-time
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Project Specifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="artwork-width">Artwork Width (inches)</Label>
                <Input
                  id="artwork-width"
                  type="number"
                  value={artworkWidth}
                  onChange={(e) => setArtworkWidth(Number(e.target.value))}
                  min="1"
                  max="200"
                />
              </div>
              <div>
                <Label htmlFor="artwork-height">Artwork Height (inches)</Label>
                <Input
                  id="artwork-height"
                  type="number"
                  value={artworkHeight}
                  onChange={(e) => setArtworkHeight(Number(e.target.value))}
                  min="1"
                  max="200"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mat-width">Mat Width (inches)</Label>
              <Input
                id="mat-width"
                type="number"
                value={matWidth}
                onChange={(e) => setMatWidth(Number(e.target.value))}
                min="0"
                max="10"
                step="0.25"
              />
            </div>

            {/* Materials Selection */}
            <div>
              <Label>Frame Selection</Label>
              <Select value={frameId} onValueChange={setFrameId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a frame" />
                </SelectTrigger>
                <SelectContent>
                  {frames.map((frame) => (
                    <SelectItem key={frame.id} value={frame.id}>
                      <div className="flex items-center gap-2">
                        <Frame className="h-4 w-4" />
                        {frame.name} - {frame.material}
                        <Badge variant="outline">${frame.price}/ft</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Mat Color</Label>
              <Select value={matColorId} onValueChange={setMatColorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mat color" />
                </SelectTrigger>
                <SelectContent>
                  {matColors.map((mat) => (
                    <SelectItem key={mat.id} value={mat.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: mat.color }}
                        />
                        {mat.name}
                        {mat.category && <Badge variant="outline">{mat.category}</Badge>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Glass Type</Label>
              <Select value={glassOptionId} onValueChange={setGlassOptionId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select glass type" />
                </SelectTrigger>
                <SelectContent>
                  {glassOptions.map((glass) => (
                    <SelectItem key={glass.id} value={glass.id}>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        {glass.name}
                        <Badge variant="outline">${glass.price}/sq.in</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                max="100"
              />
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <Button 
                onClick={calculateEstimate} 
                disabled={isCalculating || !frameId || !matColorId || !glassOptionId}
                className="flex-1"
              >
                {isCalculating ? 'Calculating...' : 'Calculate Cost'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setAutoCalculate(!autoCalculate)}
                className={autoCalculate ? 'bg-green-50' : ''}
              >
                <Zap className="h-4 w-4" />
                Auto
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Cost Estimate
            </CardTitle>
          </CardHeader>
          <CardContent>
            {estimate ? (
              <div className="space-y-4">
                {/* Total Price */}
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    ${estimate.totalPrice.toFixed(2)}
                  </div>
                  <div className="text-sm text-blue-500">
                    Total Estimated Cost
                  </div>
                  {quantity > 1 && (
                    <div className="text-sm text-gray-500">
                      ${(estimate.totalPrice / quantity).toFixed(2)} per unit
                    </div>
                  )}
                </div>

                {/* Dimensions Summary */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>Artwork Size</Label>
                    <div className="font-medium">{artworkWidth}" × {artworkHeight}"</div>
                  </div>
                  <div>
                    <Label>Finished Size</Label>
                    <div className="font-medium">
                      {estimate.finishedDimensions.width}" × {estimate.finishedDimensions.height}"
                    </div>
                  </div>
                  <div>
                    <Label>United Inches</Label>
                    <div className="font-medium">{estimate.unitedInches}"</div>
                  </div>
                  <div>
                    <Label>Mat Border</Label>
                    <div className="font-medium">{matWidth}" all around</div>
                  </div>
                </div>

                <Separator />

                {/* Cost Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-medium">Cost Breakdown</h4>
                  
                  {/* Frame Cost */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Frame className="h-4 w-4" />
                      <span>Frame</span>
                      {selectedFrame && (
                        <Badge variant="outline" className="text-xs">
                          {selectedFrame.material}
                        </Badge>
                      )}
                    </div>
                    <span className="font-medium">${estimate.framePrice.toFixed(2)}</span>
                  </div>

                  {/* Mat Cost */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Square className="h-4 w-4" />
                      <span>Mat</span>
                      {selectedMat && (
                        <div 
                          className="w-3 h-3 rounded border"
                          style={{ backgroundColor: selectedMat.color }}
                        />
                      )}
                    </div>
                    <span className="font-medium">${estimate.matPrice.toFixed(2)}</span>
                  </div>

                  {/* Glass Cost */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Glass</span>
                      {selectedGlass && (
                        <Badge variant="outline" className="text-xs">
                          {selectedGlass.name}
                        </Badge>
                      )}
                    </div>
                    <span className="font-medium">${estimate.glassPrice.toFixed(2)}</span>
                  </div>

                  {/* Labor */}
                  {estimate.laborCost > 0 && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        <span>Labor & Assembly</span>
                      </div>
                      <span className="font-medium">${estimate.laborCost.toFixed(2)}</span>
                    </div>
                  )}

                  <Separator />

                  {/* Subtotals */}
                  <div className="flex justify-between items-center text-sm">
                    <span>Materials</span>
                    <span>${estimate.breakdown.materials.toFixed(2)}</span>
                  </div>
                  {estimate.breakdown.labor > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span>Labor</span>
                      <span>${estimate.breakdown.labor.toFixed(2)}</span>
                    </div>
                  )}
                  {estimate.breakdown.markup > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span>Markup & Services</span>
                      <span>${estimate.breakdown.markup.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Selected Materials Summary */}
                {(selectedFrame || selectedMat || selectedGlass) && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-medium">Selected Materials</h4>
                      {selectedFrame && (
                        <div className="text-sm">
                          <strong>Frame:</strong> {selectedFrame.name} ({selectedFrame.manufacturer})
                        </div>
                      )}
                      {selectedMat && (
                        <div className="text-sm">
                          <strong>Mat:</strong> {selectedMat.name}
                        </div>
                      )}
                      {selectedGlass && (
                        <div className="text-sm">
                          <strong>Glass:</strong> {selectedGlass.name}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select frame, mat, and glass options to see cost estimate</p>
                <p className="text-sm mt-2">
                  {autoCalculate ? 'Estimates will update automatically' : 'Click Calculate to get estimate'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutomatedCostEstimator;