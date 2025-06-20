import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Package, 
  Truck, 
  Check, 
  Clock, 
  AlertTriangle,
  Plus,
  ShoppingCart,
  FileText,
  ClipboardList,
  ArrowDownToLine
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMaterialsPickList, useUpdateMaterial, useCreatePurchaseOrder } from "@/hooks/use-materials";

// Status options for material orders
const ORDER_STATUSES = [
  { value: "pending", label: "Pending", color: "default" },
  { value: "ordered", label: "Ordered", color: "secondary" },
  { value: "received", label: "Received", color: "success" },
  { value: "backorder", label: "Back Ordered", color: "warning" },
  { value: "cancelled", label: "Cancelled", color: "destructive" },
];

// Stock status options
const STOCK_STATUSES = [
  { value: "in_stock", label: "In Stock", color: "success", icon: Check },
  { value: "low_stock", label: "Low Stock", color: "warning", icon: AlertTriangle },
  { value: "out_of_stock", label: "Out of Stock", color: "destructive", icon: AlertTriangle },
  { value: "unknown", label: "Check Stock", color: "default", icon: Clock }
];

// Material item interface
interface MaterialItem {
  id: string;
  orderIds: number[];
  name: string;
  sku: string;
  supplier: string;
  type: string;
  quantity: number;
  status: string;
  stockStatus?: "in_stock" | "low_stock" | "out_of_stock" | "unknown";
  stockQuantity?: number;
  orderDate?: string;
  receiveDate?: string;
  priority: "low" | "medium" | "high";
  notes?: string;
}

// Sort options
type SortField = "name" | "supplier" | "type" | "quantity" | "status" | "priority";

// Props for the component
interface MaterialsPickListProps {
  onCreateOrder?: () => void;
}

const MaterialsPickList: React.FC<MaterialsPickListProps> = ({ onCreateOrder }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSupplier, setFilterSupplier] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentTab, setCurrentTab] = useState("all");
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusDialogItem, setStatusDialogItem] = useState<MaterialItem | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  
  const { toast } = useToast();
  const { data: materials = [], isLoading, error } = useMaterialsPickList();
  const updateMaterialOrder = useUpdateMaterial();
  
  // State for admin approval dialog
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    materialIds: string[];
    status: string;
    alreadyOrderedMaterials: MaterialItem[];
  } | null>(null);
  
  // Calculate unique suppliers and material types for filters
  const suppliers = Array.from(new Set(materials.map(item => item.supplier)));
  const materialTypes = Array.from(new Set(materials.map(item => item.type)));
  
  // Filter and sort materials
  const filteredMaterials = materials.filter(item => {
    // Search filter
    const matchesSearch = searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Supplier filter
    const matchesSupplier = filterSupplier === null || item.supplier === filterSupplier;
    
    // Type filter
    const matchesType = filterType === null || item.type === filterType;
    
    // Status filter
    const matchesStatus = filterStatus === null || item.status === filterStatus;
    
    // Tab filter
    const matchesTab = 
      currentTab === "all" || 
      (currentTab === "pending" && item.status === "pending") ||
      (currentTab === "ordered" && item.status === "ordered") ||
      (currentTab === "received" && item.status === "received");
    
    return matchesSearch && matchesSupplier && matchesType && matchesStatus && matchesTab;
  }).sort((a, b) => {
    // Sort by selected field
    if (sortField === "name") {
      return sortDirection === "asc" 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortField === "supplier") {
      return sortDirection === "asc"
        ? a.supplier.localeCompare(b.supplier)
        : b.supplier.localeCompare(a.supplier);
    } else if (sortField === "type") {
      return sortDirection === "asc"
        ? a.type.localeCompare(b.type)
        : b.type.localeCompare(a.type);
    } else if (sortField === "quantity") {
      return sortDirection === "asc"
        ? a.quantity - b.quantity
        : b.quantity - a.quantity;
    } else if (sortField === "status") {
      return sortDirection === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    } else if (sortField === "priority") {
      const priorityValue = (p: string) => p === "high" ? 3 : p === "medium" ? 2 : 1;
      return sortDirection === "asc"
        ? priorityValue(a.priority) - priorityValue(b.priority)
        : priorityValue(b.priority) - priorityValue(a.priority);
    }
    return 0;
  });
  
  // Toggle select all items
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredMaterials.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredMaterials.map(item => item.id));
    }
  };
  
  // Toggle selection for single item
  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };
  
  // Handle sort by field
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and reset direction
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Enhanced bulk update with failsafe mechanism
  const handleBulkUpdate = async (status: string, adminApproval = false) => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select materials to update.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/materials/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialIds: selectedItems,
          status,
          adminApproval
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'DOUBLE_ORDER_PREVENTION') {
          // Show admin approval dialog
          setPendingAction({
            materialIds: selectedItems,
            status,
            alreadyOrderedMaterials: data.alreadyOrderedMaterials
          });
          setIsAdminDialogOpen(true);
          return;
        }
        throw new Error(data.message || 'Failed to update materials');
      }

      toast({
        title: "Success",
        description: data.message,
        variant: "default"
      });

      // Clear selection and refresh data
      setSelectedItems([]);
      window.location.reload(); // Simple refresh for now

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Handle admin approval for double ordering
  const handleAdminApproval = async () => {
    if (!pendingAction) return;

    await handleBulkUpdate(pendingAction.status, true);
    setIsAdminDialogOpen(false);
    setPendingAction(null);
  };

  // Generate materials for all existing orders
  const generateMaterialsForAllOrders = async () => {
    try {
      const response = await fetch('/api/orders/generate-all-materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Materials Generated",
          description: `Created ${data.totalMaterialOrders} material orders from ${data.processedOrders} orders`,
        });
        window.location.reload(); // Refresh to show new materials
      } else {
        throw new Error(data.error || 'Failed to generate materials');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to generate materials from orders",
        variant: "destructive",
      });
    }
  };

  // Update stock status for an item
  const updateStockStatus = async (itemId: string, stockStatus: string, stockQuantity?: number) => {
    try {
      await updateMaterialOrder.mutateAsync({
        id: itemId,
        data: { 
          stockStatus,
          stockQuantity: stockQuantity?.toString() || '0'
        }
      });

      toast({
        title: "Stock status updated",
        description: `Material stock status updated`,
      });

      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stock status",
        variant: "destructive",
      });
    }
  };

  // Render stock status badge
  const renderStockStatus = (item: MaterialItem) => {
    const stockStatus = STOCK_STATUSES.find(s => s.value === (item.stockStatus || 'unknown'));
    const Icon = stockStatus?.icon || Clock;
    
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-1 h-6 px-2">
              <Icon className="h-3 w-3" />
              {stockStatus?.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {STOCK_STATUSES.map(status => (
              <DropdownMenuItem 
                key={status.value}
                onClick={() => updateStockStatus(item.id, status.value)}
                className="flex items-center gap-2"
              >
                <status.icon className="h-3 w-3" />
                {status.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {item.stockQuantity && (
          <span className="text-sm text-muted-foreground">
            Qty: {item.stockQuantity}
          </span>
        )}
      </div>
    );
  };

  // Mark materials as out of stock
  const handleMarkOutOfStock = async (notes = "") => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select materials to mark as out of stock.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/materials/mark-out-of-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialIds: selectedItems,
          notes
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to mark materials as out of stock');
      }

      toast({
        title: "Success",
        description: data.message,
        variant: "default"
      });

      setSelectedItems([]);
      window.location.reload();

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  // Open status change dialog
  const openStatusDialog = (item: MaterialItem) => {
    setStatusDialogItem(item);
    setNewStatus(item.status);
    setStatusNotes(item.notes || "");
    setIsStatusDialogOpen(true);
  };
  
  // Update status for item
  const updateItemStatus = () => {
    if (!statusDialogItem || !newStatus) return;
    
    updateMaterialOrder.mutate(
      { 
        id: statusDialogItem.id, 
        data: {
          status: newStatus,
          notes: statusNotes,
          orderDate: newStatus === "ordered" ? new Date().toISOString() : statusDialogItem.orderDate,
          receiveDate: newStatus === "received" ? new Date().toISOString() : statusDialogItem.receiveDate
        }
      },
      {
        onSuccess: () => {
          toast({
            title: "Status updated",
            description: `Material "${statusDialogItem.name}" is now ${ORDER_STATUSES.find(s => s.value === newStatus)?.label || newStatus}`,
          });
          setIsStatusDialogOpen(false);
        },
        onError: (error) => {
          toast({
            title: "Error updating status",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    );
  };
  
  // Bulk update selected items status
  const bulkUpdateStatus = (status: string) => {
    if (selectedItems.length === 0) return;
    
    Promise.all(
      selectedItems.map(id => {
        const item = materials.find(m => m.id === id);
        if (!item) return Promise.resolve();
        
        return updateMaterialOrder.mutateAsync({
          id,
          data: {
            status,
            orderDate: status === "ordered" ? new Date().toISOString() : item.orderDate,
            receiveDate: status === "received" ? new Date().toISOString() : item.receiveDate
          }
        });
      })
    ).then(() => {
      toast({
        title: "Bulk update complete",
        description: `Updated ${selectedItems.length} items to ${ORDER_STATUSES.find(s => s.value === status)?.label || status}`,
      });
      setSelectedItems([]);
    }).catch(error => {
      toast({
        title: "Error in bulk update",
        description: error.message,
        variant: "destructive",
      });
    });
  };
  
  // Generate status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = ORDER_STATUSES.find(s => s.value === status) || ORDER_STATUSES[0];
    return (
      <Badge variant={statusConfig.color as any}>{statusConfig.label}</Badge>
    );
  };

  // Generate priority badge
  const getPriorityBadge = (priority: "low" | "medium" | "high") => {
    let color;
    switch (priority) {
      case "high":
        color = "destructive";
        break;
      case "medium":
        color = "warning";
        break;
      default:
        color = "outline";
    }
    return <Badge variant={color as any}>{priority}</Badge>;
  };
  
  // Create purchase order from selected items
  const createPurchaseOrderMutation = useCreatePurchaseOrder();
  
  const createPurchaseOrder = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to create a purchase order",
        variant: "destructive",
      });
      return;
    }
    
    // Create purchase order with selected items
    createPurchaseOrderMutation.mutate(
      { 
        materialIds: selectedItems,
        expectedDeliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
      },
      {
        onSuccess: () => {
          // Update all selected items to "ordered" status
          handleBulkUpdate("ordered");
          
          // Call the onCreateOrder callback if provided
          if (onCreateOrder) {
            onCreateOrder();
          }
        }
      }
    );
  };


  
  // Export pick list 
  const exportPickList = () => {
    const itemsToExport = selectedItems.length > 0 
      ? materials.filter(item => selectedItems.includes(item.id))
      : filteredMaterials;
      
    if (itemsToExport.length === 0) {
      toast({
        title: "No items to export",
        description: "The current filtered list is empty",
        variant: "destructive",
      });
      return;
    }
    
    // Create CSV content
    const headers = ["SKU", "Name", "Supplier", "Type", "Quantity", "Status", "Priority", "Notes"];
    const rows = itemsToExport.map(item => [
      item.sku,
      item.name,
      item.supplier,
      item.type,
      item.quantity.toString(),
      ORDER_STATUSES.find(s => s.value === item.status)?.label || item.status,
      item.priority,
      item.notes || ""
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `materials-pick-list-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Pick list exported",
      description: `Exported ${itemsToExport.length} items to CSV file`,
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Materials Pick List</h2>
          <p className="text-muted-foreground">
            Track and manage materials needed for orders
          </p>
        </div>
        
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button 
            variant="outline" 
            onClick={exportPickList}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Export
          </Button>
          
          {/* Enhanced one-click ordering buttons */}
          <Button 
            onClick={() => handleBulkUpdate("ordered")}
            disabled={selectedItems.length === 0}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4" />
            Mark as Ordered
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => handleMarkOutOfStock()}
            disabled={selectedItems.length === 0}
            className="flex items-center gap-2 border-red-500 text-red-600 hover:bg-red-50"
          >
            <AlertTriangle className="h-4 w-4" />
            Out of Stock
          </Button>
          
          <Button 
            onClick={createPurchaseOrder}
            disabled={selectedItems.length === 0}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Create Purchase Order
          </Button>
          
          <Button 
            onClick={generateMaterialsForAllOrders}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Generate Materials from Orders
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search materials, SKUs, or suppliers..."
            className="pl-8"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Supplier
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterSupplier(null)}>
                All Suppliers
              </DropdownMenuItem>
              {suppliers.map(supplier => (
                <DropdownMenuItem 
                  key={supplier}
                  onClick={() => setFilterSupplier(supplier)}
                >
                  {supplier}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Type
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterType(null)}>
                All Types
              </DropdownMenuItem>
              {materialTypes.map(type => (
                <DropdownMenuItem 
                  key={type}
                  onClick={() => setFilterType(type)}
                >
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Status
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterStatus(null)}>
                All Statuses
              </DropdownMenuItem>
              {ORDER_STATUSES.map(status => (
                <DropdownMenuItem 
                  key={status.value}
                  onClick={() => setFilterStatus(status.value)}
                >
                  {status.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            All Materials
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending
          </TabsTrigger>
          <TabsTrigger value="ordered" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Ordered
          </TabsTrigger>
          <TabsTrigger value="received" className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Received
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Card>
        <CardContent className="p-0">
          {error ? (
            <div className="text-center py-12">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-4 text-lg font-semibold text-red-600">Error loading materials</h3>
              <p className="text-muted-foreground">
                {error instanceof Error ? error.message : 'Unable to load materials pick list. Please try again.'}
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No materials found</h3>
              <p className="text-muted-foreground">
                {searchQuery || filterSupplier || filterType || filterStatus
                  ? "Try adjusting your filters"
                  : "No materials in the pick list"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={
                          filteredMaterials.length > 0 && 
                          selectedItems.length === filteredMaterials.length
                        }
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead className="w-[180px]">
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("name")}
                      >
                        Material
                        {sortField === "name" && (
                          <ChevronDown 
                            className={`h-4 w-4 ml-1 ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            } transition-transform`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("supplier")}
                      >
                        Supplier
                        {sortField === "supplier" && (
                          <ChevronDown 
                            className={`h-4 w-4 ml-1 ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            } transition-transform`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("type")}
                      >
                        Type
                        {sortField === "type" && (
                          <ChevronDown 
                            className={`h-4 w-4 ml-1 ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            } transition-transform`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">
                      <div 
                        className="flex items-center justify-end cursor-pointer"
                        onClick={() => handleSort("quantity")}
                      >
                        Quantity
                        {sortField === "quantity" && (
                          <ChevronDown 
                            className={`h-4 w-4 ml-1 ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            } transition-transform`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("priority")}
                      >
                        Priority
                        {sortField === "priority" && (
                          <ChevronDown 
                            className={`h-4 w-4 ml-1 ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            } transition-transform`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("status")}
                      >
                        Order Status
                        {sortField === "status" && (
                          <ChevronDown 
                            className={`h-4 w-4 ml-1 ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            } transition-transform`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Stock Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => toggleSelectItem(item.id)}
                          aria-label={`Select ${item.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">SKU: {item.sku}</div>
                      </TableCell>
                      <TableCell>{item.supplier}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>{renderStockStatus(item)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openStatusDialog(item)}
                        >
                          <ArrowDownToLine className="h-4 w-4" />
                          <span className="sr-only">Update status</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {selectedItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex items-center justify-between shadow-lg">
          <div>
            <span className="font-medium">{selectedItems.length} items selected</span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedItems([])}
            >
              Clear Selection
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  Update Status
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {ORDER_STATUSES.map(status => (
                  <DropdownMenuItem 
                    key={status.value}
                    onClick={() => handleBulkUpdate(status.value)}
                  >
                    {status.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
      
      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Material Status</DialogTitle>
            <DialogDescription>
              Change the status and add notes for this material.
            </DialogDescription>
          </DialogHeader>
          
          {statusDialogItem && (
            <div className="space-y-4 py-2">
              <div>
                <h4 className="font-medium">{statusDialogItem.name}</h4>
                <p className="text-sm text-muted-foreground">SKU: {statusDialogItem.sku}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <div className="grid grid-cols-1 gap-2">
                  {ORDER_STATUSES.map(status => (
                    <div 
                      key={status.value} 
                      className={`
                        flex items-center space-x-2 rounded-md border p-2 cursor-pointer
                        ${newStatus === status.value ? 'border-primary' : ''}
                      `}
                      onClick={() => setNewStatus(status.value)}
                    >
                      <Checkbox 
                        checked={newStatus === status.value}
                        onCheckedChange={() => setNewStatus(status.value)}
                      />
                      <div className="flex flex-1 items-center justify-between">
                        <span>{status.label}</span>
                        {getStatusBadge(status.value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea 
                  className="w-full h-24 p-2 rounded-md border"
                  placeholder="Add notes about this order..."
                  value={statusNotes}
                  onChange={e => setStatusNotes(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={updateItemStatus}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin Approval Dialog for Double-Order Prevention */}
      <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 font-bold">
              ⚠️ DOUBLE ORDER PREVENTION ALERT
            </DialogTitle>
            <DialogDescription className="text-red-700">
              Some materials are already ordered. Admin approval required to proceed.
            </DialogDescription>
          </DialogHeader>
          
          {pendingAction && (
            <div className="space-y-4 py-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">
                  Already Ordered Materials:
                </h4>
                <ul className="space-y-1">
                  {pendingAction.alreadyOrderedMaterials.map(material => (
                    <li key={material.id} className="text-sm text-red-700">
                      • {material.name} (SKU: {material.sku}) - Status: {material.status}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  Action Requested:
                </h4>
                <p className="text-sm text-yellow-700">
                  Mark {pendingAction.materialIds.length} materials as "{pendingAction.status}"
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Admin Override Options:
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Approve if duplicate ordering is intentional</li>
                  <li>• Cancel if this was an error</li>
                  <li>• Review material status before proceeding</li>
                </ul>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAdminDialogOpen(false);
                setPendingAction(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleAdminApproval}
              className="bg-red-600 hover:bg-red-700"
            >
              Admin Approve Override
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaterialsPickList;