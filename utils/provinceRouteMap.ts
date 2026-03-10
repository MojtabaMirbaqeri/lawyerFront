/**
 * Central route resolution for province lawyer pages.
 * Use this for map clicks and mobile province selector so all links stay consistent.
 */

export interface ProvinceForRoute {
  en_name: string
  id?: number
  name?: string
}

/**
 * Resolve the lawyers-by-province page route for a given province.
 * Uses existing convention: /provinces/{en_name}
 */
export function resolveProvinceLawyersRoute(province: ProvinceForRoute): string {
  if (!province?.en_name) return '/provinces'
  return `/provinces/${province.en_name}`
}
