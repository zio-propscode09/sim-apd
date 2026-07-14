export function LoadingPage({ label = 'Memuat data...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '60px 0' }}>
      <div className="spinner spinner-dark" />
      <span style={{ color: 'var(--gray-500)', fontSize: 13.5 }}>{label}</span>
    </div>
  );
}

export function ButtonSpinner() {
  return (
    <div className="dot-spinner">
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
    </div>
  );
}

// ===== SKELETON (PHANTOM UI) COMPONENTS =====

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div className="skeleton skeleton-title" style={{ width: '25%' }} />
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th><div className="skeleton skeleton-text" style={{ width: '60px', marginBottom: 0 }} /></th>
              <th><div className="skeleton skeleton-text" style={{ width: '120px', marginBottom: 0 }} /></th>
              <th><div className="skeleton skeleton-text" style={{ width: '100px', marginBottom: 0 }} /></th>
              <th><div className="skeleton skeleton-text" style={{ width: '80px', marginBottom: 0 }} /></th>
              <th><div className="skeleton skeleton-text" style={{ width: '90px', marginBottom: 0 }} /></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i}>
                <td><div className="skeleton skeleton-text" style={{ width: '40px', marginBottom: 0 }} /></td>
                <td>
                  <div className="skeleton skeleton-text" style={{ width: '80%', marginBottom: 6 }} />
                  <div className="skeleton skeleton-text" style={{ width: '50%', height: 10, marginBottom: 0 }} />
                </td>
                <td><div className="skeleton skeleton-text" style={{ width: '70%', marginBottom: 0 }} /></td>
                <td><div className="skeleton skeleton-text" style={{ width: '50px', borderRadius: 12, height: 24, marginBottom: 0 }} /></td>
                <td><div style={{ display: 'flex', gap: 8 }}><div className="skeleton skeleton-avatar" style={{ width: 32, height: 32 }} /><div className="skeleton skeleton-avatar" style={{ width: 32, height: 32 }} /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div>
      <div className="skeleton skeleton-title" style={{ width: '30%', height: 28, marginBottom: 6 }} />
      <div className="skeleton skeleton-text" style={{ width: '20%', height: 14, marginBottom: 24 }} />
      
      <div className="stat-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="skeleton-card" key={i}>
            <div className="skeleton skeleton-text" style={{ width: '50%', height: 12 }} />
            <div className="skeleton skeleton-title" style={{ width: '40%', height: 32, margin: 0 }} />
          </div>
        ))}
      </div>

      <div className="dashboard-row">
        <SkeletonTable rows={4} />
        <div className="skeleton-card" style={{ marginTop: 16 }}>
          <div className="skeleton skeleton-title" style={{ width: '60%' }} />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <div className="skeleton skeleton-avatar" style={{ width: 40, height: 40 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton skeleton-text" style={{ width: '80%', marginBottom: 6 }} />
                <div className="skeleton skeleton-text" style={{ width: '40%', height: 10, marginBottom: 0 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonCardList({ count = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="skeleton skeleton-title" style={{ width: '50%', height: 24, marginBottom: 8 }} />
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton-card" key={i} style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div className="skeleton skeleton-text" style={{ width: '60%', height: 16, marginBottom: 0 }} />
            <div className="skeleton skeleton-text" style={{ width: '20%', height: 12, borderRadius: 12, marginBottom: 0 }} />
          </div>
          <div className="skeleton skeleton-text short" />
          <div className="skeleton skeleton-text" style={{ width: '40%' }} />
        </div>
      ))}
    </div>
  );
}
