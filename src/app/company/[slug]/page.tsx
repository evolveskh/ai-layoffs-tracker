import { getAllCompanies, getCompanySummary, formatNumber, formatMoney } from '@/lib/data';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import EventTimeline from '@/components/EventTimeline';

export const revalidate = 86400;

export async function generateStaticParams() {
  return getAllCompanies().map(c => ({ slug: c.id }));
}

type PageParams = { slug: string };

export async function generateMetadata(
  { params }: { params: Promise<PageParams> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const summary = getCompanySummary(slug);
  if (!summary) return { title: 'Not Found' };

  return {
    title: `${summary.name}: ${formatNumber(summary.total_layoffs)} Laid Off vs ${formatMoney(summary.total_investment)} AI Spend`,
    description: `${summary.name} has laid off ${formatNumber(summary.total_layoffs)} employees while investing ${formatMoney(summary.total_investment)} in AI. Full timeline and breakdown.`,
    openGraph: {
      title: `${summary.name} Layoffs vs AI Investment`,
      description: `${formatNumber(summary.total_layoffs)} laid off. ${formatMoney(summary.total_investment)} into AI.`,
      images: [{ url: `/company/${slug}/opengraph-image`, width: 1200, height: 630 }]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${summary.name} Layoffs vs AI Investment`,
      description: `${formatNumber(summary.total_layoffs)} laid off. ${formatMoney(summary.total_investment)} into AI.`,
      images: [`/company/${slug}/opengraph-image`]
    }
  };
}

export default async function Page({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  const summary = getCompanySummary(slug);
  if (!summary) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <a href="/" className="text-sm text-slate-400 hover:text-white mb-6 inline-block">← Back to all companies</a>

      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{summary.name}</h1>
        {summary.description && <p className="text-slate-400">{summary.description}</p>}
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1e293b] rounded-lg p-4 text-center">
          <div className="text-red-400 text-2xl font-bold">{formatNumber(summary.total_layoffs)}</div>
          <div className="text-xs text-slate-500 mt-1">Laid Off</div>
        </div>
        <div className="bg-[#1e293b] rounded-lg p-4 text-center">
          <div className="text-green-400 text-2xl font-bold">{formatMoney(summary.total_investment)}</div>
          <div className="text-xs text-slate-500 mt-1">AI Investment</div>
        </div>
        <div className="bg-[#1e293b] rounded-lg p-4 text-center">
          <div className="text-slate-200 text-2xl font-bold">{summary.layoff_per_billion_ai.toFixed(1)}</div>
          <div className="text-xs text-slate-500 mt-1">Layoffs / $1B AI</div>
        </div>
        {summary.total_employees && (
          <div className="bg-[#1e293b] rounded-lg p-4 text-center">
            <div className="text-blue-400 text-2xl font-bold">{formatNumber(summary.total_employees)}</div>
            <div className="text-xs text-slate-500 mt-1">Total Employees</div>
          </div>
        )}
      </div>

      {/* Events Timeline */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">📅 Timeline</h2>
        <EventTimeline events={summary.events.reverse()} />
      </section>
    </div>
  );
}
