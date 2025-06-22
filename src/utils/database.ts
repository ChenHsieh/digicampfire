import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SharedPoem {
  id: string;
  whisper: string;
  anchor: string;
  feeling: string | null;
  text: string;
  created_at: string;
}

export async function sharePoem(poem: {
  whisper: string;
  anchor: string;
  feeling: string;
  text: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('shared_poems')
      .insert([
        {
          whisper: poem.whisper,
          anchor: poem.anchor,
          feeling: poem.feeling || null,
          text: poem.text
        }
      ]);

    if (error) {
      console.error('Error sharing poem:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error sharing poem:', error);
    return { success: false, error: 'Failed to share poem' };
  }
}

export async function getSharedPoems(): Promise<SharedPoem[]> {
  try {
    const { data, error } = await supabase
      .from('shared_poems')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shared poems:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching shared poems:', error);
    return [];
  }
}

export async function getRecentSharedPoems(limit: number = 10): Promise<SharedPoem[]> {
  try {
    const { data, error } = await supabase
      .from('shared_poems')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent shared poems:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching recent shared poems:', error);
    return [];
  }
}