import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import PatientsPage from './components/PatientsPage'
import PrescriptionsPage from './components/PrescriptionsPage'
import LoginPage from './components/LoginPage'
import {
  fetchOwners,
  fetchPatients,
  createPatient,
  updatePatient,
  deletePatient,
  setAuthToken,
  setUnauthorizedHandler,
} from './api'
import './App.css'

const AUTH_STORAGE_KEY = 'zenve.auth'

function loadStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function App() {
  const [auth, setAuth] = useState(loadStoredAuth)
  const [page, setPage] = useState('patients')
  const [owners, setOwners] = useState([])
  const [patients, setPatients] = useState([])
  const [species, setSpecies] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setAuthToken(auth?.token ?? null)
  }, [auth])

  useEffect(() => {
    setUnauthorizedHandler(handleLogout)
  }, [])

  function handleLogin(authData) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData))
    setAuth(authData)
  }

  function handleLogout() {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setAuth(null)
  }

  function loadOwners() {
    fetchOwners().then(setOwners).catch(() => {})
  }

  function loadPatients() {
    setLoading(true)
    setError(null)
    fetchPatients({ species, search })
      .then(setPatients)
      .catch((err) => setError(err.message || 'Unable to load patients from the server.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!auth) return
    loadOwners()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth])

  useEffect(() => {
    if (!auth) return
    const timeout = setTimeout(loadPatients, 250)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, species, search])

  async function handleCreate(payload) {
    await createPatient(payload)
    loadOwners()
    loadPatients()
  }

  async function handleUpdate(id, payload) {
    await updatePatient(id, payload)
    loadOwners()
    loadPatients()
  }

  async function handleDelete(id) {
    await deletePatient(id)
    loadPatients()
  }

  if (!auth) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="app-shell">
      <Sidebar user={auth} page={page} onNavigate={setPage} onLogout={handleLogout} />
      <main className="app-main">
        {page === 'prescriptions' ? (
          <PrescriptionsPage patients={patients} />
        ) : (
          <PatientsPage
            patients={patients}
            owners={owners}
            loading={loading}
            error={error}
            species={species}
            search={search}
            onSpeciesChange={setSpecies}
            onSearchChange={setSearch}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  )
}

export default App
