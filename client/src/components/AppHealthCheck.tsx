
import React from 'react';

export function AppHealthCheck() {
  console.log('AppHealthCheck component rendered');
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'green', 
      color: 'white', 
      padding: '5px 10px',
      borderRadius: '4px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      App Loading ✓
    </div>
  );
}
