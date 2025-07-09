
import { circuitBreakers } from '../middleware/circuitBreaker';
import { structuredLogger } from '../utils/logger';

interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions,
  context: string
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === options.maxRetries) {
        structuredLogger.error(`Operation failed after ${options.maxRetries} retries`, {
          error: lastError,
          severity: 'high',
          operation: context,
          attempts: attempt + 1
        });
        throw lastError;
      }
      
      const delay = Math.min(
        options.baseDelay * Math.pow(2, attempt),
        options.maxDelay
      );
      
      structuredLogger.warn(`Retry attempt ${attempt + 1} for ${context}`, {
        error: lastError.message,
        nextRetryIn: delay,
        operation: context
      });
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = { maxRetries: 3, baseDelay: 1000, maxDelay: 10000 },
  context?: string
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt < config.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === config.maxRetries - 1) {
        structuredLogger.error(`Operation failed after ${config.maxRetries} attempts`, {
          error: lastError,
          severity: 'medium',
          operation: context,
          attempts: config.maxRetries
        });
        break;
      }
      
      const delay = Math.min(
        config.baseDelay * Math.pow(2, attempt),
        config.maxDelay
      );
      
      structuredLogger.warn(`Retry attempt ${attempt + 1}/${config.maxRetries} in ${delay}ms`, {
        operation: context,
        error: lastError.message
      });
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

// Safe OpenAI wrapper
export async function safeOpenAICall<T>(
  operation: () => Promise<T>,
  fallback: () => T,
  context: string
): Promise<T> {
  try {
    return await circuitBreakers.openai.execute(async () => {
      return await withRetry(operation, { maxRetries: 2, baseDelay: 1000, maxDelay: 5000 }, `openai.${context}`);
    });
  } catch (error) {
    structuredLogger.error(`OpenAI call failed, using fallback`, {
      error: error as Error,
      severity: 'medium',
      integration: 'openai',
      operation: context
    });
    return fallback();
  }
}

// Safe Stripe wrapper
export async function safeStripeCall<T>(
  operation: () => Promise<T>,
  context: string
): Promise<T> {
  return await circuitBreakers.stripe.execute(async () => {
    return await withRetry(operation, { maxRetries: 3, baseDelay: 2000, maxDelay: 8000 }, `stripe.${context}`);
  });
}

// Safe Supabase wrapper
export async function safeSupabaseCall<T>(
  operation: () => Promise<T>,
  fallback: () => T,
  context: string
): Promise<T> {
  try {
    return await circuitBreakers.supabase.execute(async () => {
      return await withRetry(operation, { maxRetries: 2, baseDelay: 1000, maxDelay: 4000 }, `supabase.${context}`);
    });
  } catch (error) {
    structuredLogger.error(`Supabase call failed, using fallback`, {
      error: error as Error,
      severity: 'medium',
      integration: 'supabase',
      operation: context
    });
    return fallback();
  }
}

// Safe Twilio wrapper
export async function safeTwilioCall<T>(
  operation: () => Promise<T>,
  context: string
): Promise<T> {
  return await circuitBreakers.twilio.execute(async () => {
    return await withRetry(operation, { maxRetries: 2, baseDelay: 2000, maxDelay: 6000 }, `twilio.${context}`);
  });
}
