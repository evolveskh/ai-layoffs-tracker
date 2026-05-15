import type { CompanySummary, SortField, SortDirection } from '@/lib/types';
import { formatNumber, formatMoney } from '@/lib/data';

interface Props {
  summaries: CompanySummary[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

function SortIcon({ field, sortField, sortDirection }: { field: SortField; sortField: SortField; sortDirection: SortDirection }) {
  if (field !== sortField) return <span className="text-slate-600 ml-1">↕</span>;
  return <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
}

export default function CompanyTable({ summaries, sortField, sortDirection, onSort }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700/50">
      <table className="w-full text-sm">
        <thead className="bg-[#1e293b] text-slate-300">
          <tr>
            <th className="text-left p-4 font-medium cursor-pointer hover:text-white" onClick={() => onSort('name')}>
              Company<SortIcon field="name" sortField={sortField} sortDirection={sortDirection} />
            </th>
            <th className="text-left p-4 font-medium cursor-pointer hover:text-white" onClick={() => onSort('sector')}>
              Sector<SortIcon field="sector" sortField={sortField} sortDirection={sortDirection} />
            </th>
            <th className="text-right p-4 font-medium cursor-pointer hover:text-white text-red-400" onClick={() => onSort('total_layoffs')}>
              Layoffs<SortIcon field="total_layoffs" sortField={sortField} sortDirection={sortDirection} />
            </th>
            <th className="text-right p-4 font-medium cursor-pointer hover:text-white text-green-400" onClick={() => onSort('total_investment')}>
              AI Investment<SortIcon field="total_investment" sortField={sortField} sortDirection={sortDirection} />
            </th>
            <th className="text-right p-4 font-medium cursor-pointer hover:text-white" onClick={() => onSort('layoff_per_billion_ai')}>
              Layoffs / $1B AI<SortIcon field="layoff_per_billion_ai" sortField={sortField} sortDirection={sortDirection} />
            </th>
          </tr>
        </thead>
        <tbody>
          {summaries.map((s) => (
            <tr key={s.id} className="border-t border-slate-700/30 hover:bg-[#1e293b]/50 transition-colors">
              <td className="p-4">
                <a href={`/company/${s.id}`} className="font-medium text-white hover:text-blue-400 transition-colors">
                  {s.name}
                </a>
              </td>
              <td className="p-4">
                <span className="px-2 py-1 rounded text-xs bg-slate-700 text-slate-300">{s.sector}</span>
              </td>
              <td className="p-4 text-right text-red-400 font-semibold">{formatNumber(s.total_layoffs)}</td>
              <td className="p-4 text-right text-green-400 font-semibold">{formatMoney(s.total_investment)}</td>
              <td className="p-4 text-right text-slate-300">{s.layoff_per_billion_ai.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
