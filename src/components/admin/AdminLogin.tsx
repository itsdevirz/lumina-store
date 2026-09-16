import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowLeft, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { AdminUser } from '../../types/admin';
import { LuminaLogo } from '../LuminaLogo';

interface AdminLoginProps {
  onLoginSuccess: (admin: AdminUser, token: string) => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToStore }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let isBackendSuccessful = false;
      let backendAdmin: any = null;
      let backendToken: string | null = null;
      let apiErrorMessage: string | null = null;

      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const text = await res.text();
          if (text && !text.trim().startsWith('<')) {
            const data = JSON.parse(text);
            if (res.ok && data.success) {
              isBackendSuccessful = true;
              backendAdmin = data.admin;
              backendToken = data.token;
            } else {
              apiErrorMessage = data.message || 'نام کاربری یا رمز عبور نامعتبر است';
            }
          }
        }
      } catch (networkErr) {
        console.warn('Backend server not directly reachable:', networkErr);
      }

      // If backend responded with valid auth
      if (isBackendSuccessful && backendAdmin && backendToken) {
        localStorage.setItem('lumina_admin_token', backendToken);
        localStorage.setItem('lumina_admin_user', JSON.stringify(backendAdmin));
        onLoginSuccess(backendAdmin, backendToken);
        return;
      }

      // If backend explicitly rejected the credentials
      if (apiErrorMessage) {
        throw new Error(apiErrorMessage);
      }

      // Built-in admin credentials fallback
      const trimmedUser = username.trim().toLowerCase();
      if (
        (trimmedUser === 'admin' || trimmedUser === 'admin@luminastore.ir') &&
        (password === 'admin123' || password === 'admin')
      ) {
        const fallbackAdmin: AdminUser = {
          id: 'adm-01',
          name: 'مدیر ارشد لومینا',
          email: 'admin@luminastore.ir',
          username: 'admin',
          role: 'super_admin',
          avatar: '/images/products/photo-1534528741775-53994a69daeb.jpg',
          lastLogin: 'هم‌اکنون'
        };
        const fallbackToken = 'jwt_admin_lumina_secret_session_token';
        localStorage.setItem('lumina_admin_token', fallbackToken);
        localStorage.setItem('lumina_admin_user', JSON.stringify(fallbackAdmin));
        onLoginSuccess(fallbackAdmin, fallbackToken);
      } else {
        throw new Error('نام کاربری یا کلمه عبور نامعتبر است');
      }
    } catch (err: any) {
      setError(err.message || 'خطا در ورود به سامانه');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setUsername('admin');
    setPassword('admin123');
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const mockAdmin: AdminUser = {
        id: 'adm-01',
        name: 'مدیر ارشد لومینا',
        email: 'admin@luminastore.ir',
        username: 'admin',
        role: 'super_admin',
        avatar: '/images/products/photo-1534528741775-53994a69daeb.jpg',
        lastLogin: 'هم‌اکنون'
      };
      localStorage.setItem('lumina_admin_token', 'jwt_admin_lumina_secret_session_token');
      localStorage.setItem('lumina_admin_user', JSON.stringify(mockAdmin));
      onLoginSuccess(mockAdmin, 'jwt_admin_lumina_secret_session_token');
      setIsLoading(false);
    }, 350);
  };

  return (
    <div
      className="min-h-screen bg-[#09090B] text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[#62DB00]/30 selection:text-white"
      dir="rtl"
    >
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-[#62DB00]/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Top Header branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-5">
            <LuminaLogo variant="full" size="md" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#62DB00]/10 border border-[#62DB00]/25 text-[#62DB00] text-[11px] font-mono tracking-wider font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ENTERPRISE CONTROL PLANE</span>
          </div>

          <h1 className="text-xl font-black text-white tracking-tight">
            سامانه مدیریت مرکزی لومینا
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            دسترسی به بخش مدیریت کاتالوگ، انبار، سفارش‌ها و مانیتورینگ زنده
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-[#121215] border border-zinc-800/90 rounded-2xl p-6 sm:p-7 shadow-2xl">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                نام کاربری یا ایمیل مدیریت
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:border-[#62DB00] focus:ring-1 focus:ring-[#62DB00] outline-hidden transition-all"
                />
                <User className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                کلمه عبور امنیتی
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:border-[#62DB00] focus:ring-1 focus:ring-[#62DB00] outline-hidden transition-all"
                />
                <Lock className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#62DB00] hover:bg-[#52B800] text-black font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#62DB00]/15 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>ورود به سامانه مدیریت</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Button */}
          <div className="mt-5 pt-5 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 px-4 rounded-xl border border-zinc-700/70 bg-zinc-900 hover:bg-zinc-800/80 text-zinc-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#62DB00]" />
              <span>ورود سریع با کاربر آزمایشی</span>
            </button>
            <p className="text-[11px] text-zinc-400 text-center mt-2.5 font-mono">
              admin / admin123
            </p>
          </div>
        </div>

        {/* Back to store link */}
        <div className="text-center mt-6">
          <button
            onClick={onBackToStore}
            className="text-xs text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>بازگشت به ویترین فروشگاه</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
