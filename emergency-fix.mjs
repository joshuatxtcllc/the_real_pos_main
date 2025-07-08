// Emergency fix for database connection issues
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from "ws";
import dotenv from 'dotenv';

dotenv.config();

neonConfig.webSocketConstructor = ws;

console.log('Emergency database connection test...');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set!');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  // Test basic connection
  console.log('Testing basic connection...');
  const testResult = await pool.query('SELECT 1 as test');
  console.log('Connection test result:', testResult.rows);
  
  // Test orders query
  console.log('Testing orders query...');
  const ordersResult = await pool.query(`
    SELECT 
      o.id, o.customer_id, o.status, o.total, o.artwork_width, o.artwork_height,
      c.name as customer_name
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    ORDER BY o.created_at DESC
    LIMIT 5
  `);
  
  console.log('Orders query result:', ordersResult.rows.length, 'orders found');
  ordersResult.rows.forEach((order, idx) => {
    console.log(`Order ${idx + 1}:`, {
      id: order.id,
      customer: order.customer_name,
      status: order.status,
      total: order.total,
      dimensions: `${order.artwork_width}x${order.artwork_height}`
    });
  });
  
  // Test customers query
  console.log('Testing customers query...');
  const customersResult = await pool.query('SELECT id, name, email FROM customers LIMIT 5');
  console.log('Customers query result:', customersResult.rows.length, 'customers found');
  
} catch (error) {
  console.error('Database connection error:', error);
  console.error('Error stack:', error.stack);
} finally {
  await pool.end();
}