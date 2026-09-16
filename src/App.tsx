import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AppShell } from './components/layout/AppShell';
import { Hero } from './components/Hero';
import { TrustBadges } from './components/TrustBadges';
import { FestivalBanner } from './components/FestivalBanner';
import { FestivalPage } from './components/FestivalPage';
import { ProductSlider } from './components/ProductSlider';
import { FlashSale } from './components/FlashSale';
import { PromotionalBanners } from './components/PromotionalBanners';
import { DiscountSection } from './components/DiscountSection';
import { BestSellers } from './components/BestSellers';
import { RecentlyViewed } from './components/RecentlyViewed';
import { ProductListing } from './components/ProductListing';
import { ProductDetailView } from './components/ProductDetailView';
import { CartPage } from './components/CartPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { UserDashboard } from './components/UserDashboard';
import { WishlistView } from './components/WishlistView';
import { QuickViewModal } from './components/QuickViewModal';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DynamicSEO } from './components/DynamicSEO';
import { SeoInspectorModal } from './components/SeoInspectorModal';
import { SupportChatWidget } from './components/SupportChatWidget';
import { SiteLoadingScreen } from './components/SiteLoadingScreen';

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
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 transition-colors duration-150">
      {/* Dynamic SEO Meta Tags Engine */}
      <DynamicSEO isAdmin={false} />

      {/* Linear + Vercel inspired modern AppShell */}
      <AppShell
        onGoToAdmin={onGoToAdmin}
        onOpenSeoInspector={() => setIsSeoModalOpen(true)}
      >
        {/* Dynamic View rendering */}
        {activeTab === 'home' && (
          <>
            <FestivalBanner />
            <Hero />
            <TrustBadges />
            <FlashSale />
            <ProductSlider />
            <PromotionalBanners />
            <DiscountSection />
            <BestSellers />
            <RecentlyViewed />
          </>
        )}

        {activeTab === 'festival' && <FestivalPage />}

        {activeTab === 'shop' && <ProductListing />}

        {activeTab === 'product-detail' && <ProductDetailView />}

        {activeTab === 'cart' && <CartPage />}

        {activeTab === 'checkout' && <CheckoutView />}

        {activeTab === 'account' && <UserDashboard />}

        {activeTab === 'wishlist' && <WishlistView />}

        {/* Developer-Tool Minimal Footer */}
        <Footer onGoToAdmin={onGoToAdmin} onOpenSeoInspector={() => setIsSeoModalOpen(true)} />
      </AppShell>

      {/* Modern Lumina Studio Loading Screen */}
      <SiteLoadingScreen />

      {/* Floating AI Support Chat Widget */}
      <SupportChatWidget />

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
