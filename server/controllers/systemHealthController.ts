
import { Request, Response } from 'express';
import { circuitBreakers } from '../middleware/circuitBreaker';
import { structuredLogger } from '../utils/logger';
import { storage } from '../storage';
import { cache } from '../services/cachingService';

interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  error?: string;
  details?: any;
}

export async function getSystemHealth(req: Request, res: Response) {
  const startTime = Date.now();
  const checks: HealthCheck[] = [];

  // Database health
  try {
    const dbStart = Date.now();
    await storage.getFrames(); // Simple query
    checks.push({
      service: 'database',
      status: 'healthy',
      responseTime: Date.now() - dbStart
    });
  } catch (error) {
    checks.push({
      service: 'database',
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: (error as Error).message
    });
  }

  // Cache health
  try {
    const cacheStart = Date.now();
    await cache.set('health-check', 'ok', 1000);
    const cacheValue = await cache.get('health-check');
    checks.push({
      service: 'cache',
      status: cacheValue === 'ok' ? 'healthy' : 'degraded',
      responseTime: Date.now() - cacheStart
    });
  } catch (error) {
    checks.push({
      service: 'cache',
      status: 'degraded',
      responseTime: Date.now() - startTime,
      error: (error as Error).message
    });
  }

  // Circuit breaker states
  const circuitBreakerStates = {
    database: circuitBreakers.database.getState(),
    openai: circuitBreakers.openai.getState(),
    stripe: circuitBreakers.stripe.getState(),
    supabase: circuitBreakers.supabase.getState()
  };

  // Overall status
  const hasUnhealthy = checks.some(check => check.status === 'unhealthy');
  const hasDegraded = checks.some(check => check.status === 'degraded');
  
  const overallStatus = hasUnhealthy ? 'unhealthy' : 
                       hasDegraded ? 'degraded' : 'healthy';

  const response = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    responseTime: Date.now() - startTime,
    checks,
    circuitBreakers: circuitBreakerStates,
    system: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development'
    }
  };

  // Log health check results
  structuredLogger.info('System health check completed', {
    operation: 'systemHealthCheck',
    status: overallStatus,
    responseTime: response.responseTime,
    failedServices: checks.filter(c => c.status !== 'healthy').map(c => c.service)
  });

  res.status(overallStatus === 'healthy' ? 200 : 503).json(response);
}

export async function getQuickHealth(req: Request, res: Response) {
  // Quick health check for load balancers
  try {
    const start = Date.now();
    await storage.getFrames();
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - start
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    });
  }
}
