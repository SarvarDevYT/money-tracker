import React from 'react';
import { Shield, ArrowLeft, Lock, Database, Eye, Mail } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
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
            <Shield className="w-3.5 h-3.5" />
            Maxfiylik Siyosati (Privacy Policy)
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            MoneyTracker Maxfiylik Siyosati
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            MoneyTracker ilovasi sizning shaxsiy va moliyaviy ma'lumotlaringiz xavfsizligini ta'minlashni eng ustuvor vazifa deb biladi. Ushbu siyosat sizning ma'lumotlaringiz qanday to'planishi, saqlanishi va himoyalanishini tushuntiradi.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <Database className="w-4 h-4 text-emerald-400" />
              1. To'planadigan ma'lumotlar
            </div>
            <p>
              Ilovadan to'liq foydalanish uchun faqat zarur bo'lgan minimal ma'lumotlar to'planadi:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
              <li><strong className="text-zinc-200">Akkaunt ma'lumotlari:</strong> Email manzilingiz (Google OAuth yoki ro'yxatdan o'tish orqali).</li>
              <li><strong className="text-zinc-200">Moliyaviy yozuvlar:</strong> Siz kiritgan daromadlar, xarajatlar, hisoblar, byudjetlar, qarzlar va maqsadlar.</li>
              <li><strong className="text-zinc-200">Texnik parametrlar:</strong> Tizimga kirish sessiyalari va ilova sozlamalari (valyuta, til).</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <Lock className="w-4 h-4 text-emerald-400" />
              2. Ma'lumotlar xavfsizligi va saqlanishi
            </div>
            <p>
              Sizning ma'lumotlaringiz jahon darajasidagi <strong>Supabase Cloud</strong> infratuzilmasida saqlanadi:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
              <li>Barcha ma'lumotlar shifrlangan kanal (HTTPS/TLS) orqali uzatiladi.</li>
              <li><strong className="text-zinc-200">Row Level Security (RLS):</strong> Har bir foydalanuvchining ma'lumoti alohida himoyalangan bo'lib, sizning moliyaviy yozuvlaringizni faqat o'zingiz ko'ra olasiz.</li>
              <li>Parollar ochiq holda saqlanmaydi (kriptografik hash bilan himoyalangan).</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <Eye className="w-4 h-4 text-emerald-400" />
              3. Uchinchi tomon xizmatlari va ma'lumotlar uzatilmasligi
            </div>
            <p>
              MoneyTracker sizning shaxsiy yoki moliyaviy ma'lumotlaringizni <strong>hech qachon uchinchi shaxslarga, reklama beruvchilarga sotmaydi va ulashmaydi</strong>.
            </p>
            <p className="text-zinc-400">
              Ilovada faqat autentifikatsiya va infratuzilma maqsadida Google OAuth, Supabase va Vercel xizmatlaridan foydalaniladi.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <Mail className="w-4 h-4 text-emerald-400" />
              4. Foydalanuvchi huquqlari va ma'lumotlarni o'chirish
            </div>
            <p>
              Siz istalgan vaqtda barcha ma'lumotlaringizni eksport qilishingiz yoki hisobingizdagi ma'lumotlarni to'liq o'chirib yuborishni talab qilishingiz mumkin.
            </p>
            <p className="text-zinc-400">
              Savollar yoki ma'lumotlarni o'chirish bo'yicha murojaat uchun dasturchi emaili:
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
