import { useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { ScanLine, AlertCircle } from 'lucide-react';
import { ButtonSpinner } from './Loading';

/**
 * Komponen scan QR Code yang menggunakan Native Camera / Upload File.
 * Alih-alih merender video live, pengguna mengetuk container untuk memilih opsi kamera/galeri.
 */
export default function QrScannerBox({ onResult }) {
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  async function handleFileSelected(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setError('');

    try {
      const html5QrCode = new Html5Qrcode("dummy-qr-reader");
      const decodedText = await html5QrCode.scanFile(file, false);
      
      onResult(decodedText.trim());
      e.target.value = '';
    } catch (err) {
      console.error(err);
      setError('QR Code tidak terdeteksi pada gambar. Pastikan gambar jelas dan tidak blur.');
      e.target.value = '';
    } finally {
      setIsScanning(false);
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      
      <div id="dummy-qr-reader" style={{ display: 'none' }}></div>

      {error && (
        <div style={{ background: 'var(--red-50)', color: 'var(--red-600)', padding: '12px', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 10, textAlign: 'left', marginBottom: 16 }}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>{error}</span>
        </div>
      )}

      {isScanning ? (
        <div className="card" style={{ padding: '60px 0', textAlign: 'center' }}>
          <ButtonSpinner /> <div style={{ marginTop: 12, fontWeight: 500, color: 'var(--text-main)' }}>Menganalisis QR Code...</div>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          style={{ 
            padding: '40px 20px', 
            background: 'var(--card-bg)', 
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
          className="hover-scale"
        >
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
            <ScanLine size={32} strokeWidth={2} />
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>Ketuk untuk Scan QR</h3>
            <p style={{ fontSize: 13, color: 'var(--slate-500)', margin: 0 }}>Otomatis membuka pilihan Kamera / Galeri</p>
          </div>
        </div>
      )}

      {/* Input File Tunggal (Otomatis memunculkan popup Kamera / File di HP) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelected}
      />
    </div>
  );
}
