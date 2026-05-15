'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { CompanySummary } from '@/lib/types';
import { formatNumber, formatMoney } from '@/lib/data';

interface ChartPoint {
  year: string;
  layoffs: number;
  investment: number;
}

export default function ComparisonChart({ summaries }: { summaries: CompanySummary[] }) {
  // Aggregate by year
  const dataMap = new Map<string, { layoffs: number; investment: number }>();

  summaries.forEach(s => {
    s.events.forEach(e => {
      const year = e.date.slice(0, 4);
      const existing = dataMap.get(year) || { layoffs: 0, investment: 0 };
      if (e.type === 'layoff' && e.number) {
        existing.layoffs += e.number;
      } else if (e.type === 'investment' && e.amount) {
        existing.investment += e.amount;
      }
      dataMap.set(year, existing);
    });
  });

  const data: ChartPoint[] = Array.from(dataMap.entries())
    .map(([year, vals]) => ({ year, layoffs: vals.layoffs, investment: vals.investment }))
    .sort((a, b) => a.year.localeCompare(b.year));

  if (data.length === 0) return null;

  return (
    <div className="w-full" style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="none" stroke="#171717" vertical={false} />
          <XAxis
            dataKey="year"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#525252', fontSize: 12, fontFamily: 'JetBrains Mono' }}
          />
          <YAxis
            yAxisId="left"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#525252', fontSize: 12, fontFamily: 'JetBrains Mono' }}
            tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#525252', fontSize: 12, fontFamily: 'JetBrains Mono' }}
            tickFormatter={(v: number) => v >= 1000 ? `$${(v / 1000).toFixed(0)}B` : `$${v}M`}
          />
          <Tooltip
            contentStyle={{
              background: '#0a0a0a',
              border: '1px solid #262626',
              borderRadius: 0,
              color: '#fafafa',
              fontFamily: 'JetBrains Mono',
              fontSize: 12,
            }}
            formatter={(value, name) => {
              if (name === 'layoffs') return [formatNumber(Number(value)), 'Layoffs'];
              return [formatMoney(Number(value)), 'AI Investment'];
            }}
            labelStyle={{ color: '#a3a3a3', fontFamily: 'JetBrains Mono', fontSize: 12 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="layoffs"
            stroke="#e11d48"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#e11d48' }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="investment"
            stroke="#06b6d4"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#06b6d4' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
