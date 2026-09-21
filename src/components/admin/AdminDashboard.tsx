import React, { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { DashboardOverview } from './DashboardOverview';
import { AnalyticsChartsView } from './AnalyticsChartsView';
import { BestsellersView } from './BestsellersView';
import { ProductManagementView } from './ProductManagementView';
import { CategoryManagementView } from './CategoryManagementView';
import { OrderManagementView } from './OrderManagementView';
import { UserManagementView } from './UserManagementView';
import { UserBehaviorView } from './UserBehaviorView';
import { ReportsView } from './ReportsView';
import { CouponsView } from './CouponsView';
import { FestivalManagementView } from './FestivalManagementView';
import { LiveSupportChatView } from './LiveSupportChatView';
import { AdminReviews } from './AdminReviews';
import { AdminSettingsView } from './AdminSettingsView';
import { AdminNotification, AdminUser, DashboardStats } from '../../types/admin';
import { useStore } from '../../context/StoreContext';

interface AdminDashboardProps {
  onBackToStore: () => void;
  onProductsUpdated?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToStore,
  onProductsUpdated
}) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('lumina_admin_token');
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('lumina_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { darkMode, toggleDarkMode } = useStore();

  // Stats & Orders & Notifications State
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  useEffect(() => {
    if (token) {
      loadStats();
      loadOrders();
      loadNotifications();
    }
  }, [token]);

  const loadStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const text = await res.text();
        if (text && !text.trim().startsWith('<')) {
          const data = JSON.parse(text);
          setStats(data);
          return;
        }
      }
      // Fallback default stats if API is unavailable on static host
      setStats({
        totalSales: 48500000,
        totalOrders: 38,
        totalProducts: 12,
        totalCustomers: 142,
        growthRate: 18.5,
        todaySales: 3200000
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const text = await res.text();
        if (text && !text.trim().startsWith('<')) {
          const data = JSON.parse(text);
          setOrders(data);
          return;
        }
      }
      // Fallback mock orders for offline / static host display
      setOrders([
        {
          id: 'ORD-9842',
          customerName: 'سارا احمدی',
          customerPhone: '09123456789',
          items: [{ nameFa: 'هدفون بی‌سیم لومینا ساند پرو', quantity: 1, price: 4200000 }],
          totalAmount: 4200000,
          status: 'processing',
          createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
        },
        {
          id: 'ORD-9841',
          customerName: 'رضا محمدی',
          customerPhone: '09351234567',
          items: [{ nameFa: 'ساعت هوشمند اولترا تیتانیوم', quantity: 1, price: 6800000 }],
          totalAmount: 6800000,
          status: 'delivered',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const text = await res.text();
        if (text && !text.trim().startsWith('<')) {
          const data = JSON.parse(text);
          setNotifications(data);
          return;
        }
      }
      setNotifications([]);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const handleLoginSuccess = (admin: AdminUser, userToken: string) => {
    setAdminUser(admin);
    setToken(userToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('lumina_admin_token');
    localStorage.removeItem('lumina_admin_user');
    setToken(null);
    setAdminUser(null);
  };

  const handleMarkNotificationRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'PATCH' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleProductChanged = () => {
    loadStats();
    if (onProductsUpdated) {
      onProductsUpdated();
    }
  };

  // If not authenticated, render Admin Login screen
  if (!token) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} onBackToStore={onBackToStore} />;
  }

  const pendingOrders = orders.filter(o => o.status === 'paid' || o.status === 'processing').length;
  const lowStock = stats?.lowStockProducts || 0;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-[#09090B] text-zinc-100' : 'bg-[#FAFAFA] text-zinc-900'} font-sans flex antialiased selection:bg-[#62DB00]/30 selection:text-white`} dir="rtl">
      {/* Sidebar */}
      <AdminSidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        adminUser={adminUser}
        onLogout={handleLogout}
        onViewStore={onBackToStore}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        pendingOrdersCount={pendingOrders}
        lowStockCount={lowStock}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 ${currentTab === 'support-chat' ? 'h-screen max-h-screen overflow-hidden' : 'min-h-screen'}`}>
        <AdminHeader
          onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)}
          adminUser={adminUser}
          onLogout={handleLogout}
          onViewStore={onBackToStore}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          onMarkAllRead={handleMarkAllRead}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          theme={darkMode ? 'dark' : 'light'}
          onToggleTheme={toggleDarkMode}
        />

        <main className={`flex-1 ${currentTab === 'support-chat' ? 'overflow-hidden flex flex-col min-h-0' : 'overflow-y-auto'}`}>
          {currentTab === 'dashboard' && (
            <DashboardOverview
              stats={stats}
              onNavigateTab={setCurrentTab}
              recentOrders={orders}
            />
          )}

          {currentTab === 'support-chat' && <LiveSupportChatView />}

          {currentTab === 'festivals' && (
            <FestivalManagementView
              onViewStoreFestival={fest => {
                onBackToStore();
                window.dispatchEvent(new CustomEvent('lumina_open_festival', { detail: fest }));
              }}
            />
          )}

          {currentTab === 'reviews' && <AdminReviews />}

          {currentTab === 'charts' && <AnalyticsChartsView />}

          {currentTab === 'products' && (
            <ProductManagementView
              key={selectedCategoryFilter}
              initialCategoryFilter={selectedCategoryFilter}
              onProductChanged={handleProductChanged}
            />
          )}

          {currentTab === 'categories' && (
            <CategoryManagementView
              onCategorySelected={catSlug => {
                setSelectedCategoryFilter(catSlug);
                setCurrentTab('products');
              }}
              onCategoryChanged={handleProductChanged}
            />
          )}

          {currentTab === 'bestsellers' && <BestsellersView />}

          {currentTab === 'orders' && <OrderManagementView />}

          {currentTab === 'users' && <UserManagementView />}

          {currentTab === 'behavior' && <UserBehaviorView />}

          {currentTab === 'reports' && <ReportsView />}

          {currentTab === 'coupons' && <CouponsView />}

          {currentTab === 'settings' && (
            <AdminSettingsView
              adminUser={adminUser}
              onUpdateAdminUser={setAdminUser}
            />
          )}
        </main>
      </div>
    </div>
  );
};
