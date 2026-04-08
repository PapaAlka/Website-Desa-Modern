import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { NewsItem } from '../types';

/**
 * Generates a URL-friendly slug from a title
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export const getPosts = async (onlyPublished = false): Promise<NewsItem[]> => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase is not configured. Returning empty posts.');
    return [];
  }

  try {
    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (onlyPublished) {
      query = query.eq('status', 'Terbit');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error.message);
      throw new Error('Gagal mengambil data berita dari database.');
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching posts:', err);
    throw new Error('Koneksi ke database gagal. Pastikan URL dan API Key Supabase sudah benar.');
  }
};

export const createPost = async (postData: Omit<NewsItem, 'id' | 'created_at'>): Promise<NewsItem> => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase belum dikonfigurasi.');
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([postData])
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error.message);
      throw new Error(`Gagal menambahkan berita: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error('Error creating post:', err);
    throw new Error(err instanceof Error ? err.message : 'Gagal menyimpan berita.');
  }
};

export const updatePost = async (id: string, postData: Partial<NewsItem>): Promise<NewsItem> => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase belum dikonfigurasi.');
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .update(postData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating post:', error.message);
      throw new Error(`Gagal memperbarui berita: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error('Error updating post:', err);
    throw new Error(err instanceof Error ? err.message : 'Gagal memperbarui berita.');
  }
};

export const deletePost = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase belum dikonfigurasi.');
  }

  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting post:', error.message);
      throw new Error('Gagal menghapus berita dari database.');
    }
  } catch (err) {
    console.error('Error deleting post:', err);
    throw new Error('Gagal menghapus berita.');
  }
};
