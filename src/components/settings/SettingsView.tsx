import React, { useState } from 'react';
import { 
  Download, 
  Upload, 
  Trash2, 
  FileSpreadsheet, 
  CheckCircle2,
  Cloud,
  LogOut,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { USD_TO_UZS, RUB_TO_UZS } from '../../utils/formatters';

export const SettingsView: React.FC = () => {
  const { 
    exportJSON, 
    importJSON, 
    exportCSV, 
    clearAllData, 
    transactions,
    accounts,
    user,
    setIsAuthModalOpen,
    signOut,
    isCloudSyncing
  } = useApp();

  const [importSuccess, setImportSuccess] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importJSON(content);
        if (ok) {
          setImportSuccess(true);
          setTimeout(() => setImportSuccess(false), 3000);
        } else {
          alert("Xatolik! JSON formati noto'g'ri.");
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-zinc-100">
          Sozlamalar va zaxira
        </h1>
        <p className="text-xs text-zinc-500">
          Bulutli sinxronizatsiya, ma'lumotlarni saqlash va eksport
        </p>
      </div>

      {importSuccess && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-emerald-400 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Ma'lumotlar muvaffaqiyatli tiklandi.</span>
        </div>
      )}

      {/* Cloud Sync Status Card */}
      <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
              user 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-zinc-900 border-zinc-800 text-sky-400'
            }`}>
              <Cloud className={`w-4 h-4 ${isCloudSyncing ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-zinc-200">
                Bulutli ma'lumotlar bazasi (Supabase Cloud)
              </h3>
              <p className="text-[11px] text-zinc-500">
                {user ? "Avtomatik doimiy sinxronizatsiya faol" : "Hozirda lokal rejimda ishlamoqda"}
              </p>
            </div>
          </div>

          {user ? (
            <button
              onClick={() => signOut()}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 text-xs font-medium border border-zinc-800 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Chiqish</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold shadow-sm transition-colors"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Bulutga ulash</span>
            </button>
          )}
        </div>

        {user ? (
          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-[11px] text-emerald-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Akkaunt: <span className="font-mono text-zinc-100">{user.email}</span></p>
              <p className="text-zinc-400 text-[10px] mt-0.5 leading-relaxed">
                Barcha operatsiyalaringiz shifrlangan holda bulutda saqlanmoqda. Boshqa telefon yoki kompyuterdan kirganingizda ham barcha ma'lumotlaringiz o'chib ketmaydi va avtomatik yuklanadi.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-zinc-300">Ma'lumotlaringiz faqat ushbu qurilmada saqlanmoqda</p>
              <p className="text-zinc-500 text-[10px] mt-0.5 leading-relaxed">
                Telefoningizni almashtirsangiz yoki ilovani o'chirib tashlasangiz ma'lumotlar yo'qolmasligi uchun <b>"Bulutga ulash"</b> tugmasi orqali bepul profilingizga kiring.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Currency Exchange Rates */}
      <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800/80 space-y-2">
        <h3 className="text-xs font-semibold text-zinc-200">Valyuta kurslari</h3>
        <p className="text-[11px] text-zinc-500">Multi-valyuta operatsiyalari uchun</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <p className="text-[10px] text-zinc-500">1 USD</p>
            <p className="text-xs font-semibold font-mono text-zinc-200 mt-0.5">≈ {USD_TO_UZS.toLocaleString()} so'm</p>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <p className="text-[10px] text-zinc-500">1 RUB</p>
            <p className="text-xs font-semibold font-mono text-zinc-200 mt-0.5">≈ {RUB_TO_UZS.toLocaleString()} so'm</p>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 col-span-2 sm:col-span-1">
            <p className="text-[10px] text-zinc-500">Asosiy valyuta</p>
            <p className="text-xs font-semibold text-zinc-200 mt-0.5">UZS (so'm)</p>
          </div>
        </div>
      </div>

      {/* Backup and Restore */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800/80 flex flex-col justify-between space-y-3">
          <div>
            <h3 className="text-xs font-semibold text-zinc-200">Zaxira nusxalash (Eksport)</h3>
            <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
              Barcha operatsiyalarni JSON yoki Excel (CSV) formatda kompyuteringizga yuklab oling.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={exportJSON}
              className="w-full py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>JSON zaxira yuklash</span>
            </button>

            <button
              onClick={exportCSV}
              className="w-full py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-zinc-400" />
              <span>CSV (Excel) yuklash</span>
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800/80 flex flex-col justify-between space-y-3">
          <div>
            <h3 className="text-xs font-semibold text-zinc-200">Qayta tiklash va tozalash</h3>
            <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
              JSON fayldan ma'lumotlarni qayta tiklash yoki butun bazani tozalash.
            </p>
          </div>

          <div className="space-y-2">
            <label className="w-full py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-zinc-400" />
              <span>JSON fayl tanlash</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              onClick={clearAllData}
              className="w-full py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium border border-rose-500/20 transition-colors flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Barcha ma'lumotlarni tozalash (0 qilish)</span>
            </button>
          </div>
        </div>
      </div>

      {/* System info */}
      <div className="p-3.5 rounded-xl bg-zinc-900/30 border border-zinc-800/60 text-xs flex items-center justify-between text-zinc-500">
        <span>Hozirda: {transactions.length} ta tranzaksiya, {accounts.length} ta hisob</span>
        <span>{user ? "Bulutli rejim (Supabase)" : "Lokal rejim"}</span>
      </div>
    </div>
  );
};
