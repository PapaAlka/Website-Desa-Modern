import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface DashboardStats {
  totalPosts: number;
  totalSuratRequests: number;
  totalPotensi: number;
  totalGallery: number;
  totalVisitors: string;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  if (!isSupabaseConfigured) {
    return {
      totalPosts: 0,
      totalSuratRequests: 0,
      totalPotensi: 0,
      totalGallery: 0,
      totalVisitors: '0',
    };
  }

  try {
    const [postsCount, suratCount, potensiCount, galleryCount] = await Promise.all([
      supabase.from('posts').select('*', { count: 'exact', head: true }),
      supabase.from('surat_requests').select('*', { count: 'exact', head: true }),
      supabase.from('potensi_desa').select('*', { count: 'exact', head: true }),
      supabase.from('gallery').select('*', { count: 'exact', head: true }),
    ]);

    if (postsCount.error || suratCount.error || potensiCount.error || galleryCount.error) {
      console.error('Error fetching dashboard stats:', {
        posts: postsCount.error?.message,
        surat: suratCount.error?.message,
        potensi: potensiCount.error?.message,
        gallery: galleryCount.error?.message,
      });
      throw new Error('Gagal mengambil statistik dashboard.');
    }

    return {
      totalPosts: postsCount.count || 0,
      totalSuratRequests: suratCount.count || 0,
      totalPotensi: potensiCount.count || 0,
      totalGallery: galleryCount.count || 0,
      totalVisitors: '1.2k', // Placeholder for visitors
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error('Gagal mengambil statistik dashboard. Periksa koneksi database.');
  }
};
