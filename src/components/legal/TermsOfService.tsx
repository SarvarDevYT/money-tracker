import React from 'react';
import { FileText, ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck, Mail } from 'lucide-react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500/30 selection:text-white">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation / Back */}
        <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Bosh sahifaga qaytish
          </a>
          <span className="text-xs text-zinc-500">Oxirgi yangilanish: 24-Noyabr, 2026</span>
        </div>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <FileText className="w-3.5 h-3.5" />
            Foydalanish Shartlari (Terms of Service)
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            MoneyTracker Foydalanish Shartlari
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            MoneyTracker ilovasidan foydalanish orqali siz quyidagi shartlarga to'liq rozilik bildirasiz. Iltimos, xizmatdan foydalanishdan oldin ushbu shartlar bilan tanishib chiqing.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              1. Xizmat tavsifi
            </div>
            <p>
              MoneyTracker — shaxsiy moliyaviy hisob-kitoblarni yuritish, daromad va xarajatlarni tahlil qilish, byudjet va moliyaviy maqsadlarni rejalashtirish uchun mo'ljallangan ilova hisoblanadi.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              2. Foydalanuvchi hisobi va xavfsizlik
            </div>
            <p>
              Siz hisobingizga kirish ma'lumotlari (parol yoki Google hisobingiz) xavfsizligini ta'minlash uchun javobgarsiz. Hisobingizdan amalga oshirilgan barcha harakatlar sizning nomingizdan deb hisoblanadi.
            </p>
          </section>

          {/* Section 3 */}
          <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              3. Moliyaviy maslahat emasligi haqida ogohlantirish
            </div>
            <p>
              MoneyTracker ilovasi faqat axborot va hisob-kitob vositasi hisoblanadi. Ilova professional litsenziyalangan moliyaviy, yuridik yoki soliq maslahati bermaydi. Har qanday investitsiya yoki moliyaviy qarorlarni foydalanuvchi o'z mas'uliyati ostida qabul qiladi.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <Mail className="w-4 h-4 text-emerald-400" />
              4. Bog'lanish va savollar
            </div>
            <p>
              Foydalanish shartlari yuzasidan savol yoki takliflaringiz bo'lsa, quyidagi manzil orqali bog'lanishingiz mumkin:
            </p>
            <p className="text-zinc-400">
              Email:
              <a href="mailto:iskandarovsarvar34@gmail.com" className="ml-1 text-emerald-400 underline">
                iskandarovsarvar34@gmail.com
              </a>
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-zinc-800 text-center text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} MoneyTracker. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </div>
  );
};
