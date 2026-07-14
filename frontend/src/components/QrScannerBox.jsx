import { useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Image as ImageIcon, ScanLine, AlertCircle, X } from 'lucide-react';
import { ButtonSpinner } from './Loading';

export default function QrScannerBox({ onResult }) {
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  async function handleFileSelected(e) {
    setShowMenu(false);
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
          onClick={() => setShowMenu(true)}
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
            <p style={{ fontSize: 13, color: 'var(--slate-500)', margin: 0 }}>Pilih Kamera atau Galeri</p>
          </div>
        </div>
      )}

      {/* Pop-up Menu Pilihan (Action Sheet) */}
      {showMenu && !isScanning && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
        }} onClick={() => setShowMenu(false)}>
          <div style={{
            background: 'white', width: '100%', maxWidth: 480,
            borderTopLeftRadius: 20, borderTopRightRadius: 20,
            padding: '24px 20px'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--slate-800)' }}>Metode Scan QR</h3>
              <button className="icon-btn" onClick={() => setShowMenu(false)}><X size={20} /></button>
            </div>
            
            <button 
              className="btn btn-accent btn-block" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12, padding: '16px' }}
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera size={20} /> Buka Kamera Langsung
            </button>
            
            <button 
              className="btn btn-outline btn-block" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '16px' }}
              onClick={() => galleryInputRef.current?.click()}
            >
              <ImageIcon size={20} /> Pilih dari Galeri / File
            </button>
          </div>
        </div>
      )}

      {/* Input File Tersembunyi */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileSelected}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelected}
      />
    </div>
  );
}
