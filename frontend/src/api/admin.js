import client from './client';

export const getArtisans = (status) => {
  const params = status && status !== 'all' ? { status } : {};
  return client.get('/admin/artisans', { params });
};

export const verifyArtisan = (artisanId, payload) => {
  return client.post(`/admin/artisans/${artisanId}/verify`, payload);
};