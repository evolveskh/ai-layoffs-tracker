import { getAllSummaries, getUniqueSectors } from '@/lib/data';
import HomePageClient from '@/components/HomePageClient';

export const revalidate = 86400; // ISR: refresh daily

export default function Page() {
  const summaries = getAllSummaries();
  const sectors = getUniqueSectors();
  return <HomePageClient summaries={summaries} sectors={sectors} />;
}
