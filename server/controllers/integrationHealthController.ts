
import { Request, Response } from 'express';
import { db } from '../db';
import { circuitBreakers } from '../middleware/circuitBreaker';
import { structuredLogger } from '../utils/logger';

interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  error?: string;
  circuitBreakerState?: string;
}

async function checkDatabase(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    await db.execute('SELECT 1');
    return {
      service: 'database',
      status: 'healthy',
      responseTime: Date.now() - start,
      circuitBreakerState: circuitBreakers.database.getState().state
    };
  } catch (error) {
    return {
      service: 'database',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      error: (error as Error).message,
      circuitBreakerState: circuitBreakers.database.getState().state
    };
  }
}

async function checkOpenAI(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    // Simple test - just check if we can create a client
    if (!process.env.OPENAI_API_KEY) {
      return {
        service: 'openai',
        status: 'degraded',
        responseTime: Date.now() - start,
        error: 'API key not configured',
        circuitBreakerState: circuitBreakers.openai.getState().state
      };
    }
    
    return {
      service: 'openai',
      status: 'healthy',
      responseTime: Date.now() - start,
      circuitBreakerState: circuitBreakers.openai.getState().state
    };
  } catch (error) {
    return {
      service: 'openai',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      error: (error as Error).message,
      circuitBreakerState: circuitBreakers.openai.getState().state
    };
  }
}

async function checkStripe(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return {
        service: 'stripe',
        status: 'degraded',
        responseTime: Date.now() - start,
        error: 'API key not configured',
        circuitBreakerState: circuitBreakers.stripe.getState().state
      };
    }
    
    return {
      service: 'stripe',
      status: 'healthy',
      responseTime: Date.now() - start,
      circuitBreakerState: circuitBreakers.stripe.getState().state
    };
  } catch (error) {
    return {
      service: 'stripe',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      error: (error as Error).message,
      circuitBreakerState: circuitBreakers.stripe.getState().state
    };
  }
}

async function checkSupabase(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return {
        service: 'supabase',
        status: 'degraded',
        responseTime: Date.now() - start,
        error: 'Configuration missing',
        circuitBreakerState: circuitBreakers.supabase.getState().state
      };
    }
    
    return {
      service: 'supabase',
      status: 'healthy',
      responseTime: Date.now() - start,
      circuitBreakerState: circuitBreakers.supabase.getState().state
    };
  } catch (error) {
    return {
      service: 'supabase',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      error: (error as Error).message,
      circuitBreakerState: circuitBreakers.supabase.getState().state
    };
  }
}

export async function getIntegrationHealth(req: Request, res: Response) {
  try {
    const checks = await Promise.all([
      checkDatabase(),
      checkOpenAI(),
      checkStripe(),
      checkSupabase()
    ]);

    const overallStatus = checks.every(c => c.status === 'healthy') ? 'healthy' :
                         checks.some(c => c.status === 'unhealthy') ? 'unhealthy' : 'degraded';

    const response = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks,
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version
      }
    };

    structuredLogger.info('Health check completed', {
      operation: 'health_check',
      status: overallStatus,
      unhealthyServices: checks.filter(c => c.status === 'unhealthy').map(c => c.service)
    });

    res.status(overallStatus === 'healthy' ? 200 : 503).json(response);
  } catch (error) {
    structuredLogger.error('Health check failed', {
      error: error as Error,
      severity: 'high',
      operation: 'health_check'
    });

    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check system failure'
    });
  }
}
