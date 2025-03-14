import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, ChevronDown, UserCircle, LogOut } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in (simplified version)
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle hash navigation and scroll to section
  useEffect(() => {
    // Check if there's a hash in the URL
    if (location.hash) {
      // Wait a bit for the DOM to fully load
      setTimeout(() => {
        const id = location.hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  const navItems = [
    { name: 'Performance', path: '/#performance' },
    { name: 'Features', path: '/#features' },
    { name: 'Pricing', path: '/#pricing' },
    { name: 'FAQ', path: '/#faq' },
  ];

  // Function to determine if nav item is active
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path.includes('#')) {
      const sectionId = path.split('#')[1];
      return location.hash === `#${sectionId}`;
    }
    return location.pathname.startsWith(path);
  };

  // Function to handle smooth scrolling for hash links
  const handleHashNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path.includes('#')) {
      e.preventDefault();
      
      // If not on the home page, navigate to home page first
      if (location.pathname !== '/') {
        window.location.href = path;
        return;
      }
      
      const id = path.split('#')[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Update URL without reloading the page
        window.history.pushState(null, '', path);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/40 backdrop-blur-xl shadow-lg py-2 border-b border-white/5' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <span className="text-xl font-bold text-white group-hover:text-orange-200 transition-colors duration-300">QuantumBets</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={(e) => handleHashNavigation(e, item.path)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-white bg-orange-500/20 backdrop-blur-md shadow-sm shadow-orange-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-orange-500/10 hover:backdrop-blur-md'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA and User Menu */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-1 h-10 w-10 text-white hover:bg-orange-500/20 backdrop-blur-md border border-white/5">
                    <UserCircle className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-black/70 backdrop-blur-xl border-orange-900/50 text-white shadow-xl">
                  <DropdownMenuItem className="focus:bg-orange-500/20" asChild>
                    <Link to="/account" className="cursor-pointer w-full">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-orange-900/50" />
                  <DropdownMenuItem 
                    className="focus:bg-orange-500/20 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button 
                  className="bg-white/10 hover:bg-white/15 text-white rounded-full transition-all duration-300 backdrop-blur-md border border-white/10"
                  asChild
                >
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button 
                  className="bg-gradient-to-r from-orange-600 to-purple-500 hover:from-orange-700 hover:to-purple-600 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-orange-500/25 backdrop-blur-md border border-white/10"
                  asChild
                >
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-orange-500/20 backdrop-blur-md border border-white/5">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black/70 backdrop-blur-xl border-orange-900/50 text-white">
                <SheetHeader>
                  <SheetTitle className="text-white flex items-center">
                    QuantumBets
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col mt-8 space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={(e) => {
                        handleHashNavigation(e, item.path);
                        setIsOpen(false);
                      }}
                      className={`px-4 py-3 rounded-lg text-base transition-all duration-300 ${
                        isActive(item.path)
                          ? 'text-white bg-orange-500/20 backdrop-blur-md font-medium'
                          : 'text-gray-300 hover:text-white hover:bg-orange-500/10'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {isLoggedIn ? (
                    <>
                      <div className="h-px bg-orange-900/50 my-2" />
                      <Link
                        to="/account"
                        className="px-4 py-3 rounded-lg text-white hover:bg-orange-500/10 backdrop-blur-md"
                        onClick={() => setIsOpen(false)}
                      >
                        My Account
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="px-4 py-3 rounded-lg text-white hover:bg-orange-500/10 backdrop-blur-md text-left flex items-center"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col space-y-3">
                      <Button 
                        className="bg-white/10 hover:bg-white/15 text-white rounded-full transition-all duration-300 backdrop-blur-md border border-white/10 w-full"
                        asChild
                      >
                        <Link to="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
                      </Button>
                      <Button 
                        className="bg-gradient-to-r from-orange-600 to-purple-500 hover:from-orange-700 hover:to-purple-600 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-orange-500/25 backdrop-blur-md border border-white/10 w-full"
                        asChild
                      >
                        <Link to="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
                      </Button>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 