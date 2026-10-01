function getCookie(name) {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

let csrfReady = null

async function ensureCsrfCookie() {
  if (getCookie('csrftoken')) return
  if (!csrfReady) {
    csrfReady = fetch('/api/auth/csrf/', { credentials: 'include' })
  }
  await csrfReady
}

async function request(path, { method = 'GET', body, isFormData = false } = {}) {
  if (method !== 'GET') {
    await ensureCsrfCookie()
  }

  const headers = {}
  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }
  const csrftoken = getCookie('csrftoken')
  if (csrftoken && method !== 'GET') {
    headers['X-CSRFToken'] = csrftoken
  }

  const res = await fetch(path, {
    method,
    headers,
    credentials: 'include',
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  })

  let data = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    const error = new Error('request_failed')
    error.status = res.status
    error.data = data
    throw error
  }

  return data
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body, opts = {}) => request(path, { method: 'POST', body, ...opts }),
  patch: (path, body, opts = {}) => request(path, { method: 'PATCH', body, ...opts }),
  put: (path, body, opts = {}) => request(path, { method: 'PUT', body, ...opts }),
  del: (path) => request(path, { method: 'DELETE' }),
}

export { ensureCsrfCookie }
