// Debug orders API issue
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from "ws";
import dotenv from 'dotenv';

dotenv.config();

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not found");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  console.log('Testing orders API query...');
  
  // Test the exact query from the orders controller
  const ordersResult = await pool.query(`
    SELECT 
      o.*,
      c.name as customer_name,
      c.email as customer_email,
      c.phone as customer_phone
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    ORDER BY o.created_at DESC
  `);
  
  console.log('Orders found:', ordersResult.rows.length);
  
  // Show first 3 orders
  ordersResult.rows.slice(0, 3).forEach((order, idx) => {
    console.log(`\nOrder ${idx + 1}:`, {
      id: order.id,
      customer_id: order.customer_id,
      customer_name: order.customer_name,
      status: order.status,
      total: order.total,
      artwork_width: order.artwork_width,
      artwork_height: order.artwork_height
    });
  });
  
} catch (error) {
  console.error('Database query error:', error);
} finally {
  await pool.end();
}