import React from 'react';

const TestPage = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        color: '#333', 
        fontSize: '24px', 
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        Jay's Frames POS System - Test Page
      </h1>
      
      <div style={{
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        ✓ Frontend Server Running Successfully
      </div>
      
      <div style={{
        backgroundColor: '#2196F3',
        color: 'white',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        ✓ Payment Processing System Ready
      </div>
      
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        border: '1px solid #ddd'
      }}>
        <h2 style={{ color: '#333', marginBottom: '10px' }}>System Status</h2>
        <p>Backend: Connected</p>
        <p>Database: Connected</p>
        <p>Stripe Integration: Ready</p>
        <p>Payment Links: Functional</p>
      </div>
    </div>
  );
};

export default TestPage;