import { useState } from 'react'
import PatientModal from './PatientModal'
import './PatientsPage.css'

const SPECIES_FILTERS = ['All', 'Dog', 'Cat', 'Bird', 'Other']

function PatientsPage({
  patients,
  owners,
  loading,
  error,
  species,
  search,
  onSpeciesChange,
  onSearchChange,
  onCreate,
  onUpdate,
  onDelete,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)

  function openCreateModal() {
    setEditingPatient(null)
    setIsModalOpen(true)
  }

  function openEditModal(patient) {
    setEditingPatient(patient)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingPatient(null)
  }

  async function handleDelete(patient) {
    if (!window.confirm(`Delete patient "${patient.petName}"?`)) return
    await onDelete(patient.id)
  }

  return (
    <div className="patients-page">
      <header className="patients-header">
        <div>
          <h2>Patients</h2>
          <p>{patients.length} registered pets</p>
        </div>
        <button type="button" className="btn-primary" onClick={openCreateModal}>
          + New patient
        </button>
      </header>

      {error && <div className="patients-banner">{error}</div>}

      <input
        type="text"
        className="patients-search"
        placeholder="Search by pet or owner name"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="patients-filters">
        {SPECIES_FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`filter-chip ${species === filter ? 'active' : ''}`}
            onClick={() => onSpeciesChange(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="patients-table">
        <div className="patients-table-head">
          <span>Pet</span>
          <span>Owner</span>
          <span>Species / Breed</span>
          <span>Alerts</span>
          <span>Action</span>
        </div>

        {loading ? (
          <div className="patients-empty">Loading patients…</div>
        ) : patients.length === 0 ? (
          <div className="patients-empty">No patients registered yet.</div>
        ) : (
          patients.map((patient) => (
            <div className="patients-table-row" key={patient.id}>
              <span>{patient.petName}</span>
              <span>{patient.ownerName}</span>
              <span>
                {patient.species}
                {patient.breed ? ` · ${patient.breed}` : ''}
              </span>
              <span>{patient.alerts || '—'}</span>
              <span className="row-actions">
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => openEditModal(patient)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn-link danger"
                  onClick={() => handleDelete(patient)}
                >
                  Delete
                </button>
              </span>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <PatientModal
          owners={owners}
          patient={editingPatient}
          onCreate={onCreate}
          onUpdate={onUpdate}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

export default PatientsPage
