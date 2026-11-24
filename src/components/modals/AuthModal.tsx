import React, { useState } from 'react';
import { X, Cloud, Lock, Mail, AlertCircle, CheckCircle2, LogIn, UserPlus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
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
          setInfoMsg("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
          setTimeout(() => {
            onSuccess?.();
            onClose();
          }, 1000);
        } else {
          setInfoMsg("Profilingiz yaratildi! Emailingizga tasdiqlash xati yuborilgan bo'lishi mumkin.");
          setTimeout(() => {
            onClose();
          }, 2500);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setInfoMsg("Xush kelibsiz! Tizimga muvaffaqiyatli kirdingiz.");
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-sm rounded-2xl bg-[#121215] border border-zinc-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 pb-3 border-b border-zinc-850 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">
                {isSignUp ? "Ro'yxatdan o'tish" : "Tizimga kirish"}
              </h2>
              <p className="text-[10px] text-zinc-500">
                Bulutli xavfsiz sinxronizatsiya
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{infoMsg}</span>
            </div>
          )}

          <div>
            <label className="text-[11px] font-medium text-zinc-400">Email:</label>
            <div className="relative mt-1">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-700"
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
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm mt-2"
          >
            {loading ? (
              <span>Kutilmoqda...</span>
            ) : isSignUp ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Akkaunt yaratish</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Kirish</span>
              </>
            )}
          </button>

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
                <span>Akkauntingiz bormi? <b>Kirish</b></span>
              ) : (
                <span>Yangi foydalanuvchimisiz? <b>Ro'yxatdan o'tish</b></span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
