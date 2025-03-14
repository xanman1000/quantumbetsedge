import { useState, useEffect } from 'react';
import { 
  FileText, 
  Calendar, 
  Send, 
  Clock, 
  Eye, 
  ExternalLink, 
  Trash2,
  Filter,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';

// Mock data for content items
const mockContentItems = Array.from({ length: 10 }, (_, i) => ({
  id: `content-${i + 1}`,
  title: `Sports Picks - ${new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`,
  contentDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  htmlContent: `<h1>Picks for ${new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}</h1>
  <p>Here are our top picks for today:</p>
  <ul>
    <li>MLB: Yankees vs Red Sox - <strong>Yankees -1.5</strong></li>
    <li>NBA: Lakers vs Warriors - <strong>Warriors +3.5</strong></li>
    <li>NFL: Chiefs vs Bills - <strong>Over 53.5</strong></li>
  </ul>
  <p>Good luck!</p>`,
  plainTextContent: `Picks for ${new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}

Here are our top picks for today:
- MLB: Yankees vs Red Sox - Yankees -1.5
- NBA: Lakers vs Warriors - Warriors +3.5
- NFL: Chiefs vs Bills - Over 53.5

Good luck!`,
  smsContent: `QuantumBets: Today's Picks 🔥
MLB: Yankees -1.5
NBA: Warriors +3.5
NFL: Over 53.5
Reply STOP to unsubscribe`,
  isPublished: i < 8,
  sports: ['MLB', 'NBA', 'NFL'],
  tierAvailability: ['free', 'daily', 'weekly', 'monthly'],
  analyticData: {
    emailsSent: Math.floor(1000 - i * 50),
    emailsOpened: Math.floor((800 - i * 40) * (1 - i * 0.03)),
    emailClicks: Math.floor((500 - i * 30) * (1 - i * 0.04)),
    smsSent: Math.floor(500 - i * 25),
    deliveryStatus: {
      successful: Math.floor(950 - i * 40),
      failed: Math.floor(i * 10),
      pending: Math.floor(i * 5),
    }
  },
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
}));

type ContentItem = typeof mockContentItems[0];

const Content = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [previewItem, setPreviewItem] = useState<ContentItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isTestSendOpen, setIsTestSendOpen] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testPhone, setTestPhone] = useState('');
  const [testContentType, setTestContentType] = useState<'email' | 'sms'>('email');
  const [isDistributeOpen, setIsDistributeOpen] = useState(false);
  const [distributeOptions, setDistributeOptions] = useState({
    tiers: {
      free: true,
      daily: true,
      weekly: true,
      monthly: true
    },
    channels: {
      email: true,
      sms: true
    },
    schedule: 'now', // 'now' or 'later'
    scheduledTime: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16) // Default to 1 hour from now
  });
  const [isSending, setIsSending] = useState(false);
  const [isDistributing, setIsDistributing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContentItems();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, sportFilter, statusFilter, sortOrder, contentItems]);

  const fetchContentItems = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch data from the API
      // const response = await fetch('/api/admin/content', {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      //   },
      // });
      // const data = await response.json();
      // setContentItems(data);
      
      // For now, use mock data with a simulated delay
      setTimeout(() => {
        setContentItems(mockContentItems);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching content items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load content items',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...contentItems];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        item => 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.contentDate.includes(searchTerm)
      );
    }
    
    // Apply sport filter
    if (sportFilter !== 'all') {
      filtered = filtered.filter(
        item => item.sports.includes(sportFilter)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        item => 
          (statusFilter === 'published' && item.isPublished) ||
          (statusFilter === 'draft' && !item.isPublished)
      );
    }
    
    // Apply sort order
    filtered.sort((a, b) => {
      const dateA = new Date(a.contentDate).getTime();
      const dateB = new Date(b.contentDate).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    setFilteredItems(filtered);
  };

  const handlePreview = (item: ContentItem) => {
    setPreviewItem(item);
    setIsPreviewOpen(true);
  };

  const handleTestSend = (item: ContentItem) => {
    setPreviewItem(item);
    setIsTestSendOpen(true);
  };

  const handleDistribute = (item: ContentItem) => {
    setPreviewItem(item);
    setIsDistributeOpen(true);
  };

  const sendTestContent = async () => {
    if (!previewItem) return;
    
    setIsSending(true);
    try {
      // In a real implementation, this would call the API to send a test
      // await fetch('/api/admin/content/test-send', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     contentId: previewItem.id,
      //     email: testContentType === 'email' ? testEmail : undefined,
      //     phone: testContentType === 'sms' ? testPhone : undefined,
      //     type: testContentType,
      //   }),
      // });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Test Sent',
        description: `Test ${testContentType} has been sent to ${testContentType === 'email' ? testEmail : testPhone}`,
      });
      
      setIsTestSendOpen(false);
    } catch (error) {
      console.error('Error sending test:', error);
      toast({
        title: 'Error',
        description: `Failed to send test ${testContentType}`,
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const distributeContent = async () => {
    if (!previewItem) return;
    
    setIsDistributing(true);
    try {
      // In a real implementation, this would call the API to distribute content
      // await fetch(`/api/admin/content/distribute/${previewItem.id}`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     tiers: Object.entries(distributeOptions.tiers)
      //       .filter(([_, value]) => value)
      //       .map(([key]) => key),
      //     channels: {
      //       email: distributeOptions.channels.email,
      //       sms: distributeOptions.channels.sms,
      //     },
      //     scheduledTime: distributeOptions.schedule === 'later' ? distributeOptions.scheduledTime : undefined,
      //   }),
      // });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the UI to show that the content was distributed or scheduled
      if (distributeOptions.schedule === 'now') {
        // If distributed now, update the content item
        const updatedItems = contentItems.map(item => 
          item.id === previewItem.id 
          ? { 
             ...item, 
             isPublished: true,
             analyticData: {
               ...item.analyticData,
               emailsSent: distributeOptions.channels.email ? item.analyticData.emailsSent + 1000 : item.analyticData.emailsSent,
               smsSent: distributeOptions.channels.sms ? item.analyticData.smsSent + 500 : item.analyticData.smsSent,
             } 
            } 
          : item
        );
        setContentItems(updatedItems);
        
        toast({
          title: 'Content Distributed',
          description: `Content has been distributed to subscribers`,
        });
      } else {
        toast({
          title: 'Distribution Scheduled',
          description: `Content will be distributed at ${new Date(distributeOptions.scheduledTime).toLocaleString()}`,
        });
      }
      
      setIsDistributeOpen(false);
    } catch (error) {
      console.error('Error distributing content:', error);
      toast({
        title: 'Error',
        description: 'Failed to distribute content',
        variant: 'destructive',
      });
    } finally {
      setIsDistributing(false);
    }
  };

  // Calculate open rate
  const calculateOpenRate = (item: ContentItem) => {
    return item.analyticData.emailsSent > 0 
      ? Math.round((item.analyticData.emailsOpened / item.analyticData.emailsSent) * 100)
      : 0;
  };
  
  // Calculate click rate
  const calculateClickRate = (item: ContentItem) => {
    return item.analyticData.emailsOpened > 0 
      ? Math.round((item.analyticData.emailClicks / item.analyticData.emailsOpened) * 100)
      : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Content Management</h1>
        <Button onClick={() => window.location.href = "/admin/content/new"}>
          Create New Content
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Input
                placeholder="Search by title or date"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={sportFilter}
              onValueChange={setSportFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                <SelectItem value="MLB">MLB</SelectItem>
                <SelectItem value="NBA">NBA</SelectItem>
                <SelectItem value="NFL">NFL</SelectItem>
                <SelectItem value="NHL">NHL</SelectItem>
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
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end">
              <Button 
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="flex items-center space-x-1"
              >
                <span>Date</span>
                {sortOrder === 'desc' ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content items */}
      {isLoading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading content items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg border">
          <FileText className="h-10 w-10 mx-auto text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No content items</h3>
          <p className="mt-1 text-sm text-gray-500">
            No content items match your search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row gap-0 md:gap-6">
                  {/* Left column with content info */}
                  <div className="flex-1 p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">{item.title}</h3>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{item.contentDate}</span>
                        </div>
                      </div>
                      <Badge variant={item.isPublished ? "default" : "outline"}>
                        {item.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.sports.map((sport) => (
                          <Badge key={sport} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                            {sport}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-700 line-clamp-2">
                        {item.plainTextContent.substring(0, 150)}...
                      </div>
                      
                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreview(item)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestSend(item)}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Test Send
                        </Button>
                        {!item.isPublished && (
                          <Button
                            size="sm"
                            onClick={() => handleDistribute(item)}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Distribute
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Right column with analytics */}
                  <div className="md:w-64 p-5 bg-gray-50 border-t md:border-t-0 md:border-l">
                    <h4 className="font-medium text-sm mb-3">Analytics</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Emails Sent:</span>
                          <span className="font-medium">{item.analyticData.emailsSent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Open Rate:</span>
                          <span className="font-medium">{calculateOpenRate(item)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Click Rate:</span>
                          <span className="font-medium">{calculateClickRate(item)}%</span>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">SMS Sent:</span>
                          <span className="font-medium">{item.analyticData.smsSent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Success Rate:</span>
                          <span className="font-medium">
                            {item.analyticData.deliveryStatus.successful > 0
                              ? Math.round(
                                  (item.analyticData.deliveryStatus.successful /
                                    (item.analyticData.deliveryStatus.successful +
                                      item.analyticData.deliveryStatus.failed)) *
                                    100
                                )
                              : 0}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right mt-3">
                        <Button variant="link" size="sm" className="h-auto p-0 text-gray-500 hover:text-gray-700">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          <span className="text-xs">Detailed Analytics</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{previewItem?.title}</DialogTitle>
            <DialogDescription>
              Preview content before sending to subscribers
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="html" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="mx-auto mb-2">
              <TabsTrigger value="html">
                <Mail className="h-4 w-4 mr-1" />
                HTML Email
              </TabsTrigger>
              <TabsTrigger value="text">
                <FileText className="h-4 w-4 mr-1" />
                Plain Text
              </TabsTrigger>
              <TabsTrigger value="sms">
                <MessageSquare className="h-4 w-4 mr-1" />
                SMS
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-auto mt-2">
              <TabsContent value="html" className="h-full">
                <Card className="h-full">
                  <CardContent className="p-4 h-full overflow-auto">
                    <div 
                      className="bg-white p-5 rounded"
                      dangerouslySetInnerHTML={{ __html: previewItem?.htmlContent || '' }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="text" className="h-full">
                <Card className="h-full">
                  <CardContent className="p-4 h-full overflow-auto">
                    <pre className="text-sm whitespace-pre-wrap font-mono bg-gray-50 p-5 rounded">
                      {previewItem?.plainTextContent}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="sms" className="h-full">
                <Card className="h-full">
                  <CardContent className="p-4 h-full overflow-auto">
                    <div className="max-w-xs mx-auto">
                      <div className="bg-gray-100 rounded-xl p-5 shadow">
                        <div className="bg-gray-50 rounded-lg p-3 text-sm">
                          {previewItem?.smsContent}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsPreviewOpen(false);
              handleTestSend(previewItem!);
            }}>
              <Send className="h-4 w-4 mr-2" />
              Test Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Send Dialog */}
      <Dialog open={isTestSendOpen} onOpenChange={setIsTestSendOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Test Content</DialogTitle>
            <DialogDescription>
              Send a test version of this content to validate before distribution.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <RadioGroup 
              value={testContentType}
              onValueChange={(value) => setTestContentType(value as 'email' | 'sms')}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem id="email" value="email" className="peer sr-only" />
                <Label 
                  htmlFor="email" 
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Mail className="h-5 w-5 mb-2" />
                  <span>Email</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem id="sms" value="sms" className="peer sr-only" />
                <Label 
                  htmlFor="sms" 
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <MessageSquare className="h-5 w-5 mb-2" />
                  <span>SMS</span>
                </Label>
              </div>
            </RadioGroup>
            
            {testContentType === 'email' ? (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="test-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="test-email"
                  type="email"
                  placeholder="your@email.com"
                  className="col-span-3"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>
            ) : (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="test-phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="test-phone"
                  type="tel"
                  placeholder="+1234567890"
                  className="col-span-3"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTestSendOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={sendTestContent}
              disabled={isSending || (testContentType === 'email' ? !testEmail : !testPhone)}
            >
              {isSending ? 'Sending...' : 'Send Test'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Distribute Dialog */}
      <Dialog open={isDistributeOpen} onOpenChange={setIsDistributeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Distribute Content</DialogTitle>
            <DialogDescription>
              Send this content to subscribers based on their tier and preferences.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Accordion type="single" collapsible defaultValue="tiers">
              <AccordionItem value="tiers">
                <AccordionTrigger>Subscription Tiers</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tier-free"
                        checked={distributeOptions.tiers.free}
                        onCheckedChange={(checked) => setDistributeOptions({
                          ...distributeOptions,
                          tiers: {
                            ...distributeOptions.tiers,
                            free: checked as boolean
                          }
                        })}
                      />
                      <Label htmlFor="tier-free">Free Tier</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tier-daily"
                        checked={distributeOptions.tiers.daily}
                        onCheckedChange={(checked) => setDistributeOptions({
                          ...distributeOptions,
                          tiers: {
                            ...distributeOptions.tiers,
                            daily: checked as boolean
                          }
                        })}
                      />
                      <Label htmlFor="tier-daily">Daily Tier</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tier-weekly"
                        checked={distributeOptions.tiers.weekly}
                        onCheckedChange={(checked) => setDistributeOptions({
                          ...distributeOptions,
                          tiers: {
                            ...distributeOptions.tiers,
                            weekly: checked as boolean
                          }
                        })}
                      />
                      <Label htmlFor="tier-weekly">Weekly Tier</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tier-monthly"
                        checked={distributeOptions.tiers.monthly}
                        onCheckedChange={(checked) => setDistributeOptions({
                          ...distributeOptions,
                          tiers: {
                            ...distributeOptions.tiers,
                            monthly: checked as boolean
                          }
                        })}
                      />
                      <Label htmlFor="tier-monthly">Monthly Tier</Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="channels">
                <AccordionTrigger>Communication Channels</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="channel-email">Email</Label>
                      <Switch
                        id="channel-email"
                        checked={distributeOptions.channels.email}
                        onCheckedChange={(checked) => setDistributeOptions({
                          ...distributeOptions,
                          channels: {
                            ...distributeOptions.channels,
                            email: checked
                          }
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="channel-sms">SMS (Paid Tiers Only)</Label>
                      <Switch
                        id="channel-sms"
                        checked={distributeOptions.channels.sms}
                        onCheckedChange={(checked) => setDistributeOptions({
                          ...distributeOptions,
                          channels: {
                            ...distributeOptions.channels,
                            sms: checked
                          }
                        })}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="schedule">
                <AccordionTrigger>Distribution Schedule</AccordionTrigger>
                <AccordionContent>
                  <RadioGroup 
                    value={distributeOptions.schedule}
                    onValueChange={(value) => setDistributeOptions({
                      ...distributeOptions,
                      schedule: value
                    })}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="now" id="schedule-now" />
                      <Label htmlFor="schedule-now">Send immediately</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="later" id="schedule-later" />
                      <Label htmlFor="schedule-later">Schedule for later</Label>
                    </div>
                  </RadioGroup>
                  
                  {distributeOptions.schedule === 'later' && (
                    <div className="mt-4">
                      <Label htmlFor="scheduled-time">Scheduled Time</Label>
                      <Input
                        id="scheduled-time"
                        type="datetime-local"
                        className="mt-1"
                        value={distributeOptions.scheduledTime}
                        onChange={(e) => setDistributeOptions({
                          ...distributeOptions,
                          scheduledTime: e.target.value
                        })}
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDistributeOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={distributeContent}
              disabled={
                isDistributing ||
                (!distributeOptions.channels.email && !distributeOptions.channels.sms) ||
                !Object.values(distributeOptions.tiers).some(Boolean) ||
                (distributeOptions.schedule === 'later' && !distributeOptions.scheduledTime)
              }
            >
              {isDistributing ? 'Processing...' : distributeOptions.schedule === 'now' ? 'Distribute Now' : 'Schedule Distribution'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Content; 