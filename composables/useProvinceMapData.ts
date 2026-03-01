/**
 * Fetches province active lawyer counts from API and merges with static provinces.json
 * so each province has id, name, en_name, active_lawyer_count for map and list.
 */

import type { Ref } from 'vue'

export interface ProvinceWithCount {
  id: number
  name: string
  en_name: string
  active_lawyer_count: number
}

export function useProvinceMapData(): {
  provincesWithCounts: Ref<ProvinceWithCount[]>
  pending: Ref<boolean>
  error: Ref<string | null>
  refresh: (() => Promise<void>) | null
} {
  const provincesWithCounts = ref<ProvinceWithCount[]>([])
  const pending = ref(true)
  const error = ref<string | null>(null)

  const provincesStatic = import('~/public/provinces.json').then((m) => m.default as Array<{ id: number; name: string; en_name: string }>)

  async function load() {
    pending.value = true
    error.value = null
    try {
      const [staticList, countsRes] = await Promise.all([
        provincesStatic,
        useGet({ url: 'area/provinces/active-lawyer-counts', query: {} }, false),
      ])
      const counts = (countsRes?.data ?? []) as Array<{ id: number; name: string; active_lawyer_count: number }>
      const countById = Object.fromEntries(counts.map((c) => [c.id, c.active_lawyer_count]))
      provincesWithCounts.value = staticList.map((p) => ({
        id: p.id,
        name: p.name,
        en_name: p.en_name,
        active_lawyer_count: countById[p.id] ?? 0,
      }))
    } catch (e) {
      const staticList = await provincesStatic
      provincesWithCounts.value = staticList.map((p) => ({
        id: p.id,
        name: p.name,
        en_name: p.en_name,
        active_lawyer_count: 0,
      }))
      error.value = e instanceof Error ? e.message : 'خطا در بارگذاری تعداد وکلا'
    } finally {
      pending.value = false
    }
  }

  const refresh = () => load()

  onMounted(load)

  return {
    provincesWithCounts,
    pending,
    error,
    refresh,
  }
}
