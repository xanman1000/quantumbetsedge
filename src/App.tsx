import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StripeSuccess from "./pages/StripeSuccess";
import StripeCancel from "./pages/StripeCancel";
import AccountSettings from "./pages/AccountSettings";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Admin pages
import AdminLogin from "./pages/admin/Login";
import Subscribers from "./pages/admin/Subscribers";
import Content from "./pages/admin/Content";
import AdminLayout from "./components/admin/AdminLayout";
import NewsletterArchive from "./pages/NewsletterArchive";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/success" element={<StripeSuccess />} />
          <Route path="/cancel" element={<StripeCancel />} />
          <Route path="/account" element={<AccountSettings />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/stripe/success" element={<StripeSuccess />} />
          <Route path="/stripe/cancel" element={<StripeCancel />} />
          <Route path="/newsletter-archive" element={<NewsletterArchive />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="subscribers" element={<Subscribers />} />
            <Route path="content" element={<Content />} />
            {/* Additional admin routes will be added here */}
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
