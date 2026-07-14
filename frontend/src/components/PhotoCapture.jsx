import { useRef, useState } from 'react';
import { Camera } from 'lucide-react';

/**
 * Input foto dengan satu tombol klik.
 * Di HP, ini akan otomatis memunculkan pop-up opsi: "Kamera" atau "Galeri".
 */
export default function PhotoCapture({ label, onChange, required }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onChange(file);
  }

  function reset(e) {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className="field">
      <label>
        {label} {required && <span style={{ color: 'var(--red-600)' }}>*</span>}
      </label>

      {/* Tampilan Preview Foto */}
      {preview ? (
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
      ) : (
        /* Container Upload */
        <div 
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '32px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            background: 'var(--bg-color)',
            transition: 'all 0.2s'
          }}
          className="hover-scale"
        >
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', margin: '0 auto 12px' }}>
            <Camera size={24} />
          </div>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--slate-800)', marginBottom: 4 }}>Ketuk untuk Ambil Foto</h4>
          <p style={{ fontSize: 12, color: 'var(--slate-500)', margin: 0 }}>Otomatis membuka pilihan Kamera / Galeri</p>
        </div>
      )}

      {/* Input File Tunggal (Otomatis ditangani OS HP) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
    </div>
  );
}
