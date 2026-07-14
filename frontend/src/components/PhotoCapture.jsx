import { useRef, useState, useEffect } from 'react';
import { Camera, Image as ImageIcon, AlertCircle } from 'lucide-react';

/**
 * Input foto dengan dua pilihan:
 * 1. Ambil dari file/galeri.
 * 2. Ambil langsung menggunakan kamera (webcam/kamera HP internal).
 */
export default function PhotoCapture({ label, onChange, required }) {
  const galleryInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasCameraError, setHasCameraError] = useState(false);

  async function startCamera() {
    setIsCapturing(true);
    setHasCameraError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error(err);
      setHasCameraError(true);
    }
  }

  function stopCamera() {
    setIsCapturing(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }

  function capturePhoto() {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], 'kamera_capture_' + Date.now() + '.jpg', { type: 'image/jpeg' });
      setPreview(URL.createObjectURL(file));
      onChange(file);
      stopCamera();
    }, 'image/jpeg', 0.85);
  }

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
    stopCamera();
  }

  // Bersihkan stream kamera saat component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="field">
      <label>
        {label} {required && <span style={{ color: 'var(--red-600)' }}>*</span>}
      </label>

      {/* Tampilan Pengambilan Foto Kamera Aktif */}
      {isCapturing && (
        <div style={{
          background: 'var(--gray-900)',
          borderRadius: 'var(--radius-lg)',
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          marginBottom: 10,
          border: '1px solid var(--gray-300)'
        }}>
          {hasCameraError ? (
            <div style={{ color: 'var(--white)', padding: '20px 10px', textAlign: 'center', fontSize: 13, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={24} color="var(--red-500)" />
              <div>
                Gagal memuat kamera.<br/>
                Pastikan perangkat memiliki kamera aktif dan berikan izin akses kamera.
              </div>
            </div>
          ) : (
            <div style={{
              width: '100%',
              aspectRatio: '4/3',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              background: '#000',
              position: 'relative'
            }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}
          
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            {!hasCameraError && (
              <button
                type="button"
                className="btn btn-accent"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                onClick={capturePhoto}
              >
                <Camera size={16} /> Ambil Foto
              </button>
            )}
            <button
              type="button"
              className="btn btn-outline"
              style={{
                flex: 1,
                background: 'transparent',
                color: 'var(--white)',
                borderColor: 'rgba(255,255,255,0.3)'
              }}
              onClick={stopCamera}
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Tampilan Biasa (Belum memilih & tidak sedang membuka kamera) */}
      {!isCapturing && !preview && (
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
            className="btn btn-outline"
            style={{ flex: 1, padding: '10px 8px', fontSize: 13 }}
            onClick={startCamera}
          >
            <Camera size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} /> Kamera Langsung
          </button>
        </div>
      )}

      {/* Tampilan Preview Foto */}
      {!isCapturing && preview && (
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

      {/* Input File Tersembunyi untuk Galeri */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
    </div>
  );
}
