import { getAllSummaries } from '@/lib/data';
import HomePage from '@/components/HomePage';

export const revalidate = 86400; // ISR: refresh daily

export default function Page() {
  const summaries = getAllSummaries();
  return <HomePage summaries={summaries} />;
}
