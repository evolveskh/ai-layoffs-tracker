import type { CompanySummary } from '@/lib/types';
import { formatNumber, formatMoney } from '@/lib/data';

export default function CompanyCard({ summary }: { summary: CompanySummary }) {
  return (
    <a href={`/company/${summary.id}`} className="block p-4 rounded-lg bg-[#1e293b] border border-slate-700/30 hover:border-slate-600 transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-white">{summary.name}</span>
        <span className="px-2 py-1 rounded text-xs bg-slate-700 text-slate-300">{summary.sector}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-red-400 font-bold text-lg">{formatNumber(summary.total_layoffs)}</div>
          <div className="text-xs text-slate-500">Laid Off</div>
        </div>
        <div>
          <div className="text-green-400 font-bold text-lg">{formatMoney(summary.total_investment)}</div>
          <div className="text-xs text-slate-500">AI Spend</div>
        </div>
        <div>
          <div className="text-slate-300 font-bold text-lg">{summary.layoff_per_billion_ai.toFixed(1)}</div>
          <div className="text-xs text-slate-500">/ $1B AI</div>
        </div>
      </div>
    </a>
  );
}
