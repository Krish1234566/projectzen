import { useState } from 'react'
import VoiceDictation from './VoiceDictation'
import { createPrescription } from '../api'
import './PrescriptionsPage.css'

const EMPTY_FORM = {
  patientId: '',
  weight: '',
  date: new Date().toISOString().slice(0, 10),
  complaint: '',
  diagnosis: '',
  notes: '',
}

function PrescriptionsPage({ patients }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [savedMessage, setSavedMessage] = useState(null)

  function updateField(field, value) {
    setSavedMessage(null)
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function appendToNotes(text) {
    setSavedMessage(null)
    setForm((prev) => ({ ...prev, notes: prev.notes ? `${prev.notes}\n${text}` : text }))
  }

  function resetForm() {
    setForm({ ...EMPTY_FORM, date: new Date().toISOString().slice(0, 10) })
    setError(null)
    setSavedMessage(null)
  }

  async function handleSave() {
    setError(null)
    setSavedMessage(null)

    if (!form.patientId) {
      setError('Select a patient before saving.')
      return
    }

    const payload = {
      patientId: Number(form.patientId),
      weight: form.weight === '' ? null : Number(form.weight),
      date: form.date || null,
      complaint: form.complaint.trim(),
      diagnosis: form.diagnosis.trim(),
      notes: form.notes.trim(),
    }

    setIsSaving(true)
    try {
      const saved = await createPrescription(payload)
      setForm({ ...EMPTY_FORM, date: new Date().toISOString().slice(0, 10) })
      setSavedMessage(`Prescription saved for ${saved.petName}.`)
    } catch (err) {
      setError(err.message || 'The prescription could not be saved.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="prescriptions-page">
      <header className="prescriptions-header">
        <div>
          <h2>Digital prescription</h2>
          <p>Dictate the prescription — it is transcribed into the notes below.</p>
        </div>
        <button type="button" className="btn-link" onClick={resetForm} disabled={isSaving}>
          Clear form
        </button>
      </header>

      <div className="prescription-card">
        <div className="prescription-row">
          <label>
            Patient
            <select
              value={form.patientId}
              onChange={(event) => updateField('patientId', event.target.value)}
            >
              <option value="">Select patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.petName}
                  {patient.ownerName ? ` — ${patient.ownerName}` : ''}
                </option>
              ))}
            </select>
          </label>

          <label>
            Weight (kg)
            <input
              type="number"
              min="0"
              step="0.1"
              value={form.weight}
              onChange={(event) => updateField('weight', event.target.value)}
            />
          </label>

          <label>
            Date
            <input
              type="date"
              value={form.date}
              onChange={(event) => updateField('date', event.target.value)}
            />
          </label>
        </div>

        <VoiceDictation onTranscript={appendToNotes} />

        <label>
          Presenting complaint
          <input
            type="text"
            value={form.complaint}
            onChange={(event) => updateField('complaint', event.target.value)}
          />
        </label>

        <label>
          Diagnosis
          <input
            type="text"
            value={form.diagnosis}
            onChange={(event) => updateField('diagnosis', event.target.value)}
          />
        </label>

        <label>
          Notes
          <textarea
            rows={8}
            placeholder="Dictate with the mic above, or type here."
            value={form.notes}
            onChange={(event) => updateField('notes', event.target.value)}
          />
        </label>

        {error && <p className="prescription-error">{error}</p>}
        {savedMessage && <p className="prescription-saved">{savedMessage}</p>}

        <div className="prescription-actions">
          <button type="button" className="btn-primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save prescription'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrescriptionsPage
