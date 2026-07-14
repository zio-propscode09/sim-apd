import { useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Image as ImageIcon, ScanLine, AlertCircle } from 'lucide-react';
import { ButtonSpinner } from './Loading';

/**
 * Komponen scan QR Code yang menggunakan Native Camera / Upload File.
 * Alih-alih merender video live, pengguna "memotret" QR code.
 *
 * Props:
 *  - onResult(token): dipanggil saat QR berhasil terbaca
 */
export default function QrScannerBox({ onResult }) {
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  async function handleFileSelected(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setError('');

    try {
      // Kita butuh DOM element dummy untuk inisialisasi Html5Qrcode, tapi kita tidak memanggil start()
      const html5QrCode = new Html5Qrcode("dummy-qr-reader");
      
      // Membaca QR dari file gambar secara langsung (true = show image, kita set false agar di background)
      const decodedText = await html5QrCode.scanFile(file, false);
      
      // Jika berhasil
      onResult(decodedText.trim());
      
      // Clear input
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
    <div className="card" style={{ padding: 20, textAlign: 'center' }}>
      
      {/* Dummy element required by Html5Qrcode constructor, tapi tidak ditampilkan */}
      <div id="dummy-qr-reader" style={{ display: 'none' }}></div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
          <ScanLine size={32} strokeWidth={2} />
        </div>
        
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>Ambil Foto QR Code</h3>
          <p style={{ fontSize: 13, color: 'var(--slate-500)', margin: 0, lineHeight: 1.5 }}>
            Jepret langsung QR Code dari layar Staf HC menggunakan kamera HP Anda, atau unggah dari galeri.
          </p>
        </div>

        {error && (
          <div style={{ background: 'var(--red-50)', color: 'var(--red-600)', padding: '10px 14px', borderRadius: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left', width: '100%' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, width: '100%', marginTop: 8 }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ flex: 1, padding: '12px 8px', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            onClick={() => galleryInputRef.current?.click()}
            disabled={isScanning}
          >
            <ImageIcon size={16} /> Galeri
          </button>
          <button
            type="button"
            className="btn btn-accent"
            style={{ flex: 1, padding: '12px 8px', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            onClick={() => cameraInputRef.current?.click()}
            disabled={isScanning}
          >
            {isScanning ? <ButtonSpinner /> : <><Camera size={16} /> Kamera</>}
          </button>
        </div>

      </div>

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelected}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileSelected}
      />
    </div>
  );
}
