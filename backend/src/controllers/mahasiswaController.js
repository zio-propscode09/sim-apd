const db = require('../config/database');
const { jsonSuccess, jsonError } = require('../helpers/response');
const xlsx = require('xlsx');
const bcrypt = require('bcryptjs');

// GET /api/mahasiswa/list
const getListMahasiswa = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nim, nama, universitas, divisi, wajib_apd, tgl_mulai, tgl_selesai, status, created_at FROM mahasiswa ORDER BY created_at DESC');
    return jsonSuccess(res, rows, 'Berhasil mengambil data mahasiswa.');
  } catch (error) {
    console.error(error);
    return jsonError(res, 'Terjadi kesalahan pada server.', 500);
  }
};

// PUT /api/mahasiswa/update_status/:id
const updateStatus = async (req, res) => {
  try {
    const { id, status } = req.body; // 'aktif', 'selesai', 'nonaktif'

    if (!['aktif', 'selesai', 'nonaktif'].includes(status)) {
      return jsonError(res, 'Status tidak valid.', 400);
    }

    await db.query('UPDATE mahasiswa SET status = ? WHERE id = ?', [status, id]);
    return jsonSuccess(res, null, `Status mahasiswa berhasil diubah menjadi ${status}.`);
  } catch (error) {
    console.error(error);
    return jsonError(res, 'Terjadi kesalahan pada server.', 500);
  }
};

// POST /api/mahasiswa/import
const importMahasiswa = async (req, res) => {
  try {
    if (!req.file) {
      return jsonError(res, 'File Excel tidak ditemukan.', 400);
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (data.length === 0) {
      return jsonError(res, 'File Excel kosong atau format tidak sesuai.', 400);
    }

    let importedCount = 0;
    
    // Process each row
    for (const row of data) {
      const nim = row['NIM'] || row['nim'];
      const nama = row['Nama'] || row['nama'];
      const universitas = row['Universitas'] || row['universitas'];
      const divisi = row['Divisi'] || row['divisi'];
      
      // Handle Date formats from Excel (often needs conversion if read as string or Excel serial date)
      let tglMulai = row['Tanggal Mulai'] || row['tgl_mulai'] || null;
      let tglSelesai = row['Tanggal Selesai'] || row['tgl_selesai'] || null;

      if (!nim || !nama) continue; // Skip incomplete data

      // Check if NIM already exists
      const [existing] = await db.query('SELECT id FROM mahasiswa WHERE nim = ?', [nim]);
      if (existing.length > 0) continue; // Skip duplicate

      // Hash password (default: nim)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(nim.toString(), salt);

      // Check wajib_apd from divisi
      let wajib_apd = true;
      if (divisi) {
        const [divRow] = await db.query('SELECT wajib_apd FROM divisi_wajib_apd WHERE nama_divisi = ?', [divisi]);
        if (divRow.length > 0) {
          wajib_apd = divRow[0].wajib_apd;
        }
      }

      // Convert excel serial dates if necessary (approximate approach, assuming YYYY-MM-DD or excel numbers)
      const parseDate = (d) => {
        if (!d) return null;
        if (typeof d === 'number') {
           const date = new Date((d - (25567 + 2)) * 86400 * 1000);
           return date.toISOString().split('T')[0];
        }
        return d;
      }

      await db.query(
        'INSERT INTO mahasiswa (nim, nama, universitas, divisi, wajib_apd, tgl_mulai, tgl_selesai, password, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [nim, nama, universitas, divisi, wajib_apd, parseDate(tglMulai), parseDate(tglSelesai), hashedPassword, 'aktif']
      );
      importedCount++;
    }

    return jsonSuccess(res, { imported: importedCount }, `Berhasil mengimpor ${importedCount} data mahasiswa.`);
  } catch (error) {
    console.error(error);
    return jsonError(res, 'Terjadi kesalahan saat mengimpor data.', 500);
  }
};

module.exports = {
  getListMahasiswa,
  updateStatus,
  importMahasiswa
};
