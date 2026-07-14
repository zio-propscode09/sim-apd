import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MahasiswaLayout from '../../components/MahasiswaLayout';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { LoadingPage } from '../../components/Loading';
import { listPeminjaman } from '../../api/peminjaman';
import { FolderOpen } from 'lucide-react';

export default function RiwayatPeminjaman() {
  const [list, setList] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    listPeminjaman()
      .then((res) => setList(res.data))
      .catch(() => setError('Gagal memuat riwayat.'));
  }, []);

  return (
    <MahasiswaLayout title="Riwayat Peminjaman">
      {error && <div className="alert alert-error">{error}</div>}
      {!list && !error && <LoadingPage />}
      {list && list.length === 0 && (
        <EmptyState icon={<FolderOpen size={40} strokeWidth={1.5} color="#94a3b8" />} title="Belum ada riwayat peminjaman" />
      )}
      {list?.map((p) => (
        <Link key={p.id} to={`/m/peminjaman/${p.id}`} className="card" style={{ display: 'block', color: 'inherit' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: 13.5 }}>{p.kode_referensi}</strong>
              <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>
                {p.jumlah_item} item · {new Date(p.tgl_pengajuan).toLocaleDateString('id-ID')}
              </p>
            </div>
            <StatusBadge status={p.status} />
          </div>
        </Link>
      ))}
    </MahasiswaLayout>
  );
}
