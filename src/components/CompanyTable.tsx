import type { CompanySummary, SortField, SortDirection } from '@/lib/types';
import { formatNumber, formatMoney, formatDate, getLastEventDate } from '@/lib/data';

interface Props {
  summaries: CompanySummary[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

function SortIndicator({ field, sortField, sortDirection }: { field: SortField; sortField: SortField; sortDirection: SortDirection }) {
  if (field !== sortField) return <span className="text-[#262626] ml-1">&#8597;</span>;
  return <span className="text-[#a3a3a3] ml-1">{sortDirection === 'asc' ? '\u2191' : '\u2193'}</span>;
}

export default function CompanyTable({ summaries, sortField, sortDirection, onSort }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#171717]">
            <th className="text-left py-3 px-4 text-[12px] font-medium uppercase tracking-[0.02em] text-[#525252] cursor-pointer select-none" onClick={() => onSort('name')}>
              Company<SortIndicator field="name" sortField={sortField} sortDirection={sortDirection} />
            </th>
            <th className="text-left py-3 px-4 text-[12px] font-medium uppercase tracking-[0.02em] text-[#525252] cursor-pointer select-none" onClick={() => onSort('sector')}>
              Sector<SortIndicator field="sector" sortField={sortField} sortDirection={sortDirection} />
            </th>
            <th className="text-right py-3 px-4 text-[12px] font-medium uppercase tracking-[0.02em] text-[#525252] cursor-pointer select-none" onClick={() => onSort('total_layoffs')}>
              Layoffs<SortIndicator field="total_layoffs" sortField={sortField} sortDirection={sortDirection} />
            </th>
            <th className="text-right py-3 px-4 text-[12px] font-medium uppercase tracking-[0.02em] text-[#525252] cursor-pointer select-none" onClick={() => onSort('total_investment')}>
              AI Investment<SortIndicator field="total_investment" sortField={sortField} sortDirection={sortDirection} />
            </th>
            <th className="text-right py-3 px-4 text-[12px] font-medium uppercase tracking-[0.02em] text-[#525252] cursor-pointer select-none" onClick={() => onSort('last_event')}>
              Last Event<SortIndicator field="last_event" sortField={sortField} sortDirection={sortDirection} />
            </th>
          </tr>
        </thead>
        <tbody>
          {summaries.map((s) => (
            <tr key={s.id} className="border-b border-[#171717] hover:bg-[#0a0a0a] transition-colors duration-150">
              <td className="py-4 px-4">
                <a href={`/company/${s.id}`} className="text-[14px] font-medium text-[#fafafa] hover:underline">
                  {s.name}
                </a>
              </td>
              <td className="py-4 px-4">
                <span className="text-[12px] font-medium uppercase tracking-[0.02em] text-[#525252]">{s.sector}</span>
              </td>
              <td className="py-4 px-4 text-right">
                <span className="inline-flex items-center gap-2">
                  <span className="w-[6px] h-[6px] rounded-full bg-[#e11d48]" />
                  <span className="font-mono text-[13px] font-medium text-[#fafafa]">{formatNumber(s.total_layoffs)}</span>
                </span>
              </td>
              <td className="py-4 px-4 text-right">
                <span className="inline-flex items-center gap-2">
                  <span className="w-[6px] h-[6px] rounded-full bg-[#06b6d4]" />
                  <span className="font-mono text-[13px] font-medium text-[#fafafa]">{formatMoney(s.total_investment)}</span>
                </span>
              </td>
              <td className="py-4 px-4 text-right text-[13px] text-[#525252]">
                {formatDate(getLastEventDate(s))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
