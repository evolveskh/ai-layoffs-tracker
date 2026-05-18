import { MetadataRoute } from "next";
import { getAllCompanies } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ai-layoffs-tracker-gamma.vercel.app";

  const companies = getAllCompanies();

  const companyPages = companies.map((company) => ({
    url: `${baseUrl}/company/${company.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    ...companyPages,
  ];
}
