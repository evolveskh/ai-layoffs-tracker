export interface Company {
  id: string;
  name: string;
  ticker: string | null;
  sector: Sector;
  logo_url: string;
  total_employees: number | null;
  description: string | null;
  last_updated: string;
}

export type Sector = "Big Tech" | "SaaS" | "Semiconductor" | "E-commerce" | "Enterprise" | "Other";

export interface LayoffEvent {
  id: string;
  company_id: string;
  type: "layoff";
  date: string;
  number: number;
  amount: null;
  description: string;
  source_url: string;
  source_name: string;
  verified: boolean;
}

export interface InvestmentEvent {
  id: string;
  company_id: string;
  type: "investment";
  date: string;
  number: null;
  amount: number;
  description: string;
  source_url: string;
  source_name: string;
  verified: boolean;
}

export type Event = LayoffEvent | InvestmentEvent;

export interface CompanySummary {
  id: string;
  name: string;
  ticker: string | null;
  sector: Sector;
  logo_url: string;
  total_layoffs: number;
  total_investment: number;
  layoff_per_billion_ai: number;
  investment_per_layoff: number;
  total_employees: number | null;
  description: string | null;
  events: Event[];
}

export type SortField = "name" | "sector" | "total_layoffs" | "total_investment" | "layoff_per_billion_ai";
export type SortDirection = "asc" | "desc";
