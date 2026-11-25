import React, { useEffect, useState } from 'react';
import { Logo } from '../common/Logo';
import { supabase } from '../../lib/supabase';
import { ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';

export const AuthCallback: React.FC = () => {
  const [status, setStatus] = useState<'redirecting' | 'success' | 'error'>('redirecting');
  const [deepLink, setDeepLink] = useState<string>('');

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const hash = window.location.hash;
        const search = window.location.search;
        const fullPayload = hash || search;

        // Custom scheme for MoneyTracker Android app
        const appSchemeUrl = `com.sarvardev.moneytracker://auth-callback${fullPayload}`;
        setDeepLink(appSchemeUrl);

        // 1. If tokens or code are present, set session on web client as well
        if (hash || search) {
          const params = new URLSearchParams(hash.startsWith('#') ? hash.substring(1) : search.startsWith('?') ? search.substring(1) : '');
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          const code = params.get('code');

          if (accessToken && refreshToken) {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
          } else if (code) {
            await supabase.auth.exchangeCodeForSession(code);
          }
        }

        // 2. Try to redirect directly back to the Android app
        // We attempt this immediately
        window.location.href = appSchemeUrl;

        // Give it a brief moment, if still on page, set status
        setTimeout(() => {
          setStatus('success');
        }, 1200);

      } catch (err) {
        console.error('AuthCallback error:', err);
        setStatus('error');
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col items-center justify-center p-4 selection:bg-emerald-500/30 selection:text-white">
      <div className="w-full max-w-sm bg-[#121215] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
        <Logo size="lg" className="mx-auto" />

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {status === 'redirecting' && "Ilovaga qaytilmoqda..."}
            {status === 'success' && "Muvaffaqiyatli kirdingiz!"}
            {status === 'error' && "Kirishda xatolik yuz berdi"}
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {status === 'redirecting' && "Google profilingiz tasdiqlandi. MoneyTracker ilovasi ochilmoqda..."}
            {status === 'success' && "Agar ilova avtomatik ochilmagan bo'lsa, quyidagi tugmani bosing:"}
            {status === 'error' && "Iltimos, ilovaga qaytib qaytadan urinib ko'ring."}
          </p>
        </div>

        {/* Primary Action: Open in App */}
        {deepLink && (
          <div className="space-y-3 pt-2">
            <a
              href={deepLink}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ilovani ochish (MoneyTracker)</span>
            </a>

            <a
              href="/"
              className="block text-xs text-zinc-500 hover:text-zinc-300 transition-colors pt-2"
            >
              Veb-brauzerda davom etish &rarr;
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
