import { useRef, useState } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';

/**
 * Input foto dengan dua pilihan murni via Native OS:
 * 1. Ambil dari file/galeri.
 * 2. Ambil langsung menggunakan kamera HP (via capture="environment").
 */
export default function PhotoCapture({ label, onChange, required }) {
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onChange(file);
  }

  function reset() {
    setPreview(null);
    onChange(null);
    if (galleryInputRef.current) galleryInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  }

  return (
    <div className="field">
      <label>
        {label} {required && <span style={{ color: 'var(--red-600)' }}>*</span>}
      </label>

      {/* Tampilan Biasa (Belum memilih file) */}
      {!preview && (
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ flex: 1, padding: '10px 8px', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            onClick={() => galleryInputRef.current?.click()}
          >
            <ImageIcon size={16} /> Galeri / File
          </button>
          <button
            type="button"
            className="btn btn-accent"
            style={{ flex: 1, padding: '10px 8px', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera size={16} /> Kamera
          </button>
        </div>
      )}

      {/* Tampilan Preview Foto */}
      {preview && (
        <div style={{ position: 'relative' }}>
          <img src={preview} alt={label} className="photo-thumb" />
          <button
            type="button"
            className="btn btn-sm btn-danger"
            style={{ position: 'absolute', top: 8, right: 8 }}
            onClick={reset}
          >
            Hapus
          </button>
        </div>
      )}

      {/* Input File Tersembunyi untuk Galeri (Bebas pilih dari file manager) */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
      
      {/* Input File Tersembunyi untuk Kamera (Otomatis Buka Native Camera di HP) */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
    </div>
  );
}
