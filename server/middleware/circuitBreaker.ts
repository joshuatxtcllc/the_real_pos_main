
interface CircuitBreakerState {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failureCount: number;
  lastFailureTime: number;
  successCount: number;
}

class CircuitBreaker {
  private state: CircuitBreakerState;
  private readonly failureThreshold: number;
  private readonly resetTimeout: number;
  private readonly successThreshold: number;

  constructor(
    private name: string,
    failureThreshold = 5,
    resetTimeout = 60000,
    successThreshold = 3
  ) {
    this.state = {
      state: 'CLOSED',
      failureCount: 0,
      lastFailureTime: 0,
      successCount: 0
    };
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
    this.successThreshold = successThreshold;
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state.state === 'OPEN') {
      if (Date.now() - this.state.lastFailureTime > this.resetTimeout) {
        this.state.state = 'HALF_OPEN';
        this.state.successCount = 0;
        console.log(`Circuit breaker ${this.name} transitioning to HALF_OPEN`);
      } else {
        throw new Error(`Circuit breaker ${this.name} is OPEN - operation blocked`);
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.state.failureCount = 0;
    
    if (this.state.state === 'HALF_OPEN') {
      this.state.successCount++;
      if (this.state.successCount >= this.successThreshold) {
        this.state.state = 'CLOSED';
        console.log(`Circuit breaker ${this.name} transitioning to CLOSED`);
      }
    }
  }

  private onFailure(): void {
    this.state.failureCount++;
    this.state.lastFailureTime = Date.now();

    if (this.state.failureCount >= this.failureThreshold) {
      this.state.state = 'OPEN';
      console.error(`Circuit breaker ${this.name} transitioning to OPEN after ${this.state.failureCount} failures`);
    }
  }

  getState(): CircuitBreakerState {
    return { ...this.state };
  }
}

// Circuit breakers for each integration point
export const circuitBreakers = {
  database: new CircuitBreaker('Database', 3, 30000),
  openai: new CircuitBreaker('OpenAI', 5, 60000),
  stripe: new CircuitBreaker('Stripe', 3, 45000),
  supabase: new CircuitBreaker('Supabase', 4, 30000),
  larsonApi: new CircuitBreaker('Larson API', 5, 120000),
  twilio: new CircuitBreaker('Twilio', 3, 30000)
};

export { CircuitBreaker };
