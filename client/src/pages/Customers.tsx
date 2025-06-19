import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useLocation, Link } from 'wouter';
import { Plus, Edit, Eye, Phone, Mail, MapPin, Search, Filter } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Customer } from '@shared/schema';

const Customers = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = useState(false);
  const [_, setLocation] = useLocation();

  // New customer form state
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Fetch customers
  const { data: customers, isLoading, isError } = useQuery({
    queryKey: ['/api/customers'],
    staleTime: 30000,
  });

  // Create customer mutation
  const createCustomerMutation = useMutation({
    mutationFn: async (customerData: typeof newCustomer) => {
      const response = await apiRequest('POST', '/api/customers', customerData);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      setIsNewCustomerDialogOpen(false);
      setNewCustomer({ name: '', email: '', phone: '', address: '' });
      toast({
        title: "Customer Created",
        description: `Customer ${data.name} has been created successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create customer",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Customer name is required",
        variant: "destructive",
      });
      return;
    }
    createCustomerMutation.mutate(newCustomer);
  };

  // Filter customers based on search term
  const filteredCustomers = Array.isArray(customers) ? customers.filter((customer: Customer) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      (customer.email && customer.email.toLowerCase().includes(searchLower)) ||
      (customer.phone && customer.phone.includes(searchTerm))
    );
  }) : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading customers...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-600">
          <p>Error loading customers. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer database and contact information
          </p>
        </div>
        <Dialog open={isNewCustomerDialogOpen} onOpenChange={setIsNewCustomerDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Create a new customer record for your framing business
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter customer's full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="customer@email.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Main St, City, State 12345"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsNewCustomerDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createCustomerMutation.isPending}
                >
                  {createCustomerMutation.isPending ? "Creating..." : "Create Customer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? 'No customers match your search.' : 'No customers found.'}
              </p>
              {!searchTerm && (
                <Button 
                  className="mt-4"
                  onClick={() => setIsNewCustomerDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Customer
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer: Customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{customer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {customer.email && (
                            <div className="flex items-center space-x-1 text-sm">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span>{customer.email}</span>
                            </div>
                          )}
                          {customer.phone && (
                            <div className="flex items-center space-x-1 text-sm">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span>{customer.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {customer.address && (
                          <div className="flex items-center space-x-1 text-sm">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="max-w-xs truncate">{customer.address}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(customer.createdAt || '').toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setLocation(`/customers/${customer.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setLocation(`/customers/${customer.id}`)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;