import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
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
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AdminTabErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Admin Tab Error:', error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-2xl mx-auto my-12 bg-white dark:bg-[#121215] border border-rose-200 dark:border-rose-900/60 rounded-2xl shadow-xl text-center space-y-4 font-sans">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-zinc-900 dark:text-white">خطا در بارگذاری این بخش</h2>
          <p className="text-xs text-zinc-500 leading-relaxed">
            مشکلی در نمایش این تب رخ داده است. داده‌های اصلی بدون مشکل هستند.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#62DB00] hover:bg-[#52B800] text-black text-xs font-black transition-all cursor-pointer shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            <span>تلاش مجدد و بارگذاری دوباره</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
        totalUsers: 142,
        newUsersToday: 4,
        newUsersWeek: 28,
        newUsersMonth: 95,
        usersChangeWeek: 12.5,
        totalProducts: 12,
        activeProducts: 10,
        outOfStockProducts: 1,
        lowStockProducts: 3,
        totalOrders: 38,
        ordersToday: 5,
        ordersWeek: 24,
        ordersMonth: 38,
        ordersChangeWeek: 8.2,
        totalRevenue: 48500000,
        salesToday: 3200000,
        salesWeek: 18400000,
        salesMonth: 48500000,
        revenueChangeWeek: 15.4,
        visitsToday: 340,
        visitsWeek: 2150,
        visitsMonth: 8900,
        visitsChangeWeek: 11.2
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
          <AdminTabErrorBoundary key={currentTab}>
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
          </AdminTabErrorBoundary>
        </main>
      </div>
    </div>
  );
};
