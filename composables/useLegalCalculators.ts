/**
 * Composable for Legal Calculators API.
 * API response envelope: { status, data, message }
 */

export interface CalculatorListItem {
  id: number
  slug: string
  title: string
  short_description: string | null
  category: string | null
  icon: string | null
  result_type: string
  is_featured: boolean
  sort_order: number
}

export interface CalculatorDetail {
  metadata: Record<string, unknown>
  form_schema: { fields?: FormFieldSchema[] }
  content_blocks: Record<string, unknown>
  active_version: { id: number; version_label: string; effective_from: string; legal_reference: string | null } | null
}

export interface FormFieldSchema {
  name: string
  label: string
  type: string
  required?: boolean
  options?: { value: string; label: string }[] | { value: string; label: string; days?: number }[]
  helper_text?: string
  min?: number
  item_schema?: FormFieldSchema[]
}

export interface CalculatorResult {
  calculator: { slug: string; title: string }
  version: Record<string, unknown>
  summary: string
  result_type: 'amount' | 'table' | 'breakdown' | 'date' | 'mixed'
  primary_value: number | string | null
  currency?: string
  breakdown?: { label: string; value: unknown }[]
  table?: Record<string, unknown>[]
  warnings?: string[]
  disclaimer?: string
  legal_reference?: string | null
  cta?: { title: string; url: string }
  explanation?: string[]
}

function getData<T>(response: { data?: { data?: T; status?: number }; status?: boolean }, fallback?: T): T | null {
  const d = response?.data
  if (d && typeof d === 'object' && 'data' in d) return (d as { data: T }).data as T
  if (d != null) return d as T
  return fallback ?? null
}

export function useLegalCalculators() {
  async function fetchCalculators(params?: { category?: string; featured?: boolean }) {
    const query: Record<string, string> = {}
    if (params?.category) query.category = params.category
    if (params?.featured !== undefined) query.featured = String(params.featured)
    const res = await useGet({ url: 'legal-calculators', includeAuthHeader: false, query }, false)
    return { data: getData<CalculatorListItem[]>(res) ?? [], status: res.status, error: res.error }
  }

  async function fetchCalculatorBySlug(slug: string) {
    const res = await useGet({ url: `legal-calculators/${slug}`, includeAuthHeader: false }, false)
    return { data: getData<CalculatorDetail>(res), status: res.status, error: res.error }
  }

  async function calculate(slug: string, payload: Record<string, unknown>) {
    const res = await usePost(
      { url: `legal-calculators/${slug}/calculate`, includeAuthHeader: false, body: payload },
      true
    )
    return { data: getData<CalculatorResult>(res), status: res.status, error: res.error }
  }

  async function trackConversion(slug: string, context: { context?: string; cta_type?: string }) {
    const res = await usePost(
      { url: `legal-calculators/${slug}/track-conversion`, includeAuthHeader: true, body: context },
      false
    )
    return { data: getData(res), status: res.status }
  }

  return { fetchCalculators, fetchCalculatorBySlug, calculate, trackConversion }
}
