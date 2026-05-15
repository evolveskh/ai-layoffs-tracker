import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        background: '#0f172a', color: 'white',
        fontFamily: 'Inter, system-ui, sans-serif',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center'
      }}>
        <div style={{ fontSize: 64, fontWeight: 800 }}>AI-Layoffs Tracker</div>
        <div style={{ fontSize: 32, color: '#94a3b8', marginTop: 16 }}>
          Who&apos;s Firing &amp; Spending on AI
        </div>
        <div style={{ fontSize: 24, color: '#64748b', marginTop: 24 }}>
          Updated daily · ai-layoffs.com
        </div>
      </div>
    )
  );
}
