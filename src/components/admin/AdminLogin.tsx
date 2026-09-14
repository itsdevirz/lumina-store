import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { AdminUser } from '../../types/admin';

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

      // If backend was not reached or returned HTML (e.g. running on static web host / cPanel without Node.js):
      // Verify built-in admin credentials gracefully so admin is NEVER locked out!
      const trimmedUser = username.trim().toLowerCase();
      if ((trimmedUser === 'admin' || trimmedUser === 'admin@luminastore.ir') && (password === 'admin123' || password === 'admin')) {
        const fallbackAdmin: AdminUser = {
          id: 'adm-01',
          name: 'مدیر ارشد لومینا',
          email: 'admin@luminastore.ir',
          username: 'admin',
          role: 'super_admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80&auto=format&fit=crop',
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
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80&auto=format&fit=crop',
        lastLogin: 'هم‌اکنون'
      };
      localStorage.setItem('lumina_admin_token', 'jwt_admin_lumina_secret_session_token');
      localStorage.setItem('lumina_admin_user', JSON.stringify(mockAdmin));
      onLoginSuccess(mockAdmin, 'jwt_admin_lumina_secret_session_token');
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans" dir="rtl">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Top Header info */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-4 shadow-xl shadow-indigo-600/10">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            سامانه مدیریت لومینا استور
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            ورود ایمن به پنل کنترل، آمار و مدیریت محصولات
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40">
          {error && (
            <div className="mb-5 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                نام کاربری مدیر
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden transition-all"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                کلمه عبور
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>ورود به پنل مدیریت</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Button */}
          <div className="mt-5 pt-5 border-t border-slate-700/60">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 px-4 rounded-xl border border-indigo-500/30 bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>ورود سریع آزمایشی (بدون نیاز به تایپ)</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2.5">
              نام کاربری پیش‌فرض: <code className="text-slate-300 font-mono">admin</code> | کلمه عبور:{' '}
              <code className="text-slate-300 font-mono">admin123</code>
            </p>
          </div>
        </div>

        {/* Back to store link */}
        <div className="text-center mt-6">
          <button
            onClick={onBackToStore}
            className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <span>بازگشت به ویترین فروشگاه</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};
