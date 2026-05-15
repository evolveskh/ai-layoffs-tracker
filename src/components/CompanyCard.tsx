import type { CompanySummary } from '@/lib/types';
import { formatNumber, formatMoney, formatDate, getLastEventDate } from '@/lib/data';

export default function CompanyCard({ summary }: { summary: CompanySummary }) {
  return (
    <a href={`/company/${summary.id}`} className="block border border-[#171717] p-4 hover:border-[#262626] transition-colors duration-150">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[14px] font-medium text-[#fafafa]">{summary.name}</span>
      </div>
      <div className="text-[12px] font-medium uppercase tracking-[0.02em] text-[#525252] mb-3">
        {summary.sector}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-[6px] h-[6px] rounded-full bg-[#e11d48]" />
          <span className="font-mono text-[13px] font-medium text-[#fafafa]">{formatNumber(summary.total_layoffs)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-[6px] h-[6px] rounded-full bg-[#06b6d4]" />
          <span className="font-mono text-[13px] font-medium text-[#fafafa]">{formatMoney(summary.total_investment)}</span>
        </div>
      </div>
      <div className="mt-2 text-[13px] text-[#525252]">
        Last: {formatDate(getLastEventDate(summary))}
      </div>
    </a>
  );
}
