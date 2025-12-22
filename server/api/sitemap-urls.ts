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

  // 3. Add Lawyers
  const fetchLawyersPage = async (page: number) => {
    try {
      // Using a smaller per_page to avoid timeouts, but large enough to be efficient.
      // 100 items * 1200 pages = 120,000 records.
      const response = await $fetch<any>(`${apiEndpoint}lawyers`, {
        query: {
          page: page,
          per_page: 50,
        },
        retry: 3, // Nuxt 3 fetch retry
        retryDelay: 1000,
      });
      return response;
    } catch (e) {
      console.error(`Failed to fetch lawyers page ${page}`, e);
      return null;
    }
  };

  const processLawyers = (lawyers: any[]) => {
    // DEBUG: Check raw data format for the first item
    if (lawyers.length > 0) {
      console.log("DEBUG RAW LAWYER DATA:", {
        id: lawyers[0].id,
        name: lawyers[0].lawyer_info?.name,
        family: lawyers[0].lawyer_info?.family,
      });
    }

    return lawyers.map((l) => {
      const name = l.lawyer_info?.name || "";
      const family = l.lawyer_info?.family || "";
      const fullname = `${name} ${family}`.trim().replace(/\s+/g, "-").replace(/%/g, "");

      // Construct URL: /lawyer/ID/Slug (No manual encoding needed, sitemap module handles it)
      return {
        loc: `/lawyer/${l.id}/${fullname}`,
        // parsing date safely
        lastmod: l.updated_at
          ? new Date(l.updated_at).toISOString()
          : new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.9,
      };
    });
  };

  try {
    // Fetch first page to determine total pages
    const firstPage = await fetchLawyersPage(1);
    if (!firstPage || !firstPage.data) return urls;

    // Add first page lawyers
    urls.push(...processLawyers(firstPage.data));

    const total = firstPage.meta?.total || firstPage.total || 0;
    const perPage = firstPage.meta?.per_page || firstPage.per_page || 50;
    const lastPage = firstPage.meta?.last_page || Math.ceil(total / perPage);

    console.log(
      `Sitemap: Found ${total} lawyers. Fetching remaining ${lastPage - 1} pages...`
    );

    // Fetch remaining pages in batches to control concurrency
    const BATCH_SIZE = 10;
    // In Development, limit to 5 pages (250 lawyers) to avoid long waits
    const maxPages = import.meta.dev ? Math.min(6, lastPage) : lastPage;

    for (let i = 2; i <= maxPages; i += BATCH_SIZE) {
      const batchPromises = [];
      const end = Math.min(i + BATCH_SIZE - 1, maxPages);

      for (let j = i; j <= end; j++) {
        batchPromises.push(fetchLawyersPage(j));
      }

      const results = await Promise.all(batchPromises);

      results.forEach((res) => {
        if (res && res.data) {
          urls.push(...processLawyers(res.data));
        }
      });

      // Log progress every 5 batches (50 pages)
      const batchIndex = Math.floor((i - 2) / BATCH_SIZE);
      if (batchIndex % 5 === 0) {
        console.log(
          `Sitemap: Processed pages ${i} to ${Math.min(
            i + BATCH_SIZE - 1,
            lastPage
          )} (${Math.round((i / lastPage) * 100)}%)`
        );
      }
    }
  } catch (error) {
    console.error("Sitemap: Generic error generating lawyer urls", error);
  }

  return urls;
});
