export function LoadingPage({ label = 'Memuat data...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '60px 0' }}>
      <div className="spinner spinner-dark" />
      <span style={{ color: 'var(--gray-500)', fontSize: 13.5 }}>{label}</span>
    </div>
  );
}

export function ButtonSpinner() {
  return <span className="spinner" />;
}
