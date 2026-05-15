import { Company, Event, CompanySummary, Sector, LayoffEvent, InvestmentEvent, SortField, SortDirection } from "./types";
import companiesData from "../../data/companies.json";
import eventsData from "../../data/events.json";

const companies: Company[] = companiesData as Company[];
const events: Event[] = eventsData as Event[];

export function getAllCompanies(): Company[] {
  return companies;
}

export function getEvents(): Event[] {
  return events;
}

export function getEventsForCompany(companyId: string): Event[] {
  return events
    .filter((e) => e.company_id === companyId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getCompany(id: string): Company | undefined {
  return companies.find((c) => c.id === id);
}

export function getCompanySummary(id: string): CompanySummary | null {
  const company = getCompany(id);
  if (!company) return null;
  const companyEvents = getEventsForCompany(id);
  return buildSummary(company, companyEvents);
}

export function getAllSummaries(): CompanySummary[] {
  return companies.map((company) => {
    const companyEvents = getEventsForCompany(company.id);
    return buildSummary(company, companyEvents);
  });
}

// Alias for backward compat
export const getAllCompanySummaries = getAllSummaries;

export function getUniqueSectors(): Sector[] {
  const sectors = new Set(companies.map((c) => c.sector));
  return Array.from(sectors).sort();
}

function buildSummary(company: Company, companyEvents: Event[]): CompanySummary {
  const layoffEvents = companyEvents.filter(
    (e): e is LayoffEvent => e.type === "layoff"
  );
  const investmentEvents = companyEvents.filter(
    (e): e is InvestmentEvent => e.type === "investment"
  );

  const total_layoffs = layoffEvents.reduce((sum, e) => sum + (e.number || 0), 0);
  const total_investment = investmentEvents.reduce((sum, e) => sum + (e.amount || 0), 0);

  const investmentBillions = total_investment / 1000;
  const layoff_per_billion_ai =
    investmentBillions > 0 ? total_layoffs / investmentBillions : 0;

  const investment_per_layoff =
    total_layoffs > 0 ? total_investment / total_layoffs : 0;

  return {
    id: company.id,
    name: company.name,
    ticker: company.ticker,
    sector: company.sector,
    logo_url: company.logo_url,
    total_layoffs,
    total_investment,
    layoff_per_billion_ai,
    investment_per_layoff,
    total_employees: company.total_employees,
    description: company.description,
    events: companyEvents,
  };
}

export function sortSummaries(
  summaries: CompanySummary[],
  field: SortField,
  direction: SortDirection
): CompanySummary[] {
  return [...summaries].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return direction === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return direction === 'asc'
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1)}M`;
  }
  if (n >= 1_000) {
    return `${(n / 1_000).toFixed(0)}K`;
  }
  return n.toLocaleString();
}

export function formatMoney(amount: number): string {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}B`;
  return `$${amount}M`;
}

export function getLastUpdated(): string {
  const dates = events.map((e) => e.date);
  dates.sort((a, b) => b.localeCompare(a));
  return dates[0] || "2026-05-15";
}
