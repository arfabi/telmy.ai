/**
 * Telmy API Configuration & URL Helper
 * 
 * Supports:
 * 1. Environment variable VITE_API_BASE_URL (if provided)
 * 2. Vite Dev Server proxy (`/api/...` forwards to backend automatically)
 * 3. Unified Production runner (frontend served by Express on same origin)
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

/**
 * Returns fully-qualified API URL
 * @param path Endpoint path (e.g. '/api/user/sync')
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${cleanPath}`
}
