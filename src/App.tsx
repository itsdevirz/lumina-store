import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SiteBanner } from './components/SiteBanner';
import { FestivalBanner } from './components/FestivalBanner';
import { FestivalPage } from './components/FestivalPage';
import { ProductSlider } from './components/ProductSlider';
import { FlashSale } from './components/FlashSale';
import { PromotionalBanners } from './components/PromotionalBanners';
import { BestSellers } from './components/BestSellers';
import { ProductListing } from './components/ProductListing';
import { ProductDetailView } from './components/ProductDetailView';
import { CartPage } from './components/CartPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { UserDashboard } from './components/UserDashboard';
import { WishlistView } from './components/WishlistView';
import { QuickViewModal } from './components/QuickViewModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ShieldAlert, Globe } from 'lucide-react';
import { DynamicSEO } from './components/DynamicSEO';
import { SeoInspectorModal } from './components/SeoInspectorModal';
import { SupportChatWidget } from './components/SupportChatWidget';

interface MainContentProps {
  onGoToAdmin: () => void;
}

const MainContent: React.FC<MainContentProps> = ({ onGoToAdmin }) => {
  const { activeTab, selectedProduct } = useStore();
  const [isSeoModalOpen, setIsSeoModalOpen] = useState<boolean>(false);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, selectedProduct]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFC] dark:bg-[#0E1117] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Dynamic SEO Meta Tags Engine */}
      <DynamicSEO isAdmin={false} />

      {/* Top Navbar */}
      <Navbar onGoToAdmin={onGoToAdmin} />

      {/* Dynamic View rendering */}
      <main className="flex-1 pb-16 sm:pb-0">
        {activeTab === 'home' && (
          <>
            <FestivalBanner />
            <Hero />
            <SiteBanner />
            <ProductSlider />
            <FlashSale />
            <PromotionalBanners />
            <BestSellers />
          </>
        )}

        {activeTab === 'festival' && <FestivalPage />}

        {activeTab === 'shop' && <ProductListing />}

        {activeTab === 'product-detail' && <ProductDetailView />}

        {activeTab === 'cart' && <CartPage />}

        {activeTab === 'checkout' && <CheckoutView />}

        {activeTab === 'account' && <UserDashboard />}

        {activeTab === 'wishlist' && <WishlistView />}
      </main>

      {/* Floating Badges for Admin & Dynamic SEO Preview (Right Side) */}
      <div className="fixed bottom-6 right-6 z-40 hidden lg:flex flex-col gap-2">
        <button
          onClick={() => setIsSeoModalOpen(true)}
          title="بررسی زنده تگ‌های سئو، Canonical و متادیتا"
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-emerald-950/90 hover:bg-emerald-900 text-emerald-100 border border-emerald-700/50 shadow-xl backdrop-blur-xs text-xs font-bold transition-all hover:scale-105 active:scale-95 group cursor-pointer"
        >
          <Globe className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
          <span>آنالیز زنده سئو (SEO)</span>
        </button>

        <button
          onClick={onGoToAdmin}
          title="ورود به داشبورد مدیریت فروشگاه (/admin)"
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-indigo-900/90 hover:bg-indigo-800 text-indigo-100 border border-indigo-700/50 shadow-xl backdrop-blur-xs text-xs font-bold transition-all hover:scale-105 active:scale-95 group cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <ShieldAlert className="w-4 h-4 text-indigo-300 group-hover:text-white" />
          <span>پنل مدیریت</span>
        </button>
      </div>

      {/* Floating AI Support Chat Widget (Left Side) */}
      <SupportChatWidget />

      {/* Global Footer */}
      <Footer onGoToAdmin={onGoToAdmin} onOpenSeoInspector={() => setIsSeoModalOpen(true)} />

      {/* Mobile Floating Bottom Bar */}
      <MobileBottomNav onGoToAdmin={onGoToAdmin} />

      {/* Modals, Drawers & Overlays */}
      <CartDrawer />
      <QuickViewModal />
      <AuthModal />
      <ToastContainer />
      <SeoInspectorModal
        isOpen={isSeoModalOpen}
        onClose={() => setIsSeoModalOpen(false)}
        isAdmin={false}
      />
    </div>
  );
};

const AppRoot: React.FC = () => {
  const { refetchProducts } = useStore();

  const checkIsAdmin = () => {
    if (typeof window === 'undefined') return false;
    return (
      window.location.pathname.startsWith('/admin') ||
      window.location.hash.startsWith('#admin')
    );
  };

  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(checkIsAdmin);

  useEffect(() => {
    const handlePopState = () => {
      setIsAdminRoute(checkIsAdmin());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleGoToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToStore = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Refresh products in the storefront in case admin modified anything
    refetchProducts();
  };

  if (isAdminRoute) {
    return (
      <>
        <DynamicSEO isAdmin={true} />
        <AdminDashboard
          onBackToStore={handleBackToStore}
          onProductsUpdated={refetchProducts}
        />
      </>
    );
  }

  return <MainContent onGoToAdmin={handleGoToAdmin} />;
};

export default function App() {
  return (
    <StoreProvider>
      <AppRoot />
    </StoreProvider>
  );
}
