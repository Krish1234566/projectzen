import './Sidebar.css'

const NAV_ITEMS = [
  { key: 'patients', label: 'Patients' },
  { key: 'prescriptions', label: 'Prescriptions' },
]

function Sidebar({ user, page, onNavigate, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>Zenve Doctors</h1>
        <p>Veterinary Practice OS</p>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`sidebar-nav-item${page === item.key ? ' active' : ''}`}
            onClick={() => onNavigate(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="sidebar-user-name">{user.name || user.email}</span>
          <span className="sidebar-user-email">{user.email}</span>
        </div>
        <button type="button" className="sidebar-logout" onClick={onLogout}>
          Log out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
