import { useState } from 'react'
import './PatientModal.css'

function toForm(patient) {
  return {
    petName: patient?.petName ?? '',
    species: patient?.species ?? 'Dog',
    breed: patient?.breed ?? '',
    sex: patient?.sex ?? 'Male',
    dob: patient?.dob ?? '',
    weight: patient?.weight ?? '',
    ownerId: patient?.ownerId ? String(patient.ownerId) : '',
    alerts: patient?.alerts ?? '',
  }
}

function PatientModal({ owners, patient, onCreate, onUpdate, onClose }) {
  const isEditing = Boolean(patient)
  const [form, setForm] = useState(toForm(patient))
  const [isCreatingOwner, setIsCreatingOwner] = useState(false)
  const [newOwnerName, setNewOwnerName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError(null)

    if (!form.petName.trim()) return
    if (!isCreatingOwner && !form.ownerId) {
      setFormError('Select an owner or create a new one.')
      return
    }
    if (isCreatingOwner && !newOwnerName.trim()) {
      setFormError('Enter the new owner\'s name.')
      return
    }

    const payload = {
      petName: form.petName.trim(),
      species: form.species,
      breed: form.breed.trim(),
      sex: form.sex,
      dob: form.dob || null,
      weight: form.weight === '' ? null : Number(form.weight),
      alerts: form.alerts.trim(),
      ownerId: isCreatingOwner ? null : Number(form.ownerId),
      ownerName: isCreatingOwner ? newOwnerName.trim() : null,
    }

    setIsSubmitting(true)
    try {
      if (isEditing) {
        await onUpdate(patient.id, payload)
      } else {
        await onCreate(payload)
      }
      onClose()
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{isEditing ? 'Edit patient' : 'Register new patient'}</h3>
            <p>Patient and owner information is saved to the backend.</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {formError && <div className="form-error">{formError}</div>}

          <div className="form-row">
            <label>
              Pet name
              <input
                type="text"
                placeholder="Enter pet name"
                value={form.petName}
                onChange={(e) => updateField('petName', e.target.value)}
                required
              />
            </label>
            <label>
              Species
              <select
                value={form.species}
                onChange={(e) => updateField('species', e.target.value)}
              >
                <option>Dog</option>
                <option>Cat</option>
                <option>Bird</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          <div className="form-row">
            <label>
              Breed
              <input
                type="text"
                placeholder="Enter breed"
                value={form.breed}
                onChange={(e) => updateField('breed', e.target.value)}
              />
            </label>
            <label>
              Sex
              <select
                value={form.sex}
                onChange={(e) => updateField('sex', e.target.value)}
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </label>
          </div>

          <div className="form-row">
            <label>
              Date of birth
              <input
                type="date"
                value={form.dob ?? ''}
                onChange={(e) => updateField('dob', e.target.value)}
              />
            </label>
            <label>
              Weight (kg)
              <input
                type="number"
                placeholder="Enter weight"
                value={form.weight ?? ''}
                onChange={(e) => updateField('weight', e.target.value)}
              />
            </label>
          </div>

          <label>
            Owner
            {isCreatingOwner ? (
              <input
                type="text"
                placeholder="Enter owner name"
                value={newOwnerName}
                onChange={(e) => setNewOwnerName(e.target.value)}
              />
            ) : (
              <select
                value={form.ownerId}
                onChange={(e) => updateField('ownerId', e.target.value)}
              >
                <option value="" disabled>
                  Select owner
                </option>
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name}
                  </option>
                ))}
              </select>
            )}
          </label>

          <button
            type="button"
            className="btn-link"
            onClick={() => {
              setIsCreatingOwner((prev) => !prev)
              setNewOwnerName('')
            }}
          >
            {isCreatingOwner ? 'Select existing owner' : '+ Create new owner'}
          </button>

          <label>
            Medical alerts
            <input
              type="text"
              placeholder="e.g. Allergy, Diabetes"
              value={form.alerts}
              onChange={(e) => updateField('alerts', e.target.value)}
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isEditing ? 'Save changes' : 'Register patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PatientModal
