import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  AlertCircle, 
  CheckCircle2, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Smartphone, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const AuthScreen: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setInfoMsg('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      if (
        err.message?.toLowerCase().includes('provider is not enabled') ||
        err.message?.toLowerCase().includes('unsupported provider')
      ) {
        setErrorMsg(
          "Google orqali kirish hali Supabase konsolida sozlanmagan. Iltimos, Email va Parol orqali bemalol ro'yxatdan o'ting yoki kiring!"
        );
      } else {
        setErrorMsg(err.message || "Google orqali kirishda xatolik yuz berdi.");
      }
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.session) {
          setInfoMsg("Muvaffaqiyatli ro'yxatdan o'tdingiz! Kirilmoqda...");
        } else {
          setInfoMsg(
            "Akkaunt yaratildi! Agar xat kelsa tasdiqlang yoki Email/Parol bilan tizimga kiring."
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        setInfoMsg("Xush kelibsiz! Tizimga kirdingiz...");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-emerald-500/30 selection:text-white">
      {/* Background radial gradient glow */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-2xl shadow-lg shadow-emerald-950/20 mb-1">
            M
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            MoneyTracker
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xs mx-auto">
            Shaxsiy moliyangiz va xarajatlaringizni xavfsiz nazorat qiling
          </p>
        </div>

        {/* Auth Card */}
        <div className="rounded-2xl bg-[#121215] border border-zinc-800/90 p-5 sm:p-7 shadow-2xl space-y-4">
          <div className="text-center pb-1">
            <h2 className="text-base font-semibold text-zinc-100">
              {isSignUp ? "Yangi hisob ochish" : "Tizimga kirish"}
            </h2>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Ilovadan to'liq foydalanish uchun profilingizga kiring
            </p>
          </div>

          {/* Error / Success Notifications */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{infoMsg}</span>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 hover:text-white text-xs font-medium flex items-center justify-center gap-2.5 transition-all shadow-sm"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google orqali kirish</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-zinc-800 w-full" />
            <span className="bg-[#121215] px-2.5 text-[10px] text-zinc-500 uppercase tracking-wider shrink-0">
              yoki email orqali
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-zinc-400">Email manzili:</label>
              <div className="relative mt-1">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="nomi@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-700 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-zinc-400">Parol:</label>
              <div className="relative mt-1">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Kamida 6 ta belgi"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-700 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm pt-2"
            >
              {loading ? (
                <span>Kutilmoqda...</span>
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Ro'yxatdan o'tish</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Hisobga kirish</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="pt-2 border-t border-zinc-850 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(prev => !prev);
                setErrorMsg('');
                setInfoMsg('');
              }}
              className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              {isSignUp ? (
                <span>Akkauntingiz bormi? <b className="text-emerald-400 underline decoration-emerald-500/50">Kirish</b></span>
              ) : (
                <span>Yangi foydalanuvchimisiz? <b className="text-emerald-400 underline decoration-emerald-500/50">Ro'yxatdan o'tish</b></span>
              )}
            </button>
          </div>
        </div>

        {/* Security badges */}
        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="p-2.5 rounded-xl bg-zinc-900/40 border border-zinc-850 flex flex-col items-center gap-1 text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] leading-tight">Shifrlangan bulut</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-900/40 border border-zinc-850 flex flex-col items-center gap-1 text-zinc-400">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] leading-tight">Barcha qurilmalarda</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-900/40 border border-zinc-850 flex flex-col items-center gap-1 text-zinc-400">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] leading-tight">100% o'chmas xotira</span>
          </div>
        </div>
      </div>
    </div>
  );
};
