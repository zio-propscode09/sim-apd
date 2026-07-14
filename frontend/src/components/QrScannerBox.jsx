import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { ScanLine } from 'lucide-react';

/**
 * Komponen scan QR Code murni via Html5Qrcode.
 * Langsung memulai kamera tanpa UI tambahan.
 *
 * Props:
 *  - onResult(token): dipanggil saat QR berhasil terbaca
 */
export default function QrScannerBox({ onResult }) {
  const elementId = 'qr-reader-box';
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const html5QrCode = new Html5Qrcode(elementId);
    html5QrCodeRef.current = html5QrCode;

    // Delay start to avoid React StrictMode clash
    setTimeout(() => {
      if (!isMounted) return;
      
      html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onResult(decodedText.trim());
        },
        (errorMessage) => {
          // ignore scan errors per frame
        }
      ).catch((err) => {
        console.error("Gagal memulai kamera", err);
      });
    }, 50);

    return () => {
      isMounted = false;
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().then(() => {
          html5QrCodeRef.current.clear();
        }).catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: 'var(--text-main)', fontWeight: 600 }}>
        <ScanLine size={18} strokeWidth={2.5} className="text-primary" />
        <span>Scan QR Code dari Layar Staf HC</span>
      </div>
      <div id={elementId} style={{ borderRadius: 12, overflow: 'hidden' }} />
    </div>
  );
}
