import { useState, useEffect } from 'react';
import { 
  Search,
  Filter,
  Download,
  Mail,
  Trash2,
  Edit,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

// Mock data for subscribers
const mockSubscribers = Array.from({ length: 25 }, (_, i) => ({
  id: `sub-${i + 1}`,
  email: `subscriber${i + 1}@example.com`,
  phone: i % 3 === 0 ? null : `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
  subscriptionTier: i % 4 === 0 ? 'free' : i % 4 === 1 ? 'daily' : i % 4 === 2 ? 'weekly' : 'monthly',
  isActive: i % 7 !== 0,
  communicationPreferences: {
    email: true,
    sms: i % 3 !== 0,
  },
  lastPaymentDate: i % 4 !== 0 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
  createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
}));

type Subscriber = typeof mockSubscribers[0];

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingSubscriber, setEditingSubscriber] = useState<Subscriber | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const itemsPerPage = 10;
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, tierFilter, statusFilter, subscribers]);

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch data from the API
      // const response = await fetch('/api/admin/subscribers', {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      //   },
      // });
      // const data = await response.json();
      // setSubscribers(data);
      
      // For now, use mock data with a simulated delay
      setTimeout(() => {
        setSubscribers(mockSubscribers);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subscribers',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...subscribers];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        subscriber => 
          subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (subscriber.phone && subscriber.phone.includes(searchTerm))
      );
    }
    
    // Apply tier filter
    if (tierFilter !== 'all') {
      filtered = filtered.filter(
        subscriber => subscriber.subscriptionTier === tierFilter
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        subscriber => 
          (statusFilter === 'active' && subscriber.isActive) ||
          (statusFilter === 'inactive' && !subscriber.isActive)
      );
    }
    
    setFilteredSubscribers(filtered);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentPageSubscribers = getCurrentPageSubscribers().map(sub => sub.id);
      setSelectedSubscribers(currentPageSubscribers);
    } else {
      setSelectedSubscribers([]);
    }
  };

  const handleSelectSubscriber = (subscriberId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubscribers([...selectedSubscribers, subscriberId]);
    } else {
      setSelectedSubscribers(selectedSubscribers.filter(id => id !== subscriberId));
    }
  };

  const handleDeleteSelected = async () => {
    try {
      // In a real implementation, this would call the API to delete subscribers
      // await fetch('/api/admin/subscribers/bulk-action', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     action: 'delete',
      //     subscriberIds: selectedSubscribers,
      //   }),
      // });
      
      // For now, simulate deletion by filtering out selected subscribers
      const updatedSubscribers = subscribers.filter(
        subscriber => !selectedSubscribers.includes(subscriber.id)
      );
      setSubscribers(updatedSubscribers);
      setSelectedSubscribers([]);
      
      toast({
        title: 'Success',
        description: `${selectedSubscribers.length} subscriber(s) deleted successfully.`,
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting subscribers:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete subscribers',
        variant: 'destructive',
      });
    }
  };

  const handleEditSubscriber = (subscriber: Subscriber) => {
    setEditingSubscriber({ ...subscriber });
    setIsEditDialogOpen(true);
  };

  const handleUpdateSubscriber = async () => {
    if (!editingSubscriber) return;
    
    try {
      // In a real implementation, this would call the API to update the subscriber
      // await fetch(`/api/admin/subscribers/${editingSubscriber.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(editingSubscriber),
      // });
      
      // For now, update the subscriber in the local state
      const updatedSubscribers = subscribers.map(subscriber => 
        subscriber.id === editingSubscriber.id ? editingSubscriber : subscriber
      );
      setSubscribers(updatedSubscribers);
      
      toast({
        title: 'Success',
        description: 'Subscriber updated successfully.',
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating subscriber:', error);
      toast({
        title: 'Error',
        description: 'Failed to update subscriber',
        variant: 'destructive',
      });
    }
  };

  const handleExportSubscribers = async () => {
    setIsExporting(true);
    try {
      // In a real implementation, this would call the API to export subscribers
      // const response = await fetch('/api/admin/subscribers/export', {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      //   },
      // });
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'subscribers.csv';
      // document.body.appendChild(a);
      // a.click();
      // window.URL.revokeObjectURL(url);
      
      // For now, just show a toast message
      setTimeout(() => {
        toast({
          title: 'Export Complete',
          description: 'Subscribers exported successfully.',
        });
        setIsExporting(false);
      }, 1000);
    } catch (error) {
      console.error('Error exporting subscribers:', error);
      toast({
        title: 'Error',
        description: 'Failed to export subscribers',
        variant: 'destructive',
      });
      setIsExporting(false);
    }
  };

  const getCurrentPageSubscribers = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSubscribers.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subscribers</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={selectedSubscribers.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
          <Button
            variant="outline"
            onClick={handleExportSubscribers}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by email or phone"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={tierFilter}
              onValueChange={setTierFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by subscription tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subscribers table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="py-3 px-4 text-left">
                    <Checkbox
                      checked={
                        getCurrentPageSubscribers().length > 0 &&
                        getCurrentPageSubscribers().every(sub => 
                          selectedSubscribers.includes(sub.id)
                        )
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-3 px-4 text-left font-medium">Email</th>
                  <th className="py-3 px-4 text-left font-medium">Phone</th>
                  <th className="py-3 px-4 text-left font-medium">Tier</th>
                  <th className="py-3 px-4 text-left font-medium">Status</th>
                  <th className="py-3 px-4 text-left font-medium">Preferences</th>
                  <th className="py-3 px-4 text-left font-medium">Last Payment</th>
                  <th className="py-3 px-4 text-left font-medium">Created</th>
                  <th className="py-3 px-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="py-20 text-center text-gray-500">
                      Loading subscribers...
                    </td>
                  </tr>
                ) : getCurrentPageSubscribers().length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-20 text-center text-gray-500">
                      No subscribers found matching your filters.
                    </td>
                  </tr>
                ) : (
                  getCurrentPageSubscribers().map((subscriber) => (
                    <tr key={subscriber.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Checkbox
                          checked={selectedSubscribers.includes(subscriber.id)}
                          onCheckedChange={(checked) => 
                            handleSelectSubscriber(subscriber.id, checked as boolean)
                          }
                        />
                      </td>
                      <td className="py-3 px-4">{subscriber.email}</td>
                      <td className="py-3 px-4">
                        {subscriber.phone || <span className="text-gray-400">N/A</span>}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={
                          subscriber.subscriptionTier === 'free' ? 'outline' :
                          subscriber.subscriptionTier === 'daily' ? 'secondary' :
                          subscriber.subscriptionTier === 'weekly' ? 'default' :
                          'destructive'
                        }>
                          {subscriber.subscriptionTier.charAt(0).toUpperCase() + subscriber.subscriptionTier.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={subscriber.isActive ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-red-100 text-red-800 hover:bg-red-200"} variant="outline">
                          {subscriber.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          {subscriber.communicationPreferences.email && (
                            <Badge variant="outline" className="bg-blue-50">
                              Email
                            </Badge>
                          )}
                          {subscriber.communicationPreferences.sms && (
                            <Badge variant="outline" className="bg-green-50">
                              SMS
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {subscriber.lastPaymentDate || <span className="text-gray-400">N/A</span>}
                      </td>
                      <td className="py-3 px-4">{subscriber.createdAt}</td>
                      <td className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditSubscriber(subscriber)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setSelectedSubscribers([subscriber.id]);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between px-4 py-2 border-t">
          <div className="text-sm text-gray-500">
            Showing {filteredSubscribers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredSubscribers.length)} of {filteredSubscribers.length} subscribers
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Edit subscriber dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Subscriber</DialogTitle>
            <DialogDescription>
              Update the subscriber's information and preferences.
            </DialogDescription>
          </DialogHeader>
          {editingSubscriber && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={editingSubscriber.email}
                  onChange={(e) => setEditingSubscriber({
                    ...editingSubscriber,
                    email: e.target.value
                  })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={editingSubscriber.phone || ''}
                  onChange={(e) => setEditingSubscriber({
                    ...editingSubscriber,
                    phone: e.target.value || null
                  })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tier" className="text-right">
                  Subscription Tier
                </Label>
                <Select
                  value={editingSubscriber.subscriptionTier}
                  onValueChange={(value) => setEditingSubscriber({
                    ...editingSubscriber,
                    subscriptionTier: value
                  })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Active Status
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="isActive"
                    checked={editingSubscriber.isActive}
                    onCheckedChange={(checked) => setEditingSubscriber({
                      ...editingSubscriber,
                      isActive: checked
                    })}
                  />
                  <Label htmlFor="isActive">
                    {editingSubscriber.isActive ? 'Active' : 'Inactive'}
                  </Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Communication
                </Label>
                <div className="flex flex-col space-y-2 col-span-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email-comm"
                      checked={editingSubscriber.communicationPreferences.email}
                      onCheckedChange={(checked) => setEditingSubscriber({
                        ...editingSubscriber,
                        communicationPreferences: {
                          ...editingSubscriber.communicationPreferences,
                          email: checked as boolean
                        }
                      })}
                    />
                    <Label htmlFor="email-comm">Email communications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sms-comm"
                      checked={editingSubscriber.communicationPreferences.sms}
                      onCheckedChange={(checked) => setEditingSubscriber({
                        ...editingSubscriber,
                        communicationPreferences: {
                          ...editingSubscriber.communicationPreferences,
                          sms: checked as boolean
                        }
                      })}
                    />
                    <Label htmlFor="sms-comm">SMS communications</Label>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSubscriber}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedSubscribers.length} selected subscriber(s)? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSelected}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subscribers; 