import type { Event } from '@/lib/types';
import { formatNumber, formatMoney } from '@/lib/data';

export default function EventTimeline({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return <p className="text-slate-500 text-center py-8">No events recorded yet.</p>;
  }

  return (
    <div className="space-y-4">
      {events.map((e) => (
        <div key={e.id} className="flex gap-4 p-4 rounded-lg bg-[#1e293b] border border-slate-700/30">
          <div className="flex-shrink-0 mt-1">
            {e.type === 'layoff' ? (
              <span className="text-red-400 text-xl">🔻</span>
            ) : (
              <span className="text-green-400 text-xl">💰</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${e.type === 'layoff' ? 'bg-red-900/50 text-red-400' : 'bg-green-900/50 text-green-400'}`}>
                {e.type === 'layoff' ? 'LAYOFF' : 'INVESTMENT'}
              </span>
              <span className="text-sm text-slate-400">{e.date}</span>
            </div>
            <p className="text-slate-200">{e.description}</p>
            <div className="flex items-center gap-4 mt-2">
              {e.type === 'layoff' && e.number && (
                <span className="text-red-400 font-bold">{formatNumber(e.number)} employees</span>
              )}
              {e.type === 'investment' && e.amount && (
                <span className="text-green-400 font-bold">{formatMoney(e.amount)}</span>
              )}
              <a href={e.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline ml-auto">
                {e.source_name} →
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
