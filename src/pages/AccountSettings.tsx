import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Mock user data - in a real app, this would come from authentication state
const mockUser = {
  email: "user@example.com",
  phone: "(555) 123-4567",
  subscriptionTier: "weekly",
  communicationPreferences: {
    email: true,
    sms: true
  }
};

const AccountSettings = () => {
  const [user, setUser] = useState(mockUser);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [phone, setPhone] = useState("");
  const [emailPreference, setEmailPreference] = useState(true);
  const [smsPreference, setSmsPreference] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      // In a real app, this would fetch from your API
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user`);
      // const data = await response.json();

      // Using mock data instead
      setTimeout(() => {
        setPhone(user.phone || "");
        setEmailPreference(user.communicationPreferences.email);
        setSmsPreference(user.communicationPreferences.sms);
        setLoading(false);
      }, 500);
    };

    fetchUserData();
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits, spaces, dashes, and parentheses
    const sanitizedValue = value.replace(/[^\d\s\-()]/g, '');
    setPhone(sanitizedValue);
  };

  const savePreferences = async () => {
    setSaving(true);
    
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/subscriptions/preferences`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     email: user.email,
      //     preferences: {
      //       email: emailPreference,
      //       sms: smsPreference
      //     },
      //     phone: phone
      //   }),
      // });
      
      // Mock successful API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Preferences saved",
        description: "Your communication preferences have been updated.",
      });
      
      // Update local user state
      setUser({
        ...user,
        phone,
        communicationPreferences: {
          email: emailPreference,
          sms: smsPreference
        }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    }
    
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-quantum-neutral flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-quantum-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-quantum-neutral py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link to="/" className="flex items-center text-white mb-6 hover:text-quantum-primary transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>
        
        <Tabs defaultValue="preferences">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="preferences">Communication Preferences</TabsTrigger>
            <TabsTrigger value="subscription">Subscription Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Communication Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive updates and betting picks from QuantumBets.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-preference" className="text-base">
                      Email Notifications
                    </Label>
                    <Switch 
                      id="email-preference" 
                      checked={emailPreference}
                      onCheckedChange={setEmailPreference}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive betting picks and insights via email.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-preference" className="text-base">
                      SMS Notifications
                    </Label>
                    <Switch 
                      id="sms-preference" 
                      checked={smsPreference}
                      onCheckedChange={setSmsPreference}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Get time-sensitive alerts and simplified picks via text message.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(123) 456-7890"
                    value={phone}
                    onChange={handlePhoneChange}
                    disabled={!smsPreference}
                  />
                  <p className="text-sm text-muted-foreground">
                    Only US phone numbers are supported. Message and data rates may apply.
                  </p>
                </div>
                
                <div className="text-sm text-muted-foreground mt-4 p-3 bg-muted rounded-md">
                  <p>
                    By enabling SMS notifications, you consent to receive text messages from QuantumBets. 
                    You can opt out at any time by updating these preferences or replying STOP to any message.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={savePreferences} 
                  disabled={saving}
                  className="bg-quantum-primary hover:bg-quantum-primary/90"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Preferences"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
                <CardDescription>
                  View and manage your current subscription plan.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Current Plan</p>
                  <p className="text-lg font-bold text-quantum-primary capitalize">
                    {user.subscriptionTier}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Status</p>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <p>Active</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Email</p>
                  <p>{user.email}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Manage Payment</Button>
                <Button variant="destructive">Cancel Subscription</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountSettings; 