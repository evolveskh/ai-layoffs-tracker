import { ImageResponse } from 'next/og';
import { getCompanySummary } from '@/lib/data';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const summary = getCompanySummary(slug);
  if (!summary) return new Response('Not found', { status: 404 });

  const fmtNum = (n: number) => n >= 1000 ? `${(n/1000).toFixed(0)}K` : n.toLocaleString();
  const fmtMoney = (n: number) => `$${n >= 1000 ? (n/1000).toFixed(0)+'B' : n+'M'}`;

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white', fontFamily: 'Inter, system-ui, sans-serif',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: 60
      }}>
        <div style={{ fontSize: 36, fontWeight: 700, color: '#f8fafc', marginBottom: 32 }}>
          {summary.name}
        </div>
        <div style={{ fontSize: 72, fontWeight: 800, color: '#ef4444', marginBottom: 8 }}>
          {fmtNum(summary.total_layoffs)} laid off
        </div>
        <div style={{ fontSize: 28, color: '#94a3b8', marginBottom: 8 }}>vs</div>
        <div style={{ fontSize: 72, fontWeight: 800, color: '#22c55e', marginBottom: 24 }}>
          {fmtMoney(summary.total_investment)} AI spend
        </div>
        <div style={{ fontSize: 24, color: '#64748b', marginTop: 16 }}>
          ai-layoffs.com/{summary.id} — Track the tradeoff
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
