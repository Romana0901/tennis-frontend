export const API_URL = 'http://localhost:5005'

export type PaginatedResponse<T> = {
  items: T[]
  page: number
  per_page: number
  total: number
  pages: number
}

export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new Error(data?.error || 'Dogodila se greška.')
  }

  return data as T
}

export function buildQuery(params: Record<string, string | number | boolean | null | undefined>) {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      query.set(key, String(value))
    }
  })

  return query.toString()
}

export function statusColor(status: string) {
  if (['Potvrđena', 'Aktivan'].includes(status)) {
    return 'primary'
  }

  if (['Završena', 'Vraćen'].includes(status)) {
    return 'secondary'
  }

  return 'red'
}
