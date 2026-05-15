import { ImageResponse } from 'next/og';
import { getCompanySummary } from '@/lib/data';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const summary = getCompanySummary(slug);
  if (!summary) return new Response('Not found', { status: 404 });

  const fmtNum = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}K` : n.toLocaleString();
  const fmtMoney = (n: number) => `$${n >= 1000 ? (n / 1000).toFixed(0) + 'B' : n + 'M'}`;

  return new ImageResponse(
    (
      <div style={{
        width: '100%',
        height: '100%',
        background: '#000000',
        color: '#fafafa',
        fontFamily: 'Inter, system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 60
      }}>
        <div style={{ fontSize: 36, fontWeight: 600, color: '#fafafa', marginBottom: 48 }}>
          {summary.name}
        </div>
        <div style={{ display: 'flex', gap: 80, alignItems: 'baseline' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 72, fontWeight: 500, color: '#e11d48', fontFamily: 'JetBrains Mono, monospace' }}>
              {fmtNum(summary.total_layoffs)}
            </div>
            <div style={{ fontSize: 18, color: '#525252', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Laid Off
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 72, fontWeight: 500, color: '#06b6d4', fontFamily: 'JetBrains Mono, monospace' }}>
              {fmtMoney(summary.total_investment)}
            </div>
            <div style={{ fontSize: 18, color: '#525252', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              AI Spend
            </div>
          </div>
        </div>
        <div style={{ fontSize: 20, color: '#525252', marginTop: 56 }}>
          ai-layoffs.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
