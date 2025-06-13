
import { apiRequest } from '@/lib/queryClient';

// Dashboard API service for external integrations
class DashboardApiService {
  // Get dashboard API URL from environment variables
  private static getDashboardApiUrl(): string | null {
    return import.meta.env.VITE_DASHBOARD_API_URL || null;
  }

  // Check if dashboard API is configured
  static isDashboardConfigured(): boolean {
    return !!this.getDashboardApiUrl();
  }

  // Get dashboard metrics from external API
  static async getDashboardMetrics() {
    try {
      // Use proxy endpoint to avoid CORS issues
      return await apiRequest('GET', '/api/dashboard-proxy/metrics');
    } catch (error) {
      console.error('Failed to fetch dashboard metrics:', error);
      throw error;
    }
  }

  // Get dashboard status from external API
  static async getDashboardStatus() {
    try {
      return await apiRequest('GET', '/api/dashboard-proxy/status');
    } catch (error) {
      console.error('Failed to fetch dashboard status:', error);
      throw error;
    }
  }

  // Send order data to external dashboard
  static async sendOrderToDashboard(orderData: any) {
    try {
      return await apiRequest('POST', '/api/dashboard-proxy/orders', orderData);
    } catch (error) {
      console.error('Failed to send order to dashboard:', error);
      throw error;
    }
  }

  // Get dashboard configuration
  static async getDashboardConfig() {
    try {
      return await apiRequest('GET', '/api/dashboard/config');
    } catch (error) {
      console.error('Failed to fetch dashboard config:', error);
      throw error;
    }
  }

  // Send order update to external dashboard
  static async updateOrderInDashboard(orderId: string, updateData: any) {
    try {
      return await apiRequest('PUT', `/api/dashboard-proxy/orders/${orderId}`, updateData);
    } catch (error) {
      console.error('Failed to update order in dashboard:', error);
      throw error;
    }
  }

  // Get external dashboard health status
  static async getExternalHealth() {
    try {
      return await apiRequest('GET', '/api/dashboard-proxy/health');
    } catch (error) {
      console.error('Failed to check external dashboard health:', error);
      throw error;
    }
  }
}

export { DashboardApiService };
