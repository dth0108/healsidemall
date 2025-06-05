import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  BarChart,
  Globe 
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalSales: number;
  recentOrders: any[];
  topProducts: any[];
}

export default function AdminDashboard() {
  // Fetch dashboard statistics data
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/admin/dashboard'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/dashboard');
      return response.json() as Promise<DashboardStats>;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">Total number of registered products</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">Total number of orders</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Number of registered users</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.totalSales ? stats.totalSales.toLocaleString() : 0}
            </div>
            <p className="text-xs text-muted-foreground">Total sales amount</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              Popular Products
            </CardTitle>
            <CardDescription>Best-selling products</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.topProducts && stats.topProducts.length > 0 ? (
              <ul className="space-y-2">
                {stats.topProducts.map((product, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{product.name}</span>
                    <span className="text-sm font-medium">{product.sales} units sold</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No sales data available
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Recent Orders
            </CardTitle>
            <CardDescription>Recently received orders</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <ul className="space-y-2">
                {stats.recentOrders.map((order, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>Order #{order.id}</span>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium">${order.total}</span>
                      <span className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No recent order data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}