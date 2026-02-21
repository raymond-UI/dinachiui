import { MetadataRoute } from "next";
import { getAllComponents } from "@/lib/components";
import { getAllDocs } from "@/lib/docs";

const BASE_URL = "https://dinachi.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const components = await getAllComponents();
  const docs = await getAllDocs();

  const componentPages = components.map((component) => ({
    url: `${BASE_URL}/docs/components/${component.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const docPages = docs.map((doc) => ({
    url: `${BASE_URL}/docs/${doc.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/docs/components`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...docPages,
    ...componentPages,
  ];
}
