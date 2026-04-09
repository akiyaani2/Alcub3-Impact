import type { MetadataRoute } from "next";

const baseUrl = "https://impact.alcub3.com";
const lastModified = new Date("2026-04-08T20:30:00-04:00");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/pulse`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/footprint`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/observatory`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.86,
    },
    {
      url: `${baseUrl}/methodology`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.84,
    },
    {
      url: `${baseUrl}/account`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.83,
    },
    {
      url: `${baseUrl}/answers`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/partners`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.82,
    },
    {
      url: `${baseUrl}/progress`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.78,
    },
    {
      url: `${baseUrl}/impact-api`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.74,
    },
  ];
}
