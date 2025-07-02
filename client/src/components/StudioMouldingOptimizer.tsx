
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { AlertCircle, Calculator, TrendingDown, Package } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface StudioMouldingFrame {
  id: string;
  itemNumber: string;
  name: string;
  manufacturer: string;
  material: string;
  width: string;
  depth: string;
  color: string;
  price: string;
  collection: string;
  description: string;
}

interface PricingOption {
  method: string;
  pricePerFoot: number;
  description: string;
  boxQuantity?: number;
}

interface PricingCalculation {
  method: string;
  totalCost: number;
  pricePerFoot: number;
  description: string;
  savings?: number;
}

interface OptimizationResult {
  frame: StudioMouldingFrame;
  options: PricingCalculation[];
  recommendation: {
    method: string;
    totalCost: number;
    savings: number;
    reason: string;
  };
}

export default function StudioMouldingOptimizer() {
  const [itemNumber, setItemNumber] = useState('');
  const [footageNeeded, setFootageNeeded] = useState('');
  const [frameDetails, setFrameDetails] = useState<{
    frame: StudioMouldingFrame;
    pricingOptions: PricingOption[];
  } | null>(null);
  const [optimization, setOptimization] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFrameDetails = async (itemNum: string) => {
    if (!itemNum) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/vendor/studio-moulding/${itemNum}`);
      const data = await response.json();
      
      if (data.success) {
        setFrameDetails(data);
      } else {
        setError(data.message || 'Frame not found');
        setFrameDetails(null);
      }
    } catch (error) {
      console.error('Error fetching frame details:', error);
      setError('Failed to fetch frame details');
      setFrameDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateOptimization = async () => {
    if (!itemNumber || !footageNeeded) {
      setError('Please enter both item number and footage needed');
      return;
    }

    const footage = parseFloat(footageNeeded);
    if (footage <= 0) {
      setError('Please enter a valid footage amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/vendor/studio-moulding/${itemNumber}/optimize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ footageNeeded: footage })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOptimization(data);
      } else {
        setError(data.message || 'Optimization failed');
        setOptimization(null);
      }
    } catch (error) {
      console.error('Error calculating optimization:', error);
      setError('Failed to calculate optimization');
      setOptimization(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (itemNumber.length >= 3) {
      fetchFrameDetails(itemNumber);
    }
  }, [itemNumber]);

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const getPricingMethodColor = (method: string) => {
    switch (method) {
      case 'length': return 'bg-blue-100 text-blue-800';
      case 'straight_cut': return 'bg-green-100 text-green-800';
      case 'chop': return 'bg-orange-100 text-orange-800';
      case 'join': return 'bg-purple-100 text-purple-800';
      case 'box': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPricingMethodIcon = (method: string) => {
    switch (method) {
      case 'box': return <Package className="w-4 h-4" />;
      default: return <Calculator className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Studio Moulding Pricing Optimizer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="itemNumber">Item Number</Label>
              <Input
                id="itemNumber"
                value={itemNumber}
                onChange={(e) => setItemNumber(e.target.value)}
                placeholder="e.g., 1420, 3020, 4120"
              />
            </div>
            <div>
              <Label htmlFor="footageNeeded">Footage Needed</Label>
              <Input
                id="footageNeeded"
                type="number"
                value={footageNeeded}
                onChange={(e) => setFootageNeeded(e.target.value)}
                placeholder="e.g., 12.5"
                step="0.1"
                min="0.1"
              />
            </div>
          </div>

          <Button 
            onClick={calculateOptimization}
            disabled={loading || !itemNumber || !footageNeeded}
            className="w-full"
          >
            {loading ? 'Calculating...' : 'Calculate Best Pricing'}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {frameDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Frame Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">{frameDetails.frame.name}</h3>
                <p className="text-sm text-gray-600">Item #{frameDetails.frame.itemNumber}</p>
                <p className="text-sm text-gray-600">Collection: {frameDetails.frame.collection}</p>
              </div>
              <div>
                <p className="text-sm"><strong>Material:</strong> {frameDetails.frame.material}</p>
                <p className="text-sm"><strong>Size:</strong> {frameDetails.frame.width}" × {frameDetails.frame.depth}"</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <h4 className="font-semibold mb-2">Available Pricing Options:</h4>
              <div className="flex flex-wrap gap-2">
                {frameDetails.pricingOptions.map((option, index) => (
                  <Badge key={index} variant="outline" className={getPricingMethodColor(option.method)}>
                    {getPricingMethodIcon(option.method)}
                    {option.method.replace('_', ' ')} - {formatCurrency(option.pricePerFoot)}/ft
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {optimization && (
        <div className="space-y-6">
          {/* Recommendation Card */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <TrendingDown className="w-5 h-5" />
                Best Option: {optimization.recommendation.method.replace('_', ' ').toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-green-600">Total Cost</p>
                  <p className="text-2xl font-bold text-green-800">
                    {formatCurrency(optimization.recommendation.totalCost)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-600">Savings</p>
                  <p className="text-2xl font-bold text-green-800">
                    {formatCurrency(optimization.recommendation.savings)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-600">For</p>
                  <p className="text-2xl font-bold text-green-800">
                    {footageNeeded} feet
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <p className="text-sm text-green-700">{optimization.recommendation.reason}</p>
            </CardContent>
          </Card>

          {/* All Options Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>All Pricing Options Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {optimization.options
                  .sort((a, b) => a.totalCost - b.totalCost)
                  .map((option, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border ${
                        option.method === optimization.recommendation.method 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getPricingMethodColor(option.method)}>
                              {getPricingMethodIcon(option.method)}
                              {option.method.replace('_', ' ').toUpperCase()}
                            </Badge>
                            {option.method === optimization.recommendation.method && (
                              <Badge variant="default" className="bg-green-600">
                                RECOMMENDED
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{option.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatCurrency(option.pricePerFoot)} per foot
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">
                            {formatCurrency(option.totalCost)}
                          </p>
                          {option.savings !== undefined && option.savings > 0 && (
                            <p className="text-sm text-red-600">
                              +{formatCurrency(option.savings)} more
                            </p>
                          )}
                          {option.method === optimization.recommendation.method && (
                            <p className="text-sm text-green-600 font-medium">
                              BEST PRICE
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
