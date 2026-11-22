import { CurrencyType } from '../types';

export const USD_TO_UZS = 12850;
export const RUB_TO_UZS = 135;

export const formatCurrency = (
  amount: number,
  currency: CurrencyType = 'UZS',
  hide: boolean = false
): string => {
  if (hide) {
    return '••••••••';
  }

  const rounded = Math.round(amount * 100) / 100;
  const parts = rounded.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const formattedNumber = parts.join('.');

  switch (currency) {
    case 'UZS':
      return `${formattedNumber} so'm`;
    case 'USD':
      return `$${formattedNumber}`;
    case 'RUB':
      return `${formattedNumber} ₽`;
    default:
      return `${formattedNumber} ${currency}`;
  }
};

export const convertToUZS = (amount: number, currency: CurrencyType): number => {
  if (currency === 'USD') return amount * USD_TO_UZS;
  if (currency === 'RUB') return amount * RUB_TO_UZS;
  return amount;
};

export const formatDateUz = (dateStr: string): string => {
  if (!dateStr) return '';
  
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (dateStr === today) return 'Bugun';
  if (dateStr === yesterday) return 'Kecha';

  const [year, month, day] = dateStr.split('-');
  const monthsUz = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
  ];

  const monthName = monthsUz[parseInt(month, 10) - 1] || month;
  return `${parseInt(day, 10)}-${monthName}, ${year}`;
};

export const downloadCSV = (content: string, fileName: string) => {
  const blob = new Blob(["\uFEFF" + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
