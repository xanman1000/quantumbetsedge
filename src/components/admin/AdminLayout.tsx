import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart, 
  CreditCard, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [adminInfo, setAdminInfo] = useState<{firstName?: string, lastName?: string} | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('accessToken');
    const storedAdminInfo = localStorage.getItem('adminInfo');
    
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    if (storedAdminInfo) {
      setAdminInfo(JSON.parse(storedAdminInfo));
    }
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('adminInfo');
      
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out',
      });
      
      // Redirect to login page
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if the API call fails, clear local storage and redirect
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('adminInfo');
      navigate('/admin/login');
    }
  };
  
  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/subscribers', label: 'Subscribers', icon: <Users size={20} /> },
    { path: '/admin/content', label: 'Content', icon: <FileText size={20} /> },
    { path: '/admin/analytics', label: 'Analytics', icon: <BarChart size={20} /> },
    { path: '/admin/subscriptions', label: 'Subscriptions', icon: <CreditCard size={20} /> },
    { path: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleSidebar}
          className="bg-white"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>
      
      {/* Sidebar */}
      <div className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed md:relative md:translate-x-0 z-40
        w-64 h-full bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out
      `}>
        <div className="flex flex-col h-full">
          {/* Logo and title */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">QuantumBets Admin</h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <a
                    href={item.path}
                    className={`
                      flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors
                      ${isActiveRoute(item.path)
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* User info and logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                {adminInfo?.firstName?.[0] || 'A'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {adminInfo ? `${adminInfo.firstName} ${adminInfo.lastName}` : 'Admin User'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6">
          <h2 className="text-lg font-semibold text-gray-800">
            {navItems.find(item => isActiveRoute(item.path))?.label || 'Admin'}
          </h2>
        </header>
        
        {/* Content area */}
        <main className="flex-1 overflow-auto p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 