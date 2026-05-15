import { getAllCompanies, getCompanySummary, formatNumber, formatMoney, formatDate } from '@/lib/data';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import type { Event } from '@/lib/types';

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
    title: `${summary.name}`,
    description: `${summary.name} has laid off ${formatNumber(summary.total_layoffs)} employees while investing ${formatMoney(summary.total_investment)} in AI. Full timeline and breakdown.`,
    openGraph: {
      title: `${summary.name} — Layoffs vs AI Investment`,
      description: `${formatNumber(summary.total_layoffs)} laid off. ${formatMoney(summary.total_investment)} into AI.`,
      images: [{ url: `/company/${slug}/opengraph-image`, width: 1200, height: 630 }]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${summary.name} — Layoffs vs AI Investment`,
      description: `${formatNumber(summary.total_layoffs)} laid off. ${formatMoney(summary.total_investment)} into AI.`,
      images: [`/company/${slug}/opengraph-image`]
    }
  };
}

function EventItem({ event }: { event: Event }) {
  const isLayoff = event.type === 'layoff';
  return (
    <div className="flex gap-4 py-4 border-b border-[#171717]">
      <div className="flex-shrink-0 mt-1">
        <span className={`inline-block w-[8px] h-[8px] rounded-full ${isLayoff ? 'bg-[#e11d48]' : 'bg-[#06b6d4]'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[12px] font-medium uppercase tracking-[0.02em] ${isLayoff ? 'text-[#e11d48]' : 'text-[#06b6d4]'}`}>
            {isLayoff ? 'LAYOFF' : 'INVESTMENT'}
          </span>
          <span className="text-[13px] text-[#525252]">{event.date}</span>
        </div>
        <p className="text-[14px] text-[#a3a3a3] leading-[1.5]">{event.description}</p>
        <div className="flex items-center gap-4 mt-2">
          {isLayoff && event.number && (
            <span className="font-mono text-[13px] font-medium text-[#e11d48]">{formatNumber(event.number)} employees</span>
          )}
          {!isLayoff && event.amount && (
            <span className="font-mono text-[13px] font-medium text-[#06b6d4]">{formatMoney(event.amount)}</span>
          )}
          <a
            href={event.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-[#525252] hover:text-[#a3a3a3] hover:underline ml-auto transition-colors duration-150"
          >
            {event.source_name}
          </a>
        </div>
      </div>
    </div>
  );
}

export default async function Page({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  const summary = getCompanySummary(slug);
  if (!summary) notFound();

  const events = [...summary.events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <a href="/" className="text-[13px] text-[#525252] hover:text-[#a3a3a3] mb-6 inline-block transition-colors duration-150">
        ← Back to all companies
      </a>

      <header className="mb-8">
        <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#fafafa]">{summary.name}</h1>
        {summary.description && <p className="mt-2 text-[14px] text-[#a3a3a3] leading-[1.5]">{summary.description}</p>}
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border border-[#171717] p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-[8px] h-[8px] rounded-full bg-[#e11d48]" />
            <span className="text-[12px] font-medium uppercase tracking-[0.02em] text-[#525252]">Total Layoffs</span>
          </div>
          <div className="font-mono text-[28px] font-medium tracking-[-0.02em] text-[#fafafa]">
            {formatNumber(summary.total_layoffs)}
          </div>
        </div>
        <div className="border border-[#171717] p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-[8px] h-[8px] rounded-full bg-[#06b6d4]" />
            <span className="text-[12px] font-medium uppercase tracking-[0.02em] text-[#525252]">Total AI Investment</span>
          </div>
          <div className="font-mono text-[28px] font-medium tracking-[-0.02em] text-[#fafafa]">
            {formatMoney(summary.total_investment)}
          </div>
        </div>
      </div>

      {/* Events Timeline */}
      <section>
        <h2 className="text-[24px] font-semibold tracking-[-0.01em] text-[#fafafa] mb-4">TIMELINE</h2>
        {events.length === 0 ? (
          <p className="text-[#525252] text-center py-8">No events recorded yet.</p>
        ) : (
          <div>
            {events.map((e) => (
              <EventItem key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
