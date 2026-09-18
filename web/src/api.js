const BASE_URL = '/api'

let authToken = null
let onUnauthorized = null

export function setAuthToken(token) {
  authToken = token
}

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

async function request(path, options) {
  const headers = { 'Content-Type': 'application/json' }
  if (authToken) headers.Authorization = `Bearer ${authToken}`

  const response = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...options,
  })

  if (response.status === 401 || response.status === 403) {
    onUnauthorized?.()
    throw new Error('Your session has expired. Please log in again.')
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message || `Request failed: ${response.status}`)
  }

  if (response.status === 204) return null
  return response.json()
}

export function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function fetchOwners() {
  return request('/owners')
}

export function fetchPatients({ species, search } = {}) {
  const params = new URLSearchParams()
  if (species && species !== 'All') params.set('species', species)
  if (search) params.set('search', search)
  const query = params.toString()
  return request(`/patients${query ? `?${query}` : ''}`)
}

export function createPatient(payload) {
  return request('/patients', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updatePatient(id, payload) {
  return request(`/patients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deletePatient(id) {
  return request(`/patients/${id}`, { method: 'DELETE' })
}

export function fetchPrescriptions(patientId) {
  const query = patientId ? `?patientId=${patientId}` : ''
  return request(`/prescriptions${query}`)
}

export function createPrescription(payload) {
  return request('/prescriptions', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
