import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { AuthContext } from '@/App';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  FileText, 
  Settings, 
  Smartphone
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInAnimation, fadeUpAnimation } from '@/lib/motion';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminMobileApp from '@/components/admin/AdminMobileApp';

export default function AdminPage() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [location, navigate] = useLocation();
  const [match, params] = useRoute('/admin/:tab?');
  const activeTab = params?.tab || 'dashboard';
  const [isLoading, setIsLoading] = useState(true);

  // Authentication check - temporarily disabled for testing
  useEffect(() => {
    setIsLoading(false);
    // TODO: Re-enable authentication after testing
    // const timer = setTimeout(() => {
    //   setIsLoading(false);
    //   if (!isAuthenticated) {
    //     navigate('/admin-login');
    //     return;
    //   }
    //   if (user && !user.isAdmin) {
    //     navigate('/admin-login');
    //   }
    // }, 100);
    // return () => clearTimeout(timer);
  }, []);

  // Tab navigation
  const handleTabChange = (value: string) => {
    navigate(`/admin/${value}`);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  return (
    <motion.div 
      className="container py-8" 
      initial="hidden" 
      animate="visible" 
      variants={fadeInAnimation}
    >
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* 사이드바 네비게이션 */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                <Button 
                  variant={activeTab === 'dashboard' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => handleTabChange('dashboard')}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button 
                  variant={activeTab === 'products' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => handleTabChange('products')}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Product Management
                </Button>
                <Button 
                  variant={activeTab === 'orders' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => handleTabChange('orders')}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Order Management
                </Button>
                <Button 
                  variant={activeTab === 'users' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => handleTabChange('users')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  User Management
                </Button>
                <Button 
                  variant={activeTab === 'blog' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => handleTabChange('blog')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Blog Management
                </Button>
                <Button 
                  variant={activeTab === 'mobile' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => handleTabChange('mobile')}
                >
                  <Smartphone className="mr-2 h-4 w-4" />
                  Mobile App
                </Button>
                <Button 
                  variant={activeTab === 'settings' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => handleTabChange('settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="md:col-span-4">
          <Card>
            <CardContent className="p-6">
              {activeTab === 'dashboard' && <AdminDashboard />}
              {activeTab === 'products' && <AdminProducts />}
              {activeTab === 'mobile' && <AdminMobileApp />}
              {activeTab === 'orders' && <div>Order Management</div>}
              {activeTab === 'users' && <div>User Management</div>}
              {activeTab === 'blog' && <div>Blog Management</div>}
              {activeTab === 'settings' && <div>Settings</div>}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}