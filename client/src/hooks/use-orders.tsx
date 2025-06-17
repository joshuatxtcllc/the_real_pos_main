import { useToast } from '@/hooks/use-toast';
import { Order, InsertOrder } from '@shared/schema';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

export function useOrders() {
  const { toast } = useToast();

  // Get all orders
  const ordersQuery = useQuery({
    queryKey: ['/api/orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders');
      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await res.json();
      console.log('Orders API response:', data);
      // Return the orders array directly for consistent handling
      return data.orders || data || [];
    },
  });

  // Get a specific order
  const getOrder = (orderId: number) => {
    return useQuery({
      queryKey: ['/api/orders', orderId],
      queryFn: async () => {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch order');
        }
        return res.json();
      },
      enabled: !!orderId,
    });
  };

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const res = await apiRequest('POST', '/api/orders', orderData);
      return res;
    },
    onSuccess: (response) => {
      toast({
        title: 'Order created successfully! 🎉',
        description: `Order #${response.order?.id || response.orderId} has been created`,
      });
      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/production/kanban'] });
      queryClient.invalidateQueries({ queryKey: ['/api/order-groups'] });
      // Force refetch to ensure orders appear immediately
      queryClient.refetchQueries({ queryKey: ['/api/orders'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create order',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update order mutation (for editing frame specs, etc)
  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, data, recalculatePricing = true }: { 
      id: number, 
      data: Partial<Order>,
      recalculatePricing?: boolean 
    }) => {
      // Include a flag to indicate if pricing should be recalculated based on new dimensions
      const res = await apiRequest('PATCH', `/api/orders/${id}`, {
        ...data,
        recalculatePricing
      });
      return res;
    },
    onSuccess: () => {
      toast({
        title: 'Order updated',
        description: 'The order has been successfully updated',
      });
      // Invalidate relevant queries to refresh the data across the system
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/production/kanban'] });
      queryClient.invalidateQueries({ queryKey: ['/api/materials/pick-list'] });
      queryClient.invalidateQueries({ queryKey: ['/api/order-groups'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update order',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    orders: ordersQuery.data,
    isLoading: ordersQuery.isLoading,
    error: ordersQuery.error,
    getOrder,
    createOrder: createOrderMutation.mutate,
    createOrderAsync: createOrderMutation.mutateAsync,
    isCreatingOrder: createOrderMutation.isPending,
    updateOrder: updateOrderMutation.mutate,
    isUpdatingOrder: updateOrderMutation.isPending,
  };
}