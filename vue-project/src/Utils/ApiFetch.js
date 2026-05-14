// Petit client HTTP
// Gère le header Authorization si un token est présent, parse JSON sauf 204.
export async function apiFetch(path, options = {}) {
  // import.meta.env disponible via Vite; fallback local si non défini
  const base = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  const apiKey = import.meta.env.VITE_API_KEY || ''
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'x-api-key': apiKey,
  }
  // Si path est une URL absolue (http/https), on ne préfixe pas avec la base
  const isAbsolute = /^https?:\/\//i.test(path)
  const url = isAbsolute ? path : base + path
  console.log('apiKey:', apiKey)
  console.log('base:', base)
  console.log({ ...options, headers })
  const res = await fetch(url, { ...options, headers })
  console.log(res.json)
  if (!res.ok) {
    // const text = await res.text()
    // throw new Error(`HTTP ${res.status} ${text || ''}`.trim())
    const errorData = await res.json()
    const error = new Error(errorData.message || 'Erreur inconnue')
    error.status = res.status

    throw error
  }
  if (res.status === 204) return null
  // Tenter JSON, sinon renvoyer texte
  const contentType = res.headers.get('Content-Type') || ''
  if (contentType.includes('application/json')) return res.json()
  return res.text()
}

// export function getToken() {
//   return localStorage.getItem('token')
// }

export function logout(router) {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  if (router) router.push({ name: 'Login' })
}
