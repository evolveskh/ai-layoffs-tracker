'use client';

import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CompanySummary } from '@/lib/types';

export default function ComparisonChart({ summaries }: { summaries: CompanySummary[] }) {
  const data = summaries.map(s => ({
    name: s.id.slice(0, 4).toUpperCase(),
    layoffs: s.total_layoffs,
    investment: s.total_investment,
    label: s.name,
  }));

  if (data.length === 0) return null;

  return (
    <div className="bg-[#1e293b] rounded-lg p-6 border border-slate-700/50">
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
          <YAxis yAxisId="left" stroke="#ef4444" fontSize={12} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
          <YAxis yAxisId="right" orientation="right" stroke="#22c55e" fontSize={12} tickFormatter={(v) => `$${v >= 1000 ? (v/1000).toFixed(0)+'B' : v+'M'}`} />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
            labelStyle={{ color: '#f8fafc' }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="layoffs" fill="#ef4444" name="Employees Laid Off" radius={[4,4,0,0]} />
          <Bar yAxisId="right" dataKey="investment" fill="#22c55e" name="AI Investment ($M)" radius={[4,4,0,0]} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
