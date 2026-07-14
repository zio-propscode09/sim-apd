import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MahasiswaLayout from '../../components/MahasiswaLayout';
import QrScannerBox from '../../components/QrScannerBox';
import { ButtonSpinner } from '../../components/Loading';
import { apiErrorMessage } from '../../api/client';
import api from '../../api/client';
import { CheckCircle } from 'lucide-react';

export default function ScanPengembalian() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  async function handleScanResult(token) {
    if (processing || success) return;
    setError('');
    setProcessing(true);
    setIsScanning(false);
    try {
      await api.post('/api/pengembalian/confirm-scan', { token });
      setSuccess(true);
    } catch (err) {
      setError(apiErrorMessage(err, 'Gagal memproses QR Code. Pastikan QR valid atau belum kadaluarsa.'));
      setProcessing(false);
    }
  }

  if (success) {
    return (
      <MahasiswaLayout title="Selesai" hideNav>
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
            <CheckCircle size={64} color="var(--primary-color)" />
          </div>
          <h3 style={{ fontSize: 18, marginBottom: 8, color: 'var(--slate-900)' }}>Pengembalian Berhasil!</h3>
          <p style={{ fontSize: 14, color: 'var(--slate-500)', marginBottom: 24, lineHeight: 1.5 }}>
            Terima kasih telah mengembalikan APD. Status peminjaman Anda sekarang telah selesai.
          </p>
          <button className="btn btn-primary btn-block" onClick={() => navigate('/m')}>
            Kembali ke Beranda
          </button>
        </div>
      </MahasiswaLayout>
    );
  }

  return (
    <MahasiswaLayout title="Scan QR HC" subtitle="Arahkan kamera ke layar komputer HC">
      <div className="card" style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: 'var(--slate-600)', marginBottom: 16 }}>
          Pastikan Staf HC sudah menekan tombol konfirmasi dan layar mereka memunculkan QR Code pengembalian.
        </p>
        
        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
        
        {processing ? (
          <div style={{ padding: '40px 0' }}>
            <ButtonSpinner /> <span style={{ marginLeft: 8 }}>Memproses Pengembalian...</span>
          </div>
        ) : isScanning ? (
          <QrScannerBox onResult={handleScanResult} />
        ) : (
          <div 
            style={{ 
              padding: '60px 20px', 
              background: 'var(--bg-color)', 
              borderRadius: 16, 
              border: '2px dashed var(--border-color)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16
            }}
            onClick={() => setIsScanning(true)}
            className="hover-scale"
          >
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>Ketuk untuk Memulai Scanner</h3>
              <p style={{ fontSize: 13, color: 'var(--slate-500)', margin: 0 }}>Kamera akan aktif setelah tombol ini ditekan</p>
            </div>
          </div>
        )}
      </div>
    </MahasiswaLayout>
  );
}
