import React from 'react';
import { AutomatedCostEstimator } from '@/components/AutomatedCostEstimator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, Clock, Zap } from 'lucide-react';

const CostEstimatorPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cost Estimator</h1>
            <p className="text-muted-foreground">
              Get instant pricing estimates for custom framing projects
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Real-time
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Professional
            </Badge>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Instant Calculations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get real-time pricing as you adjust dimensions and select materials
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Saving
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                No more manual calculations or waiting for quotes
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Professional Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Based on actual wholesale pricing and industry standards
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Cost Estimator Component */}
      <AutomatedCostEstimator />

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tips for Accurate Estimates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Dimension Guidelines</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Enter artwork dimensions in inches</li>
                <li>• Mat width is border around all sides</li>
                <li>• Standard mat widths: 2", 2.5", 3", 4"</li>
                <li>• Consider proportion to artwork size</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Material Selection</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Frame prices are per linear foot</li>
                <li>• Glass pricing varies by type and size</li>
                <li>• Mat colors affect final pricing</li>
                <li>• Premium materials cost more but last longer</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostEstimatorPage;