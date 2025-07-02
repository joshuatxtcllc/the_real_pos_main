
import React from 'react';
import StudioMouldingOptimizer from '../components/StudioMouldingOptimizer';

export default function StudioMouldingPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Studio Moulding</h1>
        <p className="text-gray-600 mt-2">
          Find the best pricing options for Studio Moulding frames with our optimization tool.
          Compare length, straight cut, chop, join, and box pricing to maximize your savings.
        </p>
      </div>
      
      <StudioMouldingOptimizer />
    </div>
  );
}
