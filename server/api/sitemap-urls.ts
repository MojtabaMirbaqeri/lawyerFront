import provinces from "@/public/provinces.json";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiEndpoint = config.public.apiEndpoint;
  const urls: {
    loc: string;
    lastmod?: string;
    changefreq?: string;
    priority?: number;
  }[] = [];

  // 0. Static pages
  urls.push({
    loc: "/lawyers",
    priority: 0.9,
    changefreq: "weekly",
  });
  urls.push({
    loc: "/faq",
    priority: 0.8,
    changefreq: "monthly",
  });
  urls.push({
    loc: "/legal-calculators",
    priority: 0.85,
    changefreq: "weekly",
  });

  // Legal calculators (per-slug)
  try {
    const calcRes = await $fetch<{ data?: { slug: string }[] }>(
      `${apiEndpoint}legal-calculators`
    );
    const list = calcRes?.data ?? [];
    if (Array.isArray(list)) {
      list.forEach((c) => {
        urls.push({
          loc: `/legal-calculators/${c.slug}`,
          priority: 0.8,
          changefreq: "monthly",
        });
      });
    }
  } catch (e) {
    console.error("Sitemap: Failed to fetch legal calculators", e);
  }

  // 1. Add Provinces
  provinces.forEach((p) => {
    // Check if en_name exists, otherwise fallback to index or handle error
    if (p.en_name) {
      urls.push({
        loc: `/provinces/${p.en_name}`,
        priority: 0.8,
        changefreq: "monthly",
      });
    }
  });

  // 2. Add Specialties
  try {
    const specialtiesRes = await $fetch<{ data: { title: string }[] }>(
      `${apiEndpoint}specialties`
    );
    if (specialtiesRes && specialtiesRes.data && Array.isArray(specialtiesRes.data)) {
      specialtiesRes.data.forEach((s) => {
        const slug = s.title.trim().replace(/\s+/g, "-");
        urls.push({
          loc: `/specialties/${slug}`,
          priority: 0.8,
          changefreq: "monthly",
        });
      });
    }
  } catch (e) {
    console.error("Sitemap: Failed to fetch specialties", e);
  }

  // 3. Add Lawyers (From Local JSON Files)
  try {
    const fs = await import("node:fs");
    const path = await import("node:path");

    // We have 4 parts: lawyers_part_1.json to lawyers_part_4.json
    const fileNames = [
      "lawyers_part_1.json",
      "lawyers_part_2.json",
      "lawyers_part_3.json",
      "lawyers_part_4.json",
    ];

    for (const fileName of fileNames) {
      const filePath = path.join(process.cwd(), "public", "lawyers", fileName);

      if (fs.existsSync(filePath)) {
        // Read and parse the file synchronously (it's fast enough for 4 files)
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const lawyersList = JSON.parse(fileContent);

        if (Array.isArray(lawyersList)) {
          lawyersList.forEach((l: any) => {
            // Data shape: { id, first_name, last_name }
            const name = l.first_name || "";
            const family = l.last_name || "";
            const fullname = `${name} ${family}`
              .trim()
              .replace(/\s+/g, "-")
              .replace(/%/g, "");

            urls.push({
              loc: `/lawyer/${l.id}/${fullname}`,
              changefreq: "weekly",
              priority: 0.9,
              // File doesn't have date, use current date or omit lastmod to save bytes
              // lastmod: new Date().toISOString()
            });
          });
        }
      } else {
        console.warn(`Sitemap: File not found ${filePath}`);
      }
    }
  } catch (e) {
    console.error("Sitemap: Failed to read lawyer json files", e);
  }

  // Remove API fetching logic
  return urls;
});
