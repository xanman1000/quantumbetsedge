import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contentPreview, setContentPreview] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [contentList, setContentList] = useState<{ id: string, title: string, date: string }[]>([
    { id: 'nl-2023-11-10', title: 'Week 10 NFL Insights', date: '2023-11-10' },
    { id: 'nl-2023-11-17', title: 'Week 11 NFL Insights', date: '2023-11-17' }
  ]);

  // Check if user is authenticated
  useEffect(() => {
    const isAdmin = localStorage.getItem('quantumBetsAdmin') === 'true';
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('quantumBetsAdmin');
    navigate('/admin/login');
  };

  const handleSaveContent = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Content saved",
        description: "Your content has been saved successfully",
      });
      
      // Add to content list
      const newId = `nl-${new Date().toISOString().slice(0, 10)}`;
      setContentList([
        { id: newId, title, date: new Date().toISOString().slice(0, 10) },
        ...contentList
      ]);
    }, 1000);
  };

  const handlePublish = () => {
    toast({
      title: "Content published",
      description: "Your content is now live",
    });
  };

  const handlePreview = () => {
    setContentPreview(content);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">QuantumBets Admin</h1>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Content</TabsTrigger>
          <TabsTrigger value="manage">Manage Content</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Content</CardTitle>
              <CardDescription>
                Create new betting picks and content for distribution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Week 12 NFL Insights" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">Content (HTML)</label>
                <Textarea 
                  id="content" 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  placeholder="<h2>Week 12 NFL Analysis</h2><p>Our proprietary algorithm has identified high-value opportunities...</p>"
                  className="min-h-[300px] font-mono"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePreview}>
                Preview
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={handleSaveContent} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Draft"}
                </Button>
                <Button onClick={handlePublish}>
                  Publish
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Manage Content</CardTitle>
              <CardDescription>
                View and edit existing content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentList.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-500">Created: {item.date}</p>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Content Preview</CardTitle>
              <CardDescription>
                Preview how your content will look to subscribers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contentPreview ? (
                <div 
                  className="p-4 border rounded-md bg-white"
                  dangerouslySetInnerHTML={{ __html: contentPreview }} 
                />
              ) : (
                <div className="p-4 border rounded-md bg-gray-50 text-center">
                  No content to preview. Click "Preview" on the Create tab to see content here.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 