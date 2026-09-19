import './PrescriptionPreview.css'

function formatDate(value) {
  if (!value) return null
  const [year, month, day] = value.split('-')
  return `${day}-${month}-${year}`
}

function Field({ label, value, block = false }) {
  return (
    <div className={`rx-field${block ? ' rx-field-block' : ''}`}>
      <span className="rx-label">{label}</span>
      <span className={`rx-value${value ? '' : ' is-empty'}`}>{value || '—'}</span>
    </div>
  )
}

function PrescriptionPreview({ form, patient }) {
  return (
    <aside className="rx-preview" aria-label="Prescription preview">
      <header className="rx-head">
        <div className="rx-brand">
          <span className="rx-logo" aria-hidden="true">🐾</span>
          <div>
            <h3>Zenve Veterinary Clinic</h3>
            <p>Veterinary Doctor — General &amp; Emergency Care</p>
          </div>
        </div>
        <div className="rx-head-meta">
          <span className="rx-badge">Prescription</span>
          <span className="rx-head-date">{formatDate(form.date) || '—'}</span>
        </div>
      </header>

      <div className="rx-body">
        <div className="rx-row rx-row-4">
          <Field label="Patient" value={patient?.petName} />
          <Field label="Owner" value={patient?.ownerName} />
          <Field label="Weight" value={form.weight ? `${form.weight} kg` : null} />
          <Field label="Date" value={formatDate(form.date)} />
        </div>

        <div className="rx-row rx-row-2">
          <Field label="Complaint" value={form.complaint} />
          <Field label="Diagnosis" value={form.diagnosis} />
        </div>

        <Field label="Notes" value={form.notes} block />
      </div>

      <p className="rx-footer">This is a computer-generated prescription.</p>
    </aside>
  )
}

export default PrescriptionPreview
