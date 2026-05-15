import { ImageResponse } from 'next/og';
import { getAllSummaries, formatNumber, formatMoney } from '@/lib/data';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  const summaries = getAllSummaries();
  const totalLayoffs = summaries.reduce((sum, s) => sum + s.total_layoffs, 0);
  const totalInvestment = summaries.reduce((sum, s) => sum + s.total_investment, 0);

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
        <div style={{ display: 'flex', gap: 80, alignItems: 'baseline', marginBottom: 48 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 80, fontWeight: 500, color: '#e11d48', fontFamily: 'JetBrains Mono, monospace' }}>
              {fmtNum(totalLayoffs)}
            </div>
            <div style={{ fontSize: 18, color: '#525252', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Laid Off
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 80, fontWeight: 500, color: '#06b6d4', fontFamily: 'JetBrains Mono, monospace' }}>
              {fmtMoney(totalInvestment)}
            </div>
            <div style={{ fontSize: 18, color: '#525252', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              AI Spend
            </div>
          </div>
        </div>
        <div style={{ fontSize: 24, fontWeight: 600, color: '#fafafa', marginBottom: 8 }}>
          AI-Layoffs Tracker
        </div>
        <div style={{ fontSize: 18, color: '#525252' }}>
          ai-layoffs.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
