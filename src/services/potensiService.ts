import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PotensiItem } from '../types';

export const getPotensiDesa = async (): Promise<PotensiItem[]> => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase is not configured. Returning empty potensi.');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('potensi_desa')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching potensi desa:', error.message);
      throw new Error('Gagal mengambil data potensi desa dari database.');
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching potensi desa:', err);
    throw new Error('Koneksi ke database gagal. Periksa konfigurasi Supabase Anda.');
  }
};
