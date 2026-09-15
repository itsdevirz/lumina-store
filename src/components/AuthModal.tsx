import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    quickDemoLogin,
    lang
  } = useStore();

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setErrorMessage(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginIdentifier.trim()) {
      setErrorMessage(
        lang === 'fa'
          ? 'لطفاً آدرس ایمیل یا شماره همراه خود را وارد فرمایید.'
          : 'Please enter your email or phone number.'
      );
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(loginIdentifier, loginPassword);
      if (!res.success) {
        setErrorMessage(res.error || (lang === 'fa' ? 'اطلاعات ورود نامعتبر است.' : 'Invalid credentials.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regName.trim()) {
      setErrorMessage(lang === 'fa' ? 'لطفاً نام و نام خانوادگی را وارد فرمایید.' : 'Please enter your name.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMessage(lang === 'fa' ? 'لطفاً یک آدرس ایمیل معتبر وارد کنید.' : 'Please enter a valid email.');
      return;
    }
    if (!regPhone.trim() || regPhone.length < 10) {
      setErrorMessage(lang === 'fa' ? 'لطفاً شماره موبایل معتبر وارد کنید.' : 'Please enter a valid phone number.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage(
        lang === 'fa'
          ? 'رمز عبور باید حداقل شامل ۶ کاراکتر باشد.'
          : 'Password must be at least 6 characters long.'
      );
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage(lang === 'fa' ? 'تکرار رمز عبور مطابقت ندارد.' : 'Passwords do not match.');
      return;
    }
    if (!acceptTerms) {
      setErrorMessage(
        lang === 'fa'
          ? 'لطفاً قوانین و مقررات خرید از لومینا را تایید فرمایید.'
          : 'Please accept the terms of service.'
      );
      return;
    }

    setIsLoading(true);
    try {
      const res = await register({
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword
      });
      if (!res.success) {
        setErrorMessage(res.error || (lang === 'fa' ? 'خطا در ثبت نام رخ داد.' : 'Registration failed.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs transition-opacity"
      onClick={handleClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-md bg-white dark:bg-[#0F172A] rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800/90 overflow-hidden"
      >
        {/* Top Header Glow Bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-[#E80645]" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 rtl:left-auto rtl:right-auto rtl:left-4 ltr:right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Logo & Brand Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/80 text-[#E80645] dark:text-rose-400 mb-3 border border-rose-200 dark:border-rose-900/50">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {authModalMode === 'login'
                ? (lang === 'fa' ? 'ورود به حساب کاربری' : 'Sign in to Lumina')
                : (lang === 'fa' ? 'عضویت در خانواده لومینا' : 'Create an Account')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {lang === 'fa'
                ? 'پیگیری آنلاین سفارش‌ها، دسترسی به لیست علاقه‌مندی‌ها و تخفیف‌ها'
                : 'Access your orders, track shipments and exclusive offers'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('login');
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                authModalMode === 'login'
                  ? 'bg-white dark:bg-slate-900 text-[#E80645] dark:text-rose-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>{lang === 'fa' ? 'ورود به حساب' : 'Sign In'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('register');
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                authModalMode === 'register'
                  ? 'bg-white dark:bg-slate-900 text-[#E80645] dark:text-rose-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>{lang === 'fa' ? 'ثبت‌نام جدید' : 'Register'}</span>
            </button>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 p-3.5 mb-5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-medium"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* LOGIN FORM */}
          {authModalMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {lang === 'fa' ? 'آدرس ایمیل یا شماره موبایل' : 'Email or Phone'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 rtl:right-3.5 ltr:left-3.5 ltr:right-auto flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                    placeholder={lang === 'fa' ? 'kian.mehrazar@lumina.io یا ۰۹۱۲...' : 'name@example.com or phone'}
                    dir="ltr"
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-3.5 py-3 text-slate-900 dark:text-white placeholder-slate-400 rtl:pr-10 ltr:pl-10 focus:bg-white dark:focus:bg-slate-900 focus:border-[#E80645] focus:ring-2 focus:ring-[#E80645]/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {lang === 'fa' ? 'رمز عبور' : 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginIdentifier('kian.mehrazar@lumina.io');
                      setLoginPassword('password123');
                    }}
                    className="text-[11px] text-[#E80645] dark:text-rose-400 hover:underline cursor-pointer"
                  >
                    {lang === 'fa' ? 'تکمیل خودکار اطلاعات دمو' : 'Autofill Demo'}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 rtl:right-3.5 ltr:left-3.5 ltr:right-auto flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    dir="ltr"
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-3.5 py-3 text-slate-900 dark:text-white placeholder-slate-400 rtl:pr-10 rtl:pl-10 ltr:pl-10 ltr:pr-10 focus:bg-white dark:focus:bg-slate-900 focus:border-[#E80645] focus:ring-2 focus:ring-[#E80645]/20 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute inset-y-0 left-0 rtl:left-3.5 ltr:right-3.5 ltr:left-auto flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-[#E80645] focus:ring-[#E80645] w-4 h-4"
                  />
                  <span>{lang === 'fa' ? 'مرا به خاطر بسپار' : 'Remember me'}</span>
                </label>
                <span className="text-slate-400 text-[11px]">
                  {lang === 'fa' ? 'رمز پیش‌فرض دمو: password123' : 'Default: password123'}
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#E80645] hover:bg-[#c7053b] active:scale-98 text-white font-bold text-xs shadow-md shadow-rose-900/25 transition-all disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>{lang === 'fa' ? 'ورود امن به حساب' : 'Sign In'}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {authModalMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'fa' ? 'نام و نام خانوادگی' : 'Full Name'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 rtl:right-3.5 ltr:left-3.5 ltr:right-auto flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder={lang === 'fa' ? 'مثال: سارا رادمنش' : 'Sara Radmanesh'}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 rtl:pr-10 ltr:pl-10 focus:bg-white dark:focus:bg-slate-900 focus:border-[#E80645] focus:ring-2 focus:ring-[#E80645]/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'fa' ? 'شماره موبایل' : 'Phone Number'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 rtl:right-3.5 ltr:left-3.5 ltr:right-auto flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                      dir="ltr"
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 rtl:pr-9 ltr:pl-9 focus:bg-white dark:focus:bg-slate-900 focus:border-[#E80645] focus:ring-2 focus:ring-[#E80645]/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'fa' ? 'ایمیل' : 'Email'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 rtl:right-3.5 ltr:left-3.5 ltr:right-auto flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="user@example.com"
                      dir="ltr"
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 rtl:pr-9 ltr:pl-9 focus:bg-white dark:focus:bg-slate-900 focus:border-[#E80645] focus:ring-2 focus:ring-[#E80645]/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'fa' ? 'رمز عبور' : 'Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="حداقل ۶ کاراکتر"
                      dir="ltr"
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-[#E80645] focus:ring-2 focus:ring-[#E80645]/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'fa' ? 'تکرار رمز' : 'Confirm'}
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      placeholder="تکرار رمز عبور"
                      dir="ltr"
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-[#E80645] focus:ring-2 focus:ring-[#E80645]/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs pt-1">
                <input
                  type="checkbox"
                  id="accept-terms"
                  checked={acceptTerms}
                  onChange={e => setAcceptTerms(e.target.checked)}
                  className="rounded border-slate-300 text-[#E80645] focus:ring-[#E80645] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="accept-terms" className="text-slate-600 dark:text-slate-400 cursor-pointer">
                  {lang === 'fa' ? 'قوانین و شرایط خرید از لومینا را می‌پذیرم' : 'I accept the Terms & Privacy policy'}
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#E80645] hover:bg-[#c7053b] active:scale-98 text-white font-bold text-xs shadow-md shadow-rose-900/25 transition-all disabled:opacity-60 mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>{lang === 'fa' ? 'تکمیل ثبت‌نام و ورود' : 'Complete Registration'}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Login Option */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              type="button"
              onClick={quickDemoLogin}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-[#E80645] dark:text-rose-300 text-xs font-bold transition-colors cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{lang === 'fa' ? 'ورود فوری با حساب کاربری آزمایشی (Demo VIP)' : 'Instant Demo Login (VIP User)'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
