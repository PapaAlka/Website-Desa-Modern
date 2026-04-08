export interface NavLink {
  name: string;
  href: string;
  action?: () => void;
}

export interface NewsItem {
  id: string; // UUID
  title: string;
  slug: string;
  content: string;
  image_url: string;
  category: 'Berita' | 'Pengumuman' | 'Kegiatan' | 'Pembangunan';
  status: 'Draf' | 'Terbit';
  author_name: string;
  created_at: string;
}

export interface GalleryItem {
  id: string; // UUID
  title: string;
  image_url: string;
  category: string;
  description?: string;
  created_at: string;
}

export interface PotensiItem {
  id: string; // UUID
  nama_item: string;
  deskripsi: string;
  harga: number;
  wa_penjual: string;
  image_url: string;
  tipe: 'UMKM' | 'Wisata' | 'Pertanian';
  created_at: string;
}

export interface Profile {
  id: string;
  nama_desa: string;
  visi: string;
  misi: string;
  sejarah: string;
  alamat: string;
  email: string;
  telepon: string;
  logo_url: string;
  updated_at: string;
}

export interface SuratRequest {
  id: string;
  nik: string;
  nama_warga: string;
  wa_number: string;
  jenis_surat: string;
  status: 'Pending' | 'Diproses' | 'Selesai' | 'Ditolak';
  file_url?: string;
  created_at: string;
}

export interface PerangkatDesa {
  id: string;
  nama: string;
  jabatan: string;
  foto_url: string;
  urutan: number;
  created_at: string;
}
