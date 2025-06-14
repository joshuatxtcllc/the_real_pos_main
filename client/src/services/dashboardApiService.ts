import { apiRequest } from '@/lib/queryClient';

// Dashboard API service for external integrations
class DashboardApiService {
  // Check if dashboard API is configured by checking server config
  static async isDashboardConfigured(): Promise<boolean> {
    try {
      const config = await apiRequest('GET', '/api/dashboard/config');
      return config.configured || false;
    } catch (error) {
      return false;
    }
  }

  // Get dashboard metrics from external API via proxy
  static async getDashboardMetrics() {
    try {
      return await apiRequest('GET', '/api/dashboard-proxy/metrics');
    } catch (error) {
      console.error('Failed to fetch dashboard metrics:', error);
      throw error;
    }
  }

  // Get dashboard status from external API via proxy
  static async getDashboardStatus() {
    try {
      return await apiRequest('GET', '/api/dashboard-proxy/status');
    } catch (error) {
      console.error('Failed to fetch dashboard status:', error);
      throw error;
    }
  }

  // Send order data to external dashboard via proxy
  static async sendOrderToDashboard(orderData: any) {
    try {
      return await apiRequest('POST', '/api/dashboard-proxy/orders', orderData);
    } catch (error) {
      console.error('Failed to send order to dashboard:', error);
      throw error;
    }
  }

  // Get dashboard configuration from server
  static async getDashboardConfig() {
    try {
      return await apiRequest('GET', '/api/dashboard/config');
    } catch (error) {
      console.error('Failed to fetch dashboard config:', error);
      throw error;
    }
  }

  // Send order update to external dashboard via proxy
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

  // Test connection to dashboard API
  static async testConnection() {
    try {
      return await apiRequest('POST', '/api/dashboard-proxy/test');
    } catch (error) {
      console.error('Failed to test dashboard connection:', error);
      throw error;
    }
  }
}

export { DashboardApiService };