'use client';

import { useState, useMemo } from 'react';
import type { CompanySummary, SortField, SortDirection } from '@/lib/types';
import { sortSummaries, formatNumber, formatMoney } from '@/lib/data';
import CompanyTable from './CompanyTable';
import CompanyCard from './CompanyCard';
import ComparisonChart from './ComparisonChart';

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="border border-[#171717] p-4 hover:border-[#262626] transition-colors duration-150">
      <div className="font-mono text-[28px] font-medium tracking-[-0.02em] text-[#fafafa] leading-none">
        {value}
      </div>
      <div className="mt-2 text-[12px] font-medium uppercase tracking-[0.02em] text-[#525252]">
        {label}
      </div>
    </div>
  );
}

export default function HomePageClient({ summaries, sectors }: { summaries: CompanySummary[]; sectors: string[] }) {
  const [sortField, setSortField] = useState<SortField>('total_layoffs');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [sectorFilter, setSectorFilter] = useState<string>('All');

  const filtered = useMemo(() => {
    const f = sectorFilter === 'All' ? summaries : summaries.filter(s => s.sector === sectorFilter);
    return sortSummaries(f, sortField, sortDirection);
  }, [summaries, sectorFilter, sortField, sortDirection]);

  const totalLayoffs = summaries.reduce((sum, s) => sum + s.total_layoffs, 0);
  const totalInvestment = summaries.reduce((sum, s) => sum + s.total_investment, 0);

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Hero */}
      <section className="pt-16 pb-8">
        <h1 className="text-[48px] font-bold tracking-[-0.03em] leading-[1.1] text-[#fafafa]">
          THE LAYOFFS
        </h1>
        <h1 className="text-[48px] font-bold tracking-[-0.03em] leading-[1.1] text-[#fafafa]">
          AND THE INVESTMENT
        </h1>
        <p className="mt-6 text-[14px] leading-[1.5] text-[#a3a3a3] max-w-[560px]">
          Tech companies are firing thousands of employees while spending billions on artificial intelligence.
        </p>
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard value={formatNumber(totalLayoffs)} label="Laid Off" />
        <StatCard value={formatMoney(totalInvestment)} label="AI Spend" />
        <StatCard value={String(summaries.length)} label="Companies" />
        <StatCard value={`${summaries.reduce((sum, s) => sum + s.events.length, 0)}+`} label="Events" />
      </section>

      {/* Chart */}
      <section className="border-t border-[#171717] pt-8 mb-8">
        <h2 className="text-[24px] font-semibold tracking-[-0.01em] text-[#fafafa] mb-6">OVER TIME</h2>
        <ComparisonChart summaries={summaries} />
      </section>

      {/* Table / Filters */}
      <section className="border-t border-[#171717] pt-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[24px] font-semibold tracking-[-0.01em] text-[#fafafa]">ALL COMPANIES</h2>
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="bg-[#0a0a0a] border border-[#171717] text-[#a3a3a3] text-[13px] px-3 py-2 focus:outline-none focus:border-[#525252]"
          >
            <option value="All">All Sectors</option>
            {sectors.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block">
          <CompanyTable
            summaries={filtered}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={(field) => {
              if (field === sortField) {
                setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
              } else {
                setSortField(field);
                setSortDirection('desc');
              }
            }}
          />
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {filtered.map(s => (
            <CompanyCard key={s.id} summary={s} />
          ))}
        </div>
      </section>
    </div>
  );
}
