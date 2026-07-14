import client from './client';

export const importMahasiswa = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return client
    .post('/api/mahasiswa/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data);
};

export const listMahasiswa = (status) =>
  client
    .get('/api/mahasiswa/list', { params: status ? { status } : {} })
    .then((r) => r.data);

export const updateStatusMahasiswa = (id, status) =>
  client.post('/api/mahasiswa/update_status', { id, status }).then((r) => r.data);
