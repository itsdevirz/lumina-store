import React, { createContext, useContext, useState, useEffect, useMemo, useRef, ReactNode } from 'react';
import { Product, ProductVariant, CartItem, Order, FilterState, ToastMessage, UserProfile, StoredUser, Language, ThemeMode, AccentColor, Festival, FestivalProduct, Category } from '../types';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { playNotificationChime } from '../utils/sound';

export const ACCENT_PALETTES: Record<AccentColor, {
  nameFa: string;
  nameEn: string;
  color: string;
  gradient: string;
  light: { primary: string; hover: string; lightBg: string; border: string };
  dark: { primary: string; hover: string; lightBg: string; border: string };
}> = {
  indigo: {
    nameFa: 'نیلی کبالت',
    nameEn: 'Cobalt Indigo',
    color: '#4F46E5',
    gradient: 'from-indigo-600 to-violet-600',
    light: { primary: '#4F46E5', hover: '#4338CA', lightBg: '#EEF2FF', border: '#C7D2FE' },
    dark: { primary: '#6366F1', hover: '#4F46E5', lightBg: '#1E1B4B', border: '#3730A3' }
  },
  emerald: {
    nameFa: 'سبز زمردی',
    nameEn: 'Emerald Mint',
    color: '#10B981',
    gradient: 'from-emerald-600 to-teal-600',
    light: { primary: '#059669', hover: '#047857', lightBg: '#ECFDF5', border: '#A7F3D0' },
    dark: { primary: '#10B981', hover: '#059669', lightBg: '#064E3B', border: '#065F46' }
  },
  rose: {
    nameFa: 'رز تمشکی',
    nameEn: 'Crimson Rose',
    color: '#F43F5E',
    gradient: 'from-rose-600 to-pink-600',
    light: { primary: '#E11D48', hover: '#BE123C', lightBg: '#FFF1F2', border: '#FECDD3' },
    dark: { primary: '#F43F5E', hover: '#E11D48', lightBg: '#4C0519', border: '#881337' }
  },
  amber: {
    nameFa: 'کهربایی و پرتقالی',
    nameEn: 'Sunset Amber',
    color: '#F59E0B',
    gradient: 'from-amber-500 to-orange-500',
    light: { primary: '#D97706', hover: '#B45309', lightBg: '#FFFBEB', border: '#FDE68A' },
    dark: { primary: '#F59E0B', hover: '#D97706', lightBg: '#451A03', border: '#78350F' }
  },
  purple: {
    nameFa: 'بنفش الکتریک',
    nameEn: 'Electric Violet',
    color: '#8B5CF6',
    gradient: 'from-purple-600 to-indigo-600',
    light: { primary: '#7C3AED', hover: '#6D28D9', lightBg: '#F5F3FF', border: '#DDD6FE' },
    dark: { primary: '#8B5CF6', hover: '#7C3AED', lightBg: '#2E1065', border: '#4C1D95' }
  },
  cyan: {
    nameFa: 'فیروزه‌ای اقیانوسی',
    nameEn: 'Ocean Cyan',
    color: '#06B6D4',
    gradient: 'from-cyan-600 to-blue-600',
    light: { primary: '#0284C7', hover: '#0369A1', lightBg: '#F0F9FF', border: '#BAE6FD' },
    dark: { primary: '#0EA5E9', hover: '#0284C7', lightBg: '#082F49', border: '#0C4A6E' }
  }
};

export interface StoreCoupon {
  id: string;
  code: string;
  discountPercent: number;
  maxDiscount?: number;
  minPurchase?: number;
  expiresAt?: string;
  usageCount?: number;
  maxUsage?: number;
  isActive: boolean;
}

const DEFAULT_COUPONS: StoreCoupon[] = [
  {
    id: 'coup-1',
    code: 'LUMINA2025',
    discountPercent: 15,
    maxDiscount: 1500000,
    minPurchase: 3000000,
    expiresAt: '۱۴۰۴/۰۷/۰۱',
    usageCount: 142,
    maxUsage: 500,
    isActive: true
  },
  {
    id: 'coup-2',
    code: 'VIPGIFT',
    discountPercent: 20,
    maxDiscount: 3000000,
    minPurchase: 5000000,
    expiresAt: '۱۴۰۴/۰۶/۳۰',
    usageCount: 68,
    maxUsage: 100,
    isActive: true
  },
  {
    id: 'coup-3',
    code: 'WELCOME10',
    discountPercent: 10,
    maxDiscount: 800000,
    minPurchase: 1000000,
    expiresAt: '۱۴۰۴/۱۲/۲۹',
    usageCount: 310,
    maxUsage: 1000,
    isActive: true
  },
  {
    id: 'coup-4',
    code: 'LUMINA20',
    discountPercent: 20,
    maxDiscount: 2000000,
    minPurchase: 1000000,
    expiresAt: '۱۴۰۴/۱۲/۲۹',
    usageCount: 50,
    maxUsage: 1000,
    isActive: true
  },
  {
    id: 'coup-5',
    code: 'LUMINA',
    discountPercent: 15,
    maxDiscount: 1000000,
    minPurchase: 0,
    expiresAt: '۱۴۰۴/۱۲/۲۹',
    usageCount: 20,
    maxUsage: 500,
    isActive: true
  },
  {
    id: 'coup-6',
    code: 'OFF20',
    discountPercent: 20,
    maxDiscount: 2500000,
    minPurchase: 2000000,
    expiresAt: '۱۴۰۴/۱۲/۲۹',
    usageCount: 15,
    maxUsage: 500,
    isActive: true
  },
  {
    id: 'coup-7',
    code: 'OFF10',
    discountPercent: 10,
    maxDiscount: 1000000,
    minPurchase: 0,
    expiresAt: '۱۴۰۴/۱۲/۲۹',
    usageCount: 40,
    maxUsage: 500,
    isActive: true
  }
];

function normalizeCouponCode(str: string): string {
  if (!str) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let res = str.trim();
  for (let i = 0; i < 10; i++) {
    res = res.replaceAll(persianDigits[i], String(i));
    res = res.replaceAll(arabicDigits[i], String(i));
  }
  return res.toUpperCase();
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  lang: Language;
  setLang: (l: Language) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  darkMode: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleDarkMode: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (p: Product | null) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isMobileFilterOpen: boolean;
  setIsMobileFilterOpen: (open: boolean) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  addToCart: (
    product: Product,
    quantity?: number,
    selectedColor?: string,
    selectedSize?: string,
    selectedVariant?: ProductVariant,
    selectedAttributes?: { [key: string]: string },
    selectedColorHex?: string
  ) => void;
  removeFromCart: (cartItemIndexOrProductId: number | string, selectedColor?: string, selectedSize?: string) => void;
  updateCartQuantity: (cartItemIndexOrProductId: number | string, quantity: number, selectedColor?: string, selectedSize?: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  appliedCoupon: { code: string; percent: number; maxDiscount?: number; minPurchase?: number } | null;
  applyCoupon: (code: string) => Promise<boolean> | boolean;
  removeCoupon: () => void;
  cartTotal: { subtotal: number; discount: number; shipping: number; total: number };
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  userOrders: Order[];
  updateOrderStatus: (
    orderId: string,
    status: Order['status'],
    extra?: { trackingCode?: string; trackingNumber?: string; courierName?: string; courier?: string; estimatedDelivery?: string; adminNote?: string; statusAdminNote?: string }
  ) => Promise<void> | void;
  syncOrdersWithBackend: () => Promise<void>;
  isSyncingOrders: boolean;
  placeOrder: (shippingDetails: any, paymentMethod: string) => Promise<string>;
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  openLoginModal: () => void;
  openRegisterModal: () => void;
  login: (identifier: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; phone: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  quickDemoLogin: () => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  addAddress: (address: Omit<UserProfile['addresses'][0], 'id'>) => void;
  userProfile: UserProfile;
  formatPrice: (priceToman: number, priceUSD?: number) => string;
  openProductDetails: (product: Product) => void;
  recentlyViewed: Product[];
  clearRecentlyViewed: () => void;
  refetchProducts: () => Promise<void>;
  festivals: Festival[];
  activeFestival: Festival | null;
  selectedFestival: Festival | null;
  setSelectedFestival: (f: Festival | null) => void;
  openFestivalPage: (f?: Festival) => void;
  refetchFestivals: () => Promise<void>;
  addFestivalProductToCart: (product: Product, festivalPrice: number, festivalStock?: number) => void;
  categories: Category[];
  refetchCategories: () => Promise<void>;
}


const DEMO_USER: StoredUser = {
  id: 'usr-kian-01',
  name: 'کیان مهرآذر',
  email: 'kian.mehrazar@lumina.io',
  phone: '۰۹۱۲۳۴۵۶۷۸۹',
  avatar: '/images/products/photo-1535713875002-d1d0cf377fde.jpg',
  role: 'vip',
  password: 'password123',
  createdAt: '۱۴۰۲/۱۱/۱۰',
  addresses: [
    {
      id: 'addr-1',
      title: 'منزل (پیش‌فرض)',
      city: 'تهران',
      address: 'خیابان ولیعصر، بالاتر از پارک وی، کوچه مهر، پلاک ۱۲',
      postalCode: '۱۹۶۸۸۱۴۵۳۲',
      isDefault: true
    },
    {
      id: 'addr-2',
      title: 'دفتر کار',
      city: 'تهران',
      address: 'ونک، خیابان ملاصدرا، برج فناوری لومینا',
      postalCode: '۱۹۹۱۸۵۴۳۲۱',
      isDefault: false
    }
  ]
};

const initialFilters: FilterState = {
  searchQuery: '',
  selectedCategory: 'all',
  selectedBrand: 'all',
  minPrice: 0,
  maxPrice: 30000000,
  minRating: 0,
  inStockOnly: false,
  onSaleOnly: false,
  sortBy: 'popular',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function parseRouteFromUrl(availableProducts: Product[]) {
  if (typeof window === 'undefined') {
    return { tab: 'home', product: null, category: 'all' };
  }

  const pathname = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);

  // 1. Product Detail Check: /product/:id or ?product=:id
  const prodMatch = pathname.match(/\/product\/([^/?#]+)/);
  if (prodMatch && prodMatch[1]) {
    const prodId = decodeURIComponent(prodMatch[1]);
    const found = availableProducts.find(p => p.id === prodId);
    if (found) {
      return { tab: 'product-detail', product: found, category: found.category };
    }
  }
  if (searchParams.has('product')) {
    const prodId = decodeURIComponent(searchParams.get('product') || '');
    const found = availableProducts.find(p => p.id === prodId);
    if (found) {
      return { tab: 'product-detail', product: found, category: found.category };
    }
  }

  // 2. Category Check: /category/:id or ?category=:id
  const catMatch = pathname.match(/\/category\/([^/?#]+)/);
  if (catMatch && catMatch[1]) {
    const catId = decodeURIComponent(catMatch[1]);
    return { tab: 'shop', product: null, category: catId };
  }
  if (searchParams.has('category')) {
    const catId = decodeURIComponent(searchParams.get('category') || 'all');
    return { tab: 'shop', product: null, category: catId };
  }

  // 3. Shop All / tab query check
  if (pathname.endsWith('/shop') || searchParams.get('tab') === 'shop') {
    return { tab: 'shop', product: null, category: 'all' };
  }
  if (pathname.endsWith('/cart') || searchParams.get('tab') === 'cart') {
    return { tab: 'cart', product: null, category: 'all' };
  }
  if (pathname.endsWith('/checkout') || searchParams.get('tab') === 'checkout') {
    return { tab: 'checkout', product: null, category: 'all' };
  }
  if (pathname.endsWith('/wishlist') || searchParams.get('tab') === 'wishlist') {
    return { tab: 'wishlist', product: null, category: 'all' };
  }
  if (pathname.endsWith('/bestsellers') || searchParams.get('tab') === 'bestsellers') {
    return { tab: 'bestsellers', product: null, category: 'all' };
  }
  if (pathname.endsWith('/account') || searchParams.get('tab') === 'account') {
    return { tab: 'account', product: null, category: 'all' };
  }

  return { tab: 'home', product: null, category: 'all' };
}

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state: 'light' | 'dark' | 'system'
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('lumina_theme_mode') as ThemeMode | null;
      if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system') {
        return savedMode;
      }
      const legacyDark = localStorage.getItem('lumina_dark_mode');
      if (legacyDark !== null) {
        try {
          return JSON.parse(legacyDark) ? 'dark' : 'light';
        } catch {
          return 'system';
        }
      }
      return 'system';
    }
    return 'system';
  });

  // Track system preference
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Listen for system theme changes in real-time
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else if ((mediaQuery as any).addListener) {
      (mediaQuery as any).addListener(handler);
      return () => (mediaQuery as any).removeListener(handler);
    }
  }, []);

  // Compute resolved dark mode boolean
  const darkMode = themeMode === 'system' ? systemIsDark : themeMode === 'dark';

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lumina_theme_mode', mode);
      const isDark = mode === 'system' ? systemIsDark : mode === 'dark';
      localStorage.setItem('lumina_dark_mode', JSON.stringify(isDark));
    }
  };

  const toggleDarkMode = () => {
    // When manually toggling via button, flip between light and dark
    const nextMode: ThemeMode = darkMode ? 'light' : 'dark';
    setThemeMode(nextMode);
  };

  // Language
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('lumina_lang') as Language) || 'fa';
  });

  // Dynamic Accent Color System
  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lumina_accent_color') as AccentColor;
      if (saved && ACCENT_PALETTES[saved]) return saved;
    }
    return 'indigo';
  });

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lumina_accent_color', color);
    }
  };

  // Sync Accent Color CSS variables dynamically
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const palette = ACCENT_PALETTES[accentColor] || ACCENT_PALETTES.indigo;
    const tokens = darkMode ? palette.dark : palette.light;
    root.style.setProperty('--primary', tokens.primary);
    root.style.setProperty('--primary-hover', tokens.hover);
    root.style.setProperty('--primary-light', tokens.lightBg);
    root.setAttribute('data-accent', accentColor);
  }, [accentColor, darkMode]);

  // Authentication State
  const [registeredUsers, setRegisteredUsers] = useState<StoredUser[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lumina_registered_users');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [DEMO_USER];
        }
      }
    }
    return [DEMO_USER];
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lumina_current_user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return null;
        }
      }
      // Default to demo user for a rich initial experience
      return DEMO_USER;
    }
    return DEMO_USER;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Navigation & UI state initialized from URL
  const initialRoute = useMemo(() => parseRouteFromUrl(PRODUCTS), []);
  const [activeTab, setActiveTabState] = useState<string>(initialRoute.tab);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(initialRoute.product);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...initialFilters,
    selectedCategory: initialRoute.category || 'all'
  }));

  // URL & Route state synchronization
  const setActiveTab = (tab: string) => {
    const resolvedTab = tab === 'store' ? 'home' : tab;
    setActiveTabState(resolvedTab);
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin')) {
      if (resolvedTab === 'home') {
        window.history.pushState({ tab: 'home' }, '', '/');
      } else if (resolvedTab === 'shop') {
        const cat = filters.selectedCategory;
        if (cat && cat !== 'all') {
          window.history.pushState({ tab: 'shop', category: cat }, '', `/category/${cat}`);
        } else {
          window.history.pushState({ tab: 'shop' }, '', '/shop');
        }
      } else if (['cart', 'checkout', 'wishlist', 'account', 'festival', 'bestsellers'].includes(resolvedTab)) {
        window.history.pushState({ tab: resolvedTab }, '', `/${resolvedTab}`);
      }
    }
  };

  // Products state with database sync
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);

  const fetchProductsFromApi = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProductsList(data);
        }
      }
    } catch (err) {
      console.error('Error fetching live products:', err);
    }
  };

  // Categories state with database sync
  const [categoriesList, setCategoriesList] = useState<Category[]>(CATEGORIES);

  const fetchCategoriesFromApi = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCategoriesList(data);
        }
      }
    } catch (err) {
      console.error('Error fetching live categories:', err);
    }
  };

  useEffect(() => {
    fetchProductsFromApi();
    fetchCategoriesFromApi();
  }, []);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('lumina_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('lumina_wishlist');
    return saved ? JSON.parse(saved) : ['lum-01', 'lum-03'];
  });

  // Recently Viewed state
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('lumina_recently_viewed');
    return saved ? JSON.parse(saved) : ['lum-01', 'lum-02', 'lum-04', 'lum-06'];
  });

  useEffect(() => {
    localStorage.setItem('lumina_recently_viewed', JSON.stringify(recentlyViewedIds));
  }, [recentlyViewedIds]);

  const clearRecentlyViewed = () => {
    setRecentlyViewedIds([]);
    localStorage.removeItem('lumina_recently_viewed');
  };

  // Dynamic coupons state
  const [couponsList, setCouponsList] = useState<StoreCoupon[]>(DEFAULT_COUPONS);

  // Dynamic Festivals state
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [activeFestival, setActiveFestival] = useState<Festival | null>(null);
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);

  const fetchFestivalsFromApi = async () => {
    try {
      const res = await fetch('/api/festivals');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setFestivals(data);
          const now = Date.now();
          const active = data.find(f => f.isActive && (!f.startTimestamp || now >= f.startTimestamp) && (!f.endTimestamp || now <= f.endTimestamp));
          setActiveFestival(active || null);
          if (!selectedFestival && active) {
            setSelectedFestival(active);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching live festivals:', err);
    }
  };

  useEffect(() => {
    fetchFestivalsFromApi();

    const handleFestivalUpdate = () => {
      fetchFestivalsFromApi();
    };

    const handleOpenFestival = (e: any) => {
      const fest = e.detail;
      if (fest) {
        setSelectedFestival(fest);
      }
      setActiveTab('festival');
    };

    window.addEventListener('lumina_festival_updated', handleFestivalUpdate);
    window.addEventListener('lumina_open_festival', handleOpenFestival);

    return () => {
      window.removeEventListener('lumina_festival_updated', handleFestivalUpdate);
      window.removeEventListener('lumina_open_festival', handleOpenFestival);
    };
  }, []);

  const openFestivalPage = (f?: Festival) => {
    if (f) {
      setSelectedFestival(f);
    } else if (activeFestival) {
      setSelectedFestival(activeFestival);
    }
    setActiveTab('festival');
  };

  const addFestivalProductToCart = (product: Product, festivalPrice: number, festivalStock?: number) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.product.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        const currentQty = updated[existingIdx].quantity;
        const maxStock = festivalStock || product.stock;
        if (currentQty >= maxStock) {
          addToast({
            title: lang === 'fa' ? 'حداکثر سقف خرید جشنواره' : 'Max Festival Stock Limit',
            description: lang === 'fa' ? `موجودی تخصیص‌یافته این کالا در جشنواره تکمیل است.` : 'Maximum allocated festival stock reached.',
            type: 'warning'
          });
          return prev;
        }
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: currentQty + 1,
          product: {
            ...product,
            price: festivalPrice
          }
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            product: {
              ...product,
              price: festivalPrice
            },
            quantity: 1,
            selectedColor: (product as any).colors?.[0]?.name || (product as any).color
          }
        ];
      }
    });

    addToast({
      title: lang === 'fa' ? 'با قیمت تخفیف جشنواره به سبد افزوده شد' : 'Added with Festival Discount',
      description: lang === 'fa' ? `${product.nameFa} (${formatPrice(festivalPrice)})` : product.name,
      type: 'success'
    });
  };


  const fetchCouponsFromApi = async () => {
    try {
      const res = await fetch('/api/coupons');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCouponsList(data);
        }
      }
    } catch (err) {
      console.error('Error fetching live coupons:', err);
    }
  };

  useEffect(() => {
    fetchCouponsFromApi();
  }, []);

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    percent: number;
    maxDiscount?: number;
    minPurchase?: number;
  } | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // User Orders
  const [userOrders, setUserOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('lumina_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // Fallback to default orders
      }
    }
    return [
      {
        id: 'ORD-98750',
        date: 'امروز - ۱۰:۳۰',
        status: 'processing',
        statusFa: 'در حال پردازش',
        trackingCode: 'LMN-77492019',
        courierName: 'پیک ویژه اکسپرس لومینا',
        estimatedDelivery: 'فردا بین ساعت ۱۴ تا ۱۸',
        items: [
          {
            id: 'ord-item-proc-1',
            productId: 'lum-01',
            productName: 'Lumina Horizon Pro Wireless Headphones',
            productNameFa: 'هدفون بی‌سیم لومینا هورایزن پرو - نویزکنسلینگ فعال',
            image: '/images/products/photo-1505740420928-5e560c06d30e.jpg',
            price: 14500000,
            quantity: 1
          }
        ],
        subtotal: 14500000,
        discount: 1450000,
        shipping: 0,
        total: 13050000,
        shippingAddress: {
          fullName: 'کیان مهرآذر',
          phone: '۰۹۱۲۳۴۵۶۷۸۹',
          city: 'تهران',
          address: 'خیابان ولیعصر، بالاتر از پارک وی، کوچه مهر، پلاک ۱۲',
          postalCode: '۱۹۶۸۸۱۴۵۳۲'
        },
        paymentMethod: 'درگاه آنلاین سامان'
      },
      {
        id: 'ORD-98612',
        date: 'دیروز - ۱۶:۴۵',
        status: 'shipped',
        statusFa: 'ارسال شده',
        trackingCode: 'TPX-994108420',
        courierName: 'تیپاکس اکسپرس هوایی',
        estimatedDelivery: 'امروز عصر تا ساعت ۲۰:۰۰',
        items: [
          {
            id: 'ord-item-ship-1',
            productId: 'lum-03',
            productName: 'Aura Studio Ambient Smart Lamp',
            productNameFa: 'چراغ رومیزی هوشمند امبینت آئورا استودیو',
            image: '/images/products/photo-1507473885765-e6ed057f782c.jpg',
            price: 5200000,
            quantity: 1
          },
          {
            id: 'ord-item-ship-2',
            productId: 'lum-04',
            productName: 'Chrono Apex Titanium Smartwatch',
            productNameFa: 'ساعت هوشمند پرچمدار کورونو اپکس تیتانیومی',
            image: '/images/products/photo-1523275335684-37898b6baf30.jpg',
            price: 19800000,
            quantity: 1
          }
        ],
        subtotal: 25000000,
        discount: 2500000,
        shipping: 0,
        total: 22500000,
        shippingAddress: {
          fullName: 'کیان مهرآذر',
          phone: '۰۹۱۲۳۴۵۶۷۸۹',
          city: 'تهران',
          address: 'ونک، خیابان ملاصدرا، برج فناوری لومینا',
          postalCode: '۱۹۹۱۸۵۴۳۲۱'
        },
        paymentMethod: 'درگاه آنلاین سامان'
      },
      {
        id: 'ORD-98421',
        date: '۱۴۰۳/۰۶/۱۴',
        status: 'delivered',
        statusFa: 'تحویل داده شده',
        trackingCode: 'PST-1109483321',
        courierName: 'پست پیشتاز جمهوری اسلامی',
        estimatedDelivery: 'تحویل موفق در تاریخ ۱۴ شهریور',
        items: [
          {
            id: 'ord-item-1',
            productId: 'lum-02',
            productName: 'Kanso Minimalist Mechanical Keyboard',
            productNameFa: 'کیبورد مکانیکال بی‌سیم کانسو مینیمال ۷۵٪',
            image: '/images/products/photo-1587829741301-dc798b83add3.jpg',
            price: 8900000,
            quantity: 1,
          }
        ],
        subtotal: 8900000,
        discount: 0,
        shipping: 0,
        total: 8900000,
        shippingAddress: {
          fullName: 'کیان مهرآذر',
          phone: '۰۹۱۲۳۴۵۶۷۸۹',
          city: 'تهران',
          address: 'خیابان ولیعصر، بالاتر از پارک وی، کوچه مهر',
          postalCode: '۱۹۶۸۸۱۴۵۳۲'
        },
        paymentMethod: 'درگاه آنلاین سامان'
      }
    ];
  });

  // Active user profile (fallback for unauthenticated checkout or display)
  const userProfile: UserProfile = useMemo(() => {
    if (currentUser) {
      return currentUser;
    }
    return {
      id: 'guest',
      name: lang === 'fa' ? 'کاربر مهمان' : 'Guest User',
      email: 'guest@lumina.io',
      phone: '۰۹۱۲۰۰۰۰۰۰۰',
      avatar: '/images/products/photo-1535713875002-d1d0cf377fde.jpg',
      role: 'regular',
      addresses: [
        {
          id: 'addr-default-guest',
          title: lang === 'fa' ? 'آدرس پیش‌فرض' : 'Default Address',
          city: lang === 'fa' ? 'تهران' : 'Tehran',
          address: lang === 'fa' ? 'خیابان ولیعصر، بالاتر از پارک وی' : 'Valiasr St, North Parkway',
          postalCode: '۱۹۶۸۸۱۴۵۳۲',
          isDefault: true
        }
      ]
    };
  }, [currentUser, lang]);

  // Sync dark mode class and color-scheme
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('lumina_dark_mode', JSON.stringify(darkMode));
    localStorage.setItem('lumina_theme_mode', themeMode);
  }, [darkMode, themeMode]);

  // Sync html dir & lang
  useEffect(() => {
    localStorage.setItem('lumina_lang', lang);
    if (lang === 'fa') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'fa');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }
  }, [lang]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lumina_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('lumina_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('lumina_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('lumina_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('lumina_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('lumina_orders', JSON.stringify(userOrders));
  }, [userOrders]);

  const setLang = (l: Language) => setLangState(l);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { ...toast, id, duration: toast.duration || 3500 };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auth Functions
  const openLoginModal = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const login = async (identifier: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const trimmed = identifier.trim();

    // 1. Try backend authentication API first
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: trimmed, password })
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setCurrentUser(data.user);
        localStorage.setItem('lumina_current_user', JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem('lumina_user_token', data.token);
        }
        setIsAuthModalOpen(false);
        addToast({
          title: lang === 'fa' ? 'خوش آمدید!' : 'Welcome back!',
          description: lang === 'fa' ? `${data.user.name} گرامی، به لومینا خوش آمدید.` : `Welcome back, ${data.user.name}.`,
          type: 'success'
        });
        setTimeout(() => syncOrdersWithBackend(), 100);
        return { success: true };
      } else if (!res.ok) {
        return {
          success: false,
          error: data.error || (lang === 'fa' ? 'اطلاعات ورود نادرست است.' : 'Invalid credentials.')
        };
      }
    } catch (err) {
      console.warn('Backend login endpoint unavailable, trying local fallback:', err);
    }

    // 2. Fallback to local stored registered users if offline / static
    const trimmedLower = trimmed.toLowerCase();
    const userMatch = registeredUsers.find(
      u => u.email.toLowerCase() === trimmedLower || u.phone.replace(/\s+/g, '') === trimmedLower.replace(/\s+/g, '')
    );

    if (!userMatch) {
      return {
        success: false,
        error: lang === 'fa' ? 'حساب کاربری با این مشخصات یافت نشد.' : 'No account found with this email/phone.'
      };
    }

    if (password && userMatch.password && userMatch.password !== password) {
      return {
        success: false,
        error: lang === 'fa' ? 'رمز عبور وارد شده صحیح نمی‌باشد.' : 'Incorrect password.'
      };
    }

    // Set user profile without sensitive password
    const { password: _, ...cleanProfile } = userMatch;
    setCurrentUser(cleanProfile);
    localStorage.setItem('lumina_current_user', JSON.stringify(cleanProfile));
    setIsAuthModalOpen(false);

    addToast({
      title: lang === 'fa' ? 'خوش آمدید!' : 'Welcome back!',
      description: lang === 'fa' ? `${cleanProfile.name} گرامی، به لومینا خوش آمدید.` : `Welcome back, ${cleanProfile.name}.`,
      type: 'success'
    });

    return { success: true };
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = data.email.trim().toLowerCase();
    const trimmedPhone = data.phone.trim();

    // 1. Try backend registration API first
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name.trim(),
          email: trimmedEmail,
          phone: trimmedPhone,
          password: data.password || 'password123'
        })
      });

      const result = await res.json();
      if (res.ok && result.success && result.user) {
        setCurrentUser(result.user);
        localStorage.setItem('lumina_current_user', JSON.stringify(result.user));
        if (result.token) {
          localStorage.setItem('lumina_user_token', result.token);
        }
        setIsAuthModalOpen(false);
        addToast({
          title: lang === 'fa' ? 'ثبت‌نام با موفقیت انجام شد' : 'Registration Successful',
          description: lang === 'fa' ? `خوش آمدید ${result.user.name}، حساب شما فعال گردید.` : `Welcome ${result.user.name}, your account is ready.`,
          type: 'success'
        });
        return { success: true };
      } else if (!res.ok) {
        return {
          success: false,
          error: result.error || (lang === 'fa' ? 'خطا در ثبت‌نام کاربر.' : 'Registration failed.')
        };
      }
    } catch (err) {
      console.warn('Backend register endpoint unavailable, trying local fallback:', err);
    }

    // 2. Fallback to local stored registered users if offline / static
    const exists = registeredUsers.some(
      u => u.email.toLowerCase() === trimmedEmail || u.phone === trimmedPhone
    );

    if (exists) {
      return {
        success: false,
        error: lang === 'fa' ? 'این ایمیل یا شماره موبایل قبلاً ثبت شده است.' : 'This email or phone is already registered.'
      };
    }

    const newUser: StoredUser = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      name: data.name.trim(),
      email: trimmedEmail,
      phone: trimmedPhone,
      password: data.password || 'password123',
      avatar: '/images/products/photo-1535713875002-d1d0cf377fde.jpg',
      role: 'regular',
      createdAt: new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US'),
      addresses: [
        {
          id: 'addr-' + Math.random().toString(36).substring(2, 7),
          title: lang === 'fa' ? 'آدرس پیش‌فرض' : 'Default Address',
          city: lang === 'fa' ? 'تهران' : 'Tehran',
          address: lang === 'fa' ? 'خیابان ولیعصر، برج لومینا' : 'Valiasr St, Lumina Tower',
          postalCode: '۱۹۸۷۶۵۴۳۲۱',
          isDefault: true
        }
      ]
    };

    setRegisteredUsers(prev => [...prev, newUser]);
    const { password: _, ...cleanProfile } = newUser;
    setCurrentUser(cleanProfile);
    localStorage.setItem('lumina_current_user', JSON.stringify(cleanProfile));
    setIsAuthModalOpen(false);

    addToast({
      title: lang === 'fa' ? 'ثبت‌نام با موفقیت انجام شد' : 'Registration Successful',
      description: lang === 'fa' ? `خوش آمدید، حساب شما فعال گردید.` : `Welcome to Lumina, your account is ready.`,
      type: 'success'
    });

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('lumina_current_user');
    localStorage.removeItem('lumina_user_token');
    addToast({
      title: lang === 'fa' ? 'خروج از حساب' : 'Signed Out',
      description: lang === 'fa' ? 'با موفقیت از حساب کاربری خود خارج شدید.' : 'You have signed out successfully.',
      type: 'info'
    });
  };

  const quickDemoLogin = () => {
    const { password: _, ...cleanProfile } = DEMO_USER;
    setCurrentUser(cleanProfile);
    localStorage.setItem('lumina_current_user', JSON.stringify(cleanProfile));
    setIsAuthModalOpen(false);
    addToast({
      title: lang === 'fa' ? 'ورود با حساب کاربری آزمایشی' : 'Logged in with Demo Account',
      description: lang === 'fa' ? 'خوش آمدید کیان مهرآذر (عضو VIP)' : 'Welcome Kian Mehrazar (VIP)',
      type: 'success'
    });
    setTimeout(() => syncOrdersWithBackend(), 100);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    localStorage.setItem('lumina_current_user', JSON.stringify(updated));
    setRegisteredUsers(prev => prev.map(u => (u.id === updated.id ? { ...u, ...data } : u)));

    try {
      await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, ...data })
      });
    } catch (err) {
      console.warn('Failed to sync profile to server:', err);
    }

    addToast({
      title: lang === 'fa' ? 'پروفایل به‌روزرسانی شد' : 'Profile Updated',
      type: 'success'
    });
  };

  const addAddress = async (addr: Omit<UserProfile['addresses'][0], 'id'>) => {
    if (!currentUser) return;
    const newAddress = {
      ...addr,
      id: 'addr-' + Math.random().toString(36).substring(2, 7)
    };
    const updatedAddresses = addr.isDefault
      ? [newAddress, ...currentUser.addresses.map(a => ({ ...a, isDefault: false }))]
      : [...currentUser.addresses, newAddress];

    updateUserProfile({ addresses: updatedAddresses });

    try {
      await fetch('/api/auth/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, ...addr })
      });
    } catch (err) {
      console.warn('Failed to sync address to server:', err);
    }
  };

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedColor?: string,
    selectedSize?: string,
    selectedVariant?: ProductVariant,
    selectedAttributes?: { [key: string]: string },
    selectedColorHex?: string
  ) => {
    setCart(prev => {
      const vId = selectedVariant?.id || selectedVariant?.sku;
      const existingIdx = prev.findIndex(item => {
        if (item.product.id !== product.id) return false;
        if (vId) return item.variantId === vId || item.selectedVariant?.id === vId;
        return item.selectedColor === selectedColor && item.selectedSize === selectedSize;
      });

      const effectivePrice = selectedVariant?.price ?? product.price;
      const productWithPrice = { ...product, price: effectivePrice };

      if (existingIdx > -1) {
        const updated = [...prev];
        const maxStock = selectedVariant?.stock ?? product.stock;
        const newQty = Math.min(updated[existingIdx].quantity + quantity, maxStock);
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          selectedColor: selectedColor || updated[existingIdx].selectedColor,
          selectedColorHex: selectedColorHex || updated[existingIdx].selectedColorHex,
          selectedSize: selectedSize || updated[existingIdx].selectedSize,
          selectedAttributes: selectedAttributes || updated[existingIdx].selectedAttributes,
          selectedVariant: selectedVariant || updated[existingIdx].selectedVariant,
          variantId: vId || updated[existingIdx].variantId,
          variantSku: selectedVariant?.sku || updated[existingIdx].variantSku,
          product: productWithPrice
        };
        return updated;
      }

      return [
        ...prev,
        {
          product: productWithPrice,
          quantity,
          selectedColor,
          selectedColorHex,
          selectedSize,
          selectedAttributes,
          selectedVariant,
          variantId: vId,
          variantSku: selectedVariant?.sku
        }
      ];
    });

    addToast({
      title: lang === 'fa' ? 'به سبد خرید اضافه شد' : 'Added to Cart',
      description: lang === 'fa'
        ? `${product.nameFa} ${selectedColor ? `(${selectedColor}${selectedSize ? ` - ${selectedSize}` : ''})` : ''} با موفقیت افزوده شد.`
        : `${product.name} added to cart.`,
      type: 'success'
    });
  };

  const removeFromCart = (
    cartItemIndexOrProductId: number | string,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    setCart(prev => prev.filter((item, idx) => {
      if (typeof cartItemIndexOrProductId === 'number') {
        return idx !== cartItemIndexOrProductId;
      }
      if (item.product.id !== cartItemIndexOrProductId) return true;
      if (selectedColor && item.selectedColor && item.selectedColor !== selectedColor) return true;
      if (selectedSize && item.selectedSize && item.selectedSize !== selectedSize) return true;
      return false;
    }));
    addToast({
      title: lang === 'fa' ? 'حذف از سبد' : 'Removed from cart',
      description: lang === 'fa' ? 'محصول از سبد خرید شما خارج شد.' : 'Item removed from your cart.',
      type: 'info'
    });
  };

  const updateCartQuantity = (
    cartItemIndexOrProductId: number | string,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    setCart(prev =>
      prev
        .map((item, idx) => {
          const isTarget = typeof cartItemIndexOrProductId === 'number'
            ? idx === cartItemIndexOrProductId
            : item.product.id === cartItemIndexOrProductId &&
              (!selectedColor || !item.selectedColor || item.selectedColor === selectedColor) &&
              (!selectedSize || !item.selectedSize || item.selectedSize === selectedSize);
          if (isTarget) {
            const newQty = quantity;
            if (newQty <= 0) return null;
            const maxStock = item.selectedVariant?.stock ?? item.product.stock;
            if (newQty > maxStock) {
              addToast({
                title: lang === 'fa' ? 'محدودیت موجودی' : 'Stock Limit',
                description: lang === 'fa' ? 'تعداد انتخابی بیش از موجودی انبار این تنوع است.' : 'Maximum stock reached.',
                type: 'warning'
              });
              return { ...item, quantity: maxStock };
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    const exists = wishlist.includes(productId);
    const prod = productsList.find(p => p.id === productId) || PRODUCTS.find(p => p.id === productId);
    if (exists) {
      setWishlist(prev => prev.filter(id => id !== productId));
      addToast({
        title: lang === 'fa' ? 'از علاقه‌مندی‌ها حذف شد' : 'Removed from Wishlist',
        type: 'info'
      });
    } else {
      setWishlist(prev => [...prev, productId]);
      addToast({
        title: lang === 'fa' ? 'به علاقه‌مندی‌ها اضافه شد' : 'Added to Wishlist',
        description: prod ? (lang === 'fa' ? prod.nameFa : prod.name) : undefined,
        type: 'success'
      });
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('lumina_wishlist');
    addToast({
      title: lang === 'fa' ? 'لیست علاقه‌مندی‌ها خالی شد' : 'Wishlist Cleared',
      type: 'info'
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const applyCoupon = async (code: string): Promise<boolean> => {
    const trimmed = normalizeCouponCode(code);
    if (!trimmed) {
      addToast({
        title: lang === 'fa' ? 'کد تخفیف را وارد کنید' : 'Enter Coupon Code',
        description: lang === 'fa' ? 'لطفاً ابتدا کد تخفیف را در کادر مربوطه تایپ فرمایید.' : 'Please enter a coupon code.',
        type: 'warning'
      });
      return false;
    }

    const subtotal = cart.reduce((acc, item) => {
      const itemPrice = item.selectedVariant?.price ?? item.product.price;
      return acc + itemPrice * item.quantity;
    }, 0);

    // Try backend validation first
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed, subtotal, items: cart })
      });

      if (res.ok) {
        const valData = await res.json();
        if (valData.valid && valData.coupon) {
          setAppliedCoupon({
            code: valData.coupon.code,
            percent: valData.coupon.discountPercent,
            maxDiscount: valData.coupon.maxDiscount,
            minPurchase: valData.coupon.minPurchase
          });

          addToast({
            title: lang === 'fa' ? 'کد تخفیف با موفقیت اعمال شد' : 'Coupon Applied',
            description: valData.coupon.festivalTitle
              ? (lang === 'fa' ? `تخفیف جشنواره «${valData.coupon.festivalTitle}» با موفقیت فعال شد.` : 'Festival coupon activated.')
              : (lang === 'fa' ? `${valData.coupon.discountPercent}٪ تخفیف برای سفارش شما اعمال شد.` : 'Coupon activated.'),
            type: 'success'
          });
          return true;
        } else if (valData.error) {
          addToast({
            title: lang === 'fa' ? 'کد تخفیف نامعتبر است' : 'Invalid Coupon Code',
            description: valData.error,
            type: 'warning'
          });
          return false;
        }
      }
    } catch {
      // Backend unavailable, fallback to local coupons
    }

    // Try fetching fresh coupons list from backend
    let allCoupons = couponsList;
    try {
      const res = await fetch('/api/coupons');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          allCoupons = data;
          setCouponsList(data);
        }
      }
    } catch {
      // Use existing/fallback coupons
    }

    // Find matching coupon (case-insensitive & Persian normalized)
    const found =
      allCoupons.find(c => normalizeCouponCode(c.code) === trimmed) ||
      DEFAULT_COUPONS.find(c => normalizeCouponCode(c.code) === trimmed);

    if (!found) {
      addToast({
        title: lang === 'fa' ? 'کد تخفیف نامعتبر است' : 'Invalid Coupon Code',
        description: lang === 'fa'
          ? `کد تخفیف «${trimmed}» یافت نشد یا در سیستم ثبت نشده است.`
          : `Coupon "${trimmed}" was not found or is invalid.`,
        type: 'error'
      });
      return false;
    }

    if (found.isActive === false) {
      addToast({
        title: lang === 'fa' ? 'کد تخفیف غیرفعال است' : 'Coupon Inactive',
        description: lang === 'fa'
          ? 'این کد تخفیف در حال حاضر غیرفعال یا منقضی شده است.'
          : 'This coupon code is currently inactive or expired.',
        type: 'error'
      });
      return false;
    }

    // Check minimum purchase amount requirement
    if (found.minPurchase && subtotal < found.minPurchase) {
      addToast({
        title: lang === 'fa' ? 'شرط حداقل خرید رعایت نشده' : 'Minimum Purchase Required',
        description: lang === 'fa'
          ? `حداقل مبلغ خرید برای فعال‌سازی این کد، ${formatPrice(found.minPurchase)} است.`
          : `Minimum purchase for this coupon is ${formatPrice(found.minPurchase)}.`,
        type: 'warning'
      });
      return false;
    }

    // Successfully apply coupon
    setAppliedCoupon({
      code: found.code,
      percent: found.discountPercent,
      maxDiscount: found.maxDiscount,
      minPurchase: found.minPurchase
    });

    addToast({
      title: lang === 'fa' ? 'کد تخفیف با موفقیت اعمال شد' : 'Coupon Applied Successfully',
      description: lang === 'fa'
        ? `${found.discountPercent}٪ تخفیف${found.maxDiscount ? ` (تا سقف ${formatPrice(found.maxDiscount)})` : ''} برای سفارش شما اعمال شد.`
        : `${found.discountPercent}% discount applied to your cart.`,
      type: 'success'
    });

    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast({
      title: lang === 'fa' ? 'کد تخفیف حذف شد' : 'Coupon Removed',
      type: 'info'
    });
  };

  const cartTotal = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => {
      const itemPrice = item.selectedVariant?.price ?? item.product.price;
      return acc + itemPrice * item.quantity;
    }, 0);
    let discountAmount = 0;
    if (appliedCoupon) {
      const calculated = Math.round((subtotal * appliedCoupon.percent) / 100);
      if (appliedCoupon.maxDiscount && appliedCoupon.maxDiscount > 0) {
        discountAmount = Math.min(calculated, appliedCoupon.maxDiscount);
      } else {
        discountAmount = calculated;
      }
    }
    const shipping = subtotal > 15000000 || subtotal === 0 ? 0 : 45000;
    const total = Math.max(0, subtotal - discountAmount + shipping);

    return {
      subtotal,
      discount: discountAmount,
      shipping,
      total
    };
  }, [cart, appliedCoupon]);

  const resetFilters = () => setFilters(initialFilters);

  const placeOrder = async (shippingDetails: any, paymentMethod: string): Promise<string> => {
    const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US'),
      status: 'processing',
      statusFa: 'در حال پردازش',
      items: cart.map(item => ({
        id: Math.random().toString(36).substr(2, 9),
        productId: item.product.id,
        productName: item.product.name,
        productNameFa: item.product.nameFa,
        image: item.selectedVariant?.image || item.product.images[0],
        price: item.selectedVariant?.price ?? item.product.price,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedColorHex: item.selectedColorHex,
        selectedSize: item.selectedSize,
        selectedAttributes: item.selectedAttributes,
        variantId: item.variantId,
        variantSku: item.variantSku
      })),
      subtotal: cartTotal.subtotal,
      discount: cartTotal.discount,
      shipping: cartTotal.shipping,
      total: cartTotal.total,
      shippingAddress: shippingDetails,
      paymentMethod,
      trackingCode: 'LMN-' + Math.floor(10000000 + Math.random() * 90000000),
      courierName: 'پیک اختصاصی اکسپرس لومینا',
      estimatedDelivery: '۲۴ الی ۴۸ ساعت آینده'
    };

    // Save locally
    setUserOrders(prev => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);

    // Sync to Express backend API so Admin Dashboard sees this order immediately
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          userId: currentUser?.id,
          customer: {
            name: shippingDetails.fullName || userProfile.name,
            phone: shippingDetails.phone || userProfile.phone,
            email: currentUser?.email || 'customer@lumina.io',
            city: shippingDetails.city || 'تهران',
            address: shippingDetails.address,
            postalCode: shippingDetails.postalCode
          },
          items: newOrder.items,
          total: newOrder.total,
          subtotal: newOrder.subtotal,
          discount: newOrder.discount,
          shipping: newOrder.shipping,
          paymentMethod
        })
      });
    } catch (err) {
      console.warn('Could not sync order to backend:', err);
    }

    return orderId;
  };

  const [isSyncingOrders, setIsSyncingOrders] = useState(false);
  const hasInitializedOrdersRef = useRef(false);

  const syncOrdersWithBackend = async () => {
    setIsSyncingOrders(true);
    try {
      const url = currentUser?.id
        ? `/api/orders?userId=${encodeURIComponent(currentUser.id)}&email=${encodeURIComponent(currentUser.email || '')}`
        : '/api/orders';
      const res = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const text = await res.text();
        if (!text || text.trim().startsWith('<')) return;
        let serverOrders;
        try {
          serverOrders = JSON.parse(text);
        } catch {
          return;
        }
        if (Array.isArray(serverOrders) && serverOrders.length > 0) {
          setUserOrders(prevOrders => {
            // Check status changes for toast/sound alerts
            if (hasInitializedOrdersRef.current) {
              serverOrders.forEach((serverOrder: any) => {
                const localMatch = prevOrders.find(lo => lo.id === serverOrder.id);
                if (
                  localMatch &&
                  localMatch.status &&
                  serverOrder.status &&
                  localMatch.status !== serverOrder.status
                ) {
                  playNotificationChime();
                  const statusFa = serverOrder.statusFa || serverOrder.status;
                  addToast({
                    title: lang === 'fa' ? 'تغییر وضعیت مرسوله توسط مدیریت' : 'Order Status Updated by Admin',
                    description:
                      lang === 'fa'
                        ? `سفارش ${serverOrder.id} به وضعیت «${statusFa}» تغییر یافت.`
                        : `Order ${serverOrder.id} status was updated to "${serverOrder.status}".`,
                    type: 'order',
                    orderId: serverOrder.id,
                    statusFa: statusFa,
                    duration: 7000,
                    actionText: lang === 'fa' ? 'مشاهده در داشبورد' : 'View in Dashboard',
                    onAction: () => setActiveTabState('profile')
                  });
                }
              });
            }

            // Map existing orders with latest server data
            const updated = prevOrders.map(localOrder => {
              const match = serverOrders.find((s: any) => s.id === localOrder.id);
              if (match) {
                return {
                  ...localOrder,
                  status: match.status || localOrder.status,
                  statusFa: match.statusFa || localOrder.statusFa,
                  trackingCode: match.trackingNumber || match.trackingCode || localOrder.trackingCode,
                  courierName: match.courierName || match.courier || localOrder.courierName,
                  estimatedDelivery: match.estimatedDelivery || localOrder.estimatedDelivery,
                  statusAdminNote: match.statusAdminNote || match.adminNote || localOrder.statusAdminNote,
                  lastUpdatedByAdmin: match.lastUpdatedByAdmin || localOrder.lastUpdatedByAdmin
                };
              }
              return localOrder;
            });

            // Include any server orders that weren't in local list
            for (const so of serverOrders) {
              if (!updated.some(u => u.id === so.id)) {
                updated.push({
                  id: so.id,
                  date: so.date || new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US'),
                  status: so.status || 'processing',
                  statusFa: so.statusFa || 'در حال پردازش',
                  trackingCode: so.trackingNumber || so.trackingCode || 'TRK-0000',
                  courierName: so.courierName || 'پیک اکسپرس لومینا',
                  estimatedDelivery: so.estimatedDelivery || '۲۴ الی ۴۸ ساعت آینده',
                  statusAdminNote: so.statusAdminNote || '',
                  items: so.items || [],
                  subtotal: so.subtotal || so.total || 0,
                  discount: so.discount || 0,
                  shipping: so.shipping || 0,
                  total: so.total || 0,
                  shippingAddress: so.customer || {
                    fullName: so.customer?.name || 'کاربر لومینا',
                    phone: so.customer?.phone || '',
                    city: so.customer?.city || 'تهران',
                    address: so.customer?.address || '',
                    postalCode: so.customer?.postalCode || ''
                  },
                  paymentMethod: so.paymentMethod || 'درگاه آنلاین سامان'
                });
              }
            }

            try {
              localStorage.setItem('lumina_orders', JSON.stringify(updated));
            } catch (e) {
              console.warn('Could not save synced orders to localStorage:', e);
            }

            return updated;
          });
          hasInitializedOrdersRef.current = true;
        }
      }
    } catch (err) {
      console.warn('Sync orders with backend skipped:', err);
    } finally {
      setIsSyncingOrders(false);
    }
  };

  // Sync on mount, periodic check, and listen to live events
  useEffect(() => {
    syncOrdersWithBackend();

    const handleOrderUpdated = () => {
      syncOrdersWithBackend();
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'lumina_orders' && e.newValue) {
        try {
          setUserOrders(JSON.parse(e.newValue));
        } catch {
          syncOrdersWithBackend();
        }
      }
    };

    const interval = setInterval(syncOrdersWithBackend, 12000);
    window.addEventListener('focus', syncOrdersWithBackend);
    window.addEventListener('lumina_order_status_updated', handleOrderUpdated);
    window.addEventListener('storage', handleStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', syncOrdersWithBackend);
      window.removeEventListener('lumina_order_status_updated', handleOrderUpdated);
      window.removeEventListener('storage', handleStorage);
    };
  }, [lang]);

  const updateOrderStatus = async (
    orderId: string,
    newStatus: Order['status'],
    extra?: { trackingCode?: string; trackingNumber?: string; courierName?: string; courier?: string; estimatedDelivery?: string; adminNote?: string; statusAdminNote?: string }
  ) => {
    const statusMap: Record<string, string> = {
      pending: 'در انتظار پرداخت',
      paid: 'پرداخت شده',
      processing: 'در حال پردازش',
      shipped: 'ارسال شده',
      delivered: 'تحویل داده شده',
      cancelled: 'لغو شده'
    };

    const updatedFa = statusMap[newStatus] || newStatus;
    const nowFa = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

    const tracking = extra?.trackingCode || extra?.trackingNumber;
    const courier = extra?.courierName || extra?.courier;
    const estDelivery = extra?.estimatedDelivery;
    const adminNote = extra?.adminNote || extra?.statusAdminNote;

    setUserOrders(prev => {
      const updated = prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: newStatus,
            statusFa: updatedFa,
            trackingCode: tracking || order.trackingCode,
            courierName: courier || order.courierName,
            estimatedDelivery: estDelivery || order.estimatedDelivery,
            statusAdminNote: adminNote !== undefined ? adminNote : order.statusAdminNote,
            lastUpdatedByAdmin: nowFa
          };
        }
        return order;
      });
      try {
        localStorage.setItem('lumina_orders', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });

    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber: tracking,
          trackingCode: tracking,
          courierName: courier,
          courier: courier,
          estimatedDelivery: estDelivery,
          statusAdminNote: adminNote,
          adminNote: adminNote
        })
      });
    } catch (err) {
      console.warn('Error patching order status to backend:', err);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('lumina_order_status_updated', {
          detail: { orderId, status: newStatus, statusFa: updatedFa }
        })
      );
    }

    playNotificationChime();

    addToast({
      title: lang === 'fa' ? 'تغییر وضعیت سفارش توسط مدیریت' : 'Order Status Updated by Admin',
      description:
        lang === 'fa'
          ? `سفارش ${orderId} به وضعیت «${updatedFa}» تغییر یافت و در پنل کاربر ثبت شد.`
          : `Order ${orderId} status changed to "${newStatus}".`,
      type: 'order',
      statusFa: updatedFa,
      orderId: orderId,
      duration: 7000,
      actionText: lang === 'fa' ? 'مشاهده در داشبورد' : 'View in Dashboard',
      onAction: () => setActiveTabState('profile')
    });
  };

  const formatPrice = (priceToman: any, _priceUSD?: number) => {
    let numeric = 0;
    if (typeof priceToman === 'number' && !isNaN(priceToman)) {
      numeric = priceToman;
    } else if (priceToman && typeof priceToman === 'object') {
      if (typeof priceToman.total === 'number') {
        numeric = priceToman.total;
      } else if (typeof priceToman.subtotal === 'number') {
        numeric = priceToman.subtotal;
      }
    } else if (typeof priceToman === 'string') {
      const parsed = parseFloat(priceToman);
      if (!isNaN(parsed)) numeric = parsed;
    }

    if (lang === 'fa') {
      return `${numeric.toLocaleString('fa-IR')} تومان`;
    }
    return `${numeric.toLocaleString('en-US')} Toman`;
  };

  const recentlyViewed = useMemo(() => {
    return recentlyViewedIds
      .map(id => productsList.find(p => p.id === id))
      .filter((p): p is Product => Boolean(p));
  }, [recentlyViewedIds, productsList]);

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setActiveTabState('product-detail');
    setRecentlyViewedIds(prev => [product.id, ...prev.filter(id => id !== product.id)].slice(0, 10));
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin')) {
      window.history.pushState({ productId: product.id }, '', `/product/${product.id}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Browser back / forward button listener for seamless deep linking
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      if (window.location.pathname.startsWith('/admin')) return;

      const parsed = parseRouteFromUrl(productsList);
      setActiveTabState(parsed.tab);
      setSelectedProduct(parsed.product);
      if (parsed.category) {
        setFilters(prev => ({ ...prev, selectedCategory: parsed.category }));
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [productsList]);

  return (
    <StoreContext.Provider
      value={{
        products: productsList,
        refetchProducts: fetchProductsFromApi,
        cart,
        wishlist,
        lang,
        setLang,
        accentColor,
        setAccentColor,
        darkMode,
        themeMode,
        setThemeMode,
        toggleDarkMode,
        activeTab,
        setActiveTab,
        selectedProduct,
        setSelectedProduct,
        quickViewProduct,
        setQuickViewProduct,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isMobileFilterOpen,
        setIsMobileFilterOpen,
        filters,
        setFilters,
        resetFilters,
        viewMode,
        setViewMode,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        clearWishlist,
        isInWishlist,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartTotal,
        toasts,
        addToast,
        removeToast,
        userOrders,
        updateOrderStatus,
        syncOrdersWithBackend,
        isSyncingOrders,
        placeOrder,
        currentUser,
        isAuthenticated: !!currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openLoginModal,
        openRegisterModal,
        login,
        register,
        logout,
        quickDemoLogin,
        updateUserProfile,
        addAddress,
        userProfile,
        formatPrice,
        openProductDetails,
        recentlyViewed,
        clearRecentlyViewed,
        festivals,
        activeFestival,
        selectedFestival,
        setSelectedFestival,
        openFestivalPage,
        refetchFestivals: fetchFestivalsFromApi,
        addFestivalProductToCart,
        categories: categoriesList,
        refetchCategories: fetchCategoriesFromApi,
      }}

    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
