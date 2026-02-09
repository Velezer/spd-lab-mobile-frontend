export const formatRupiah = (number) => {
  if (number == null) return 'Rp 0';
  return 'Rp ' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const truncateId = (id) => {
  if (!id) return '';
  return id.length > 8 ? `${id.slice(0, 8)}...` : id;
};
