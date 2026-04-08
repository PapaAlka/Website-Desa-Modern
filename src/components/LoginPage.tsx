import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Loader2, 
  AlertCircle,
  Info
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginPageProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

export default function LoginPage({ onBack, onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMock, setIsUsingMock] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Email dan Password wajib diisi.');
      return;
    }

    setIsLoading(true);

    try {
      // Try real Supabase Auth first
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Fallback to mock login for development if real auth fails
        console.warn('Supabase Auth failed, checking mock credentials:', authError.message);
        
        if (email === 'admin@desa.id' && password === 'admin123') {
          setIsUsingMock(true);
          setIsLoading(false);
          onLoginSuccess();
          return;
        }
        
        throw authError;
      }

      if (data.user) {
        setIsLoading(false);
        onLoginSuccess();
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Gagal masuk. Periksa kembali email dan password Anda.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4 font-sans text-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-600 rounded-3xl shadow-lg shadow-emerald-900/20 text-white font-bold text-3xl mb-4">
            D
          </div>
          <h1 className="text-2xl font-bold text-emerald-950">Desa Sejahtera</h1>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">Portal Administrasi Desa</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-emerald-900/5 border border-stone-100 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 blur-2xl opacity-50"></div>
          
          <h2 className="text-xl font-bold text-slate-800 mb-8">Masuk ke Akun</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl flex items-start gap-3 text-sm"
                >
                  <AlertCircle className="shrink-0 mt-0.5" size={18} />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3 text-emerald-800 text-xs font-bold mb-4">
              <Info size={18} className="text-emerald-600 shrink-0" />
              <p>Gunakan akun yang terdaftar di Supabase. <br/>Mock: admin@desa.id / admin123</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@desa.id"
                  className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <button type="button" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Lupa Password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Sedang Memproses...
                </>
              ) : (
                'Masuk Sekarang'
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-stone-50">
            <button
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-emerald-700 font-bold text-sm transition-colors group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Kembali ke Beranda
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-xs font-medium tracking-wide">
            Sistem Informasi Desa &copy; 2026
          </p>
        </div>
      </motion.div>
    </div>
  );
}
