import { supabase } from '../lib/supabase';
import { GalleryItem } from '../types';

export const galleryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as GalleryItem[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as GalleryItem;
  },

  async create(item: Omit<GalleryItem, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('gallery')
      .insert([item])
      .select()
      .single();

    if (error) {
      console.error('Gallery create error:', error);
      if (error.message.includes('row-level security')) {
        throw new Error('Gagal menyimpan: Izin ditolak (RLS). Pastikan Anda sudah login dengan akun asli dan menjalankan SQL Policy.');
      }
      throw error;
    }
    return data as GalleryItem;
  },

  async update(id: string, item: Partial<GalleryItem>) {
    const { data, error } = await supabase
      .from('gallery')
      .update(item)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Gallery update error:', error);
      if (error.message.includes('row-level security')) {
        throw new Error('Gagal memperbarui: Izin ditolak (RLS).');
      }
      throw error;
    }
    return data as GalleryItem;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
