import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileSpreadsheet, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import StaffLayout from '../../components/StaffLayout';
import CustomSelect from '../../components/CustomSelect';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { SkeletonTable } from '../../components/Loading';
import { listMahasiswa, updateStatusMahasiswa } from '../../api/mahasiswa';
import { exportToExcel, exportToPdf } from '../../utils/exportHelper';

export default function DataMahasiswa() {
  const [list, setList] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  function load() {
    listMahasiswa(filter || undefined)
      .then((res) => setList(res.data))
      .catch(() => setError('Gagal memuat data mahasiswa.'));
  }

  useEffect(() => { load(); }, [filter]);

  useEffect(() => {
    setPage(1);
  }, [search, filter, limit]);

  async function handleUbahStatus(id, status) {
    try {
      await updateStatusMahasiswa(id, status);
      load();
    } catch (err) {
      setError('Gagal mengubah status.');
    }
  }

  const filteredList = list?.filter((m) => {
    const term = search.toLowerCase();
    return (
      (m.nim && m.nim.toLowerCase().includes(term)) ||
      (m.nama && m.nama.toLowerCase().includes(term))
    );
  });

  const startIndex = (page - 1) * limit;
  const paginatedList = filteredList?.slice(startIndex, startIndex + limit) || [];
  const totalPages = filteredList ? Math.ceil(filteredList.length / limit) : 0;

  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, page + 2);
    
    if (page <= 3) endPage = Math.min(5, totalPages);
    if (page >= totalPages - 2) startPage = Math.max(1, totalPages - 4);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  function handleExportExcel() {
    if (!filteredList || filteredList.length === 0) return;
    const headers = ['NIM', 'Nama', 'Universitas', 'Divisi', 'Wajib APD', 'Tgl Mulai', 'Tgl Selesai', 'Status'];
    const data = filteredList.map(m => [
      m.nim,
      m.nama,
      m.universitas || '-',
      m.divisi || '-',
      m.wajib_apd ? 'Ya' : 'Tidak',
      m.tgl_mulai || '-',
      m.tgl_selesai || '-',
      m.status.toUpperCase()
    ]);
    exportToExcel(headers, data, 'Laporan_Data_Mahasiswa_Magang');
  }

  function handleExportPdf() {
    if (!filteredList || filteredList.length === 0) return;
    const headers = ['NIM', 'Nama', 'Universitas', 'Divisi', 'Wajib APD', 'Tgl Mulai', 'Tgl Selesai', 'Status'];
    const data = filteredList.map(m => [
      m.nim,
      m.nama,
      m.universitas || '-',
      m.divisi || '-',
      m.wajib_apd ? 'Ya' : 'Tidak',
      m.tgl_mulai || '-',
      m.tgl_selesai || '-',
      m.status.toUpperCase()
    ]);
    exportToPdf('Laporan Akhir Data Mahasiswa Magang & Wajib APD', headers, data, 'Laporan_Data_Mahasiswa_Magang');
  }

  return (
    <StaffLayout title="Data Mahasiswa">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 300 }}>
          <input
            type="text"
            className="input"
            placeholder="Cari NIM atau Nama..."
            style={{ maxWidth: 300 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <CustomSelect 
            value={filter} 
            onChange={(val) => setFilter(val)}
            options={[
              { value: '', label: 'Semua Status' },
              { value: 'aktif', label: 'Aktif' },
              { value: 'selesai', label: 'Selesai' },
              { value: 'nonaktif', label: 'Nonaktif' }
            ]}
            placeholder="Semua Status"
            style={{ width: 160 }}
          />
          <CustomSelect 
            value={limit} 
            onChange={(val) => setLimit(Number(val))}
            options={[
              { value: 10, label: '10 Data' },
              { value: 20, label: '20 Data' },
              { value: 30, label: '30 Data' },
              { value: 40, label: '40 Data' },
              { value: 50, label: '50 Data' },
              { value: 100, label: '100 Data' }
            ]}
            placeholder="Tampilkan"
            style={{ width: 120 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-excel" onClick={handleExportExcel} disabled={!filteredList || filteredList.length === 0}>
            <FileSpreadsheet size={18} />
            Ekspor Excel
          </button>
          <button className="btn-pdf" onClick={handleExportPdf} disabled={!filteredList || filteredList.length === 0}>
            <FileText size={18} />
            Ekspor PDF
          </button>
          <Link to="/hc/import-mahasiswa" className="btn btn-accent">+ Import Data Mahasiswa</Link>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {!list && !error && <SkeletonTable rows={10} />}
      
      {list && filteredList.length === 0 && <EmptyState icon="🧑‍🎓" title="Belum ada data mahasiswa yang cocok" />}

      {list && filteredList.length > 0 && (
        <div className="card">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>NIM</th><th>Nama</th><th>Divisi</th><th>Wajib APD</th>
                  <th>Periode</th><th>Status</th><th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.map((m) => (
                  <tr key={m.id}>
                    <td>{m.nim}</td>
                    <td>{m.nama}</td>
                    <td>{m.divisi}</td>
                    <td>{m.wajib_apd ? 'Ya' : 'Tidak'}</td>
                    <td>{m.tgl_mulai} – {m.tgl_selesai}</td>
                    <td><StatusBadge status={m.status} /></td>
                    <td>
                      <CustomSelect 
                        value={m.status} 
                        onChange={(val) => handleUbahStatus(m.id, val)}
                        options={[
                          { value: 'aktif', label: 'Aktif' },
                          { value: 'selesai', label: 'Selesai' },
                          { value: 'nonaktif', label: 'Nonaktif' }
                        ]}
                        placeholder="Status"
                        style={{ minWidth: 120 }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: 13, color: 'var(--slate-500)' }}>
              Menampilkan {filteredList.length === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + limit, filteredList.length)} dari {filteredList.length} data
            </span>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <button 
                className="btn btn-outline btn-sm" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ padding: '6px 8px', display: 'flex', alignItems: 'center' }}
              >
                <ChevronLeft size={16} />
              </button>
              
              {getPageNumbers().map(p => (
                <button
                  key={p}
                  className={`btn btn-sm ${page === p ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setPage(p)}
                  style={{ width: 32, padding: 0, justifyContent: 'center' }}
                >
                  {p}
                </button>
              ))}

              <button 
                className="btn btn-outline btn-sm" 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                style={{ padding: '6px 8px', display: 'flex', alignItems: 'center' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </StaffLayout>
  );
}
