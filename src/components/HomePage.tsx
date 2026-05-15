'use client';

import { useState, useMemo } from 'react';
import type { CompanySummary, SortField, SortDirection } from '@/lib/types';
import { sortSummaries } from '@/lib/data';
import CompanyTable from './CompanyTable';
import CompanyCard from './CompanyCard';
import ComparisonChart from './ComparisonChart';
import FilterBar from './FilterBar';

export default function HomePage({ summaries }: { summaries: CompanySummary[] }) {
  const [sortField, setSortField] = useState<SortField>('layoff_per_billion_ai');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [sectorFilter, setSectorFilter] = useState<string>('All');

  const filtered = useMemo(() => {
    const filtered = sectorFilter === 'All' ? summaries : summaries.filter(s => s.sector === sectorFilter);
    return sortSummaries(filtered, sortField, sortDirection);
  }, [summaries, sectorFilter, sortField, sortDirection]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-red-400 to-green-400 bg-clip-text text-transparent">
          They Fired Thousands. Then Spent Billions on AI.
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Tracking which tech companies are laying off the most employees while pouring record amounts into artificial intelligence. Updated daily.
        </p>
      </section>

      {/* Chart */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">📊 Layoffs vs AI Investment</h2>
        <ComparisonChart summaries={filtered.slice(0, 10)} />
      </section>

      {/* Table / Filters */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">📋 Company Breakdown</h2>
          <FilterBar value={sectorFilter} onChange={setSectorFilter} />
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
