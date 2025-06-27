
/**
 * AI-Powered Material Ordering Service
 * Uses OpenAI to predict material needs and suggest optimal ordering
 */

import OpenAI from "openai";
import { db } from "../db";
import { sql } from "drizzle-orm";
import { log } from "../vite";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = "gpt-4o";

interface MaterialUsageData {
  materialId: string;
  materialName: string;
  materialType: 'frame' | 'mat' | 'glass';
  currentStock: number;
  usageLastMonth: number;
  usageLast3Months: number;
  averageOrderSize: number;
  seasonalTrend: string;
  pricePerUnit: number;
  leadTime: number;
}

interface OrderRecommendation {
  materialId: string;
  materialName: string;
  recommendedQuantity: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  reasoning: string;
  estimatedRunoutDate: string;
  suggestedOrderDate: string;
  costImpact: number;
}

/**
 * Analyze material usage patterns and generate ordering recommendations
 */
export async function generateOrderingRecommendations(): Promise<OrderRecommendation[]> {
  try {
    log("Generating AI-powered material ordering recommendations", "aiMaterialOrderingService");

    // Get material usage data
    const materialUsageData = await getMaterialUsageData();
    
    if (materialUsageData.length === 0) {
      return [];
    }

    // Create AI prompt with usage data
    const prompt = createOrderingPrompt(materialUsageData);

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert inventory management consultant for a custom framing business. You analyze material usage patterns, seasonal trends, and lead times to optimize ordering decisions. Your goal is to prevent stockouts while minimizing holding costs and waste."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 2000,
    });

    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      throw new Error("No response from OpenAI");
    }

    const aiResponse = JSON.parse(responseContent);
    return aiResponse.recommendations || [];

  } catch (error) {
    log(`Error generating ordering recommendations: ${error}`, "aiMaterialOrderingService");
    throw error;
  }
}

/**
 * Get material usage data from the database
 */
async function getMaterialUsageData(): Promise<MaterialUsageData[]> {
  try {
    // This would query actual usage data from orders
    // For now, return sample data structure
    const query = sql`
      SELECT 
        m.id as material_id,
        m.name as material_name,
        m.type as material_type,
        m.stock_quantity as current_stock,
        m.price as price_per_unit,
        m.lead_time_days as lead_time,
        COALESCE(usage_month.usage_count, 0) as usage_last_month,
        COALESCE(usage_3month.usage_count, 0) as usage_last_3_months,
        COALESCE(avg_order.avg_size, 1) as average_order_size
      FROM materials m
      LEFT JOIN (
        SELECT material_id, COUNT(*) as usage_count
        FROM order_materials om
        JOIN orders o ON om.order_id = o.id
        WHERE o.created_at >= NOW() - INTERVAL '1 month'
        GROUP BY material_id
      ) usage_month ON m.id = usage_month.material_id
      LEFT JOIN (
        SELECT material_id, COUNT(*) as usage_count
        FROM order_materials om
        JOIN orders o ON om.order_id = o.id
        WHERE o.created_at >= NOW() - INTERVAL '3 months'
        GROUP BY material_id
      ) usage_3month ON m.id = usage_3month.material_id
      LEFT JOIN (
        SELECT material_id, AVG(quantity) as avg_size
        FROM order_materials
        GROUP BY material_id
      ) avg_order ON m.id = avg_order.material_id
      WHERE m.active = true
    `;

    // For demonstration, return mock data
    return [
      {
        materialId: 'frame_001',
        materialName: 'Black Metal Frame 1"',
        materialType: 'frame',
        currentStock: 25,
        usageLastMonth: 15,
        usageLast3Months: 48,
        averageOrderSize: 2.5,
        seasonalTrend: 'stable',
        pricePerUnit: 45.50,
        leadTime: 14
      },
      {
        materialId: 'mat_001',
        materialName: 'White Conservation Mat',
        materialType: 'mat',
        currentStock: 8,
        usageLastMonth: 22,
        usageLast3Months: 67,
        averageOrderSize: 1.8,
        seasonalTrend: 'increasing',
        pricePerUnit: 12.75,
        leadTime: 7
      }
    ];

  } catch (error) {
    log(`Error getting material usage data: ${error}`, "aiMaterialOrderingService");
    return [];
  }
}

/**
 * Create AI prompt for ordering recommendations
 */
function createOrderingPrompt(materialData: MaterialUsageData[]): string {
  return `
Analyze the following material usage data for a custom framing business and provide ordering recommendations:

MATERIAL USAGE DATA:
${JSON.stringify(materialData, null, 2)}

BUSINESS CONTEXT:
- We want to maintain 2-3 weeks of inventory as safety stock
- Minimize holding costs while preventing stockouts
- Consider seasonal trends and lead times
- Budget constraints may limit large orders

Please provide recommendations in this JSON format:
{
  "recommendations": [
    {
      "materialId": "string",
      "materialName": "string", 
      "recommendedQuantity": number,
      "urgency": "low|medium|high|critical",
      "reasoning": "detailed explanation of recommendation",
      "estimatedRunoutDate": "YYYY-MM-DD",
      "suggestedOrderDate": "YYYY-MM-DD", 
      "costImpact": number
    }
  ],
  "summary": "Overall analysis and key insights"
}

Consider:
1. Current stock levels vs usage patterns
2. Lead times and reorder points
3. Seasonal trends and demand forecasting  
4. Cost optimization opportunities
5. Risk of stockouts vs holding costs
`;
}

/**
 * Get seasonal trend analysis for materials
 */
export async function getSeasonalTrends(materialId: string): Promise<any> {
  try {
    // This would analyze historical seasonal patterns
    // For now, return basic trend analysis
    return {
      materialId,
      trends: {
        spring: 'high_demand',
        summer: 'medium_demand', 
        fall: 'high_demand',
        winter: 'low_demand'
      },
      recommendation: 'Stock up before spring and fall seasons'
    };
  } catch (error) {
    log(`Error getting seasonal trends: ${error}`, "aiMaterialOrderingService");
    throw error;
  }
}
