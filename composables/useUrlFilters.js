export const useUrlFilters = () => {
  const route = useRoute();
  const router = useRouter();

  // Read filters from URL query
  const readFromUrl = () => {
    return {
      sort: route.query.sort || "newest",
      page: route.query.page ? parseInt(route.query.page) : 1,
      gender: route.query.gender || null,
      province: route.query.province ? parseInt(route.query.province) : null,
      specialty: route.query.specialty ? parseInt(route.query.specialty) : null,
      city: route.query.city ? parseInt(route.query.city) : null,
      type: route.query.type ? parseInt(route.query.type) : null,
      visit: route.query.visit || null,
      search: route.query.search || null,
    };
  };

  // Write filters to URL (without page reload)
  const writeToUrl = (filters, replace = false) => {
    const query = {};

    // Only include non-default values to keep URL clean
    if (filters.sort && filters.sort !== "newest") query.sort = filters.sort;
    if (filters.page && filters.page !== 1) query.page = filters.page.toString();
    if (filters.gender) query.gender = filters.gender;
    if (filters.province) query.province = filters.province.toString();
    if (filters.specialty) query.specialty = filters.specialty.toString();
    if (filters.city) query.city = filters.city.toString();
    if (filters.type) query.type = filters.type.toString();
    if (filters.visit) query.visit = filters.visit;
    if (filters.search) query.search = filters.search;

    // Use replace to avoid adding history entry on every filter change
    if (replace) {
      router.replace({ query });
    } else {
      router.push({ query });
    }
  };

  return { readFromUrl, writeToUrl };
};
