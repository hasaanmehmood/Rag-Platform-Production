import { supabaseClient } from '../external/supabase-client.js';
import { logger } from '../../shared/logger.js';

export interface IStorageService {
  uploadFile(bucket: string, path: string, file: Buffer, contentType: string): Promise<string>;
  deleteFile(bucket: string, path: string): Promise<void>;
  getPublicUrl(bucket: string, path: string): string;
}

export class SupabaseStorageService implements IStorageService {
  async uploadFile(
    bucket: string,
    path: string,
    file: Buffer,
    contentType: string
  ): Promise<string> {
    try {
      const { data, error } = await supabaseClient.storage
        .from(bucket)
        .upload(path, file, {
          contentType,
          upsert: false,
        });
      
      if (error) {
        throw error;
      }
      
      return data.path;
    } catch (error) {
      logger.error({ error, bucket, path }, 'Failed to upload file');
      throw error;
    }
  }
  
  async deleteFile(bucket: string, path: string): Promise<void> {
    try {
      const { error } = await supabaseClient.storage
        .from(bucket)
        .remove([path]);
      
      if (error) {
        throw error;
      }
    } catch (error) {
      logger.error({ error, bucket, path }, 'Failed to delete file');
      throw error;
    }
  }
  
  getPublicUrl(bucket: string, path: string): string {
    const { data } = supabaseClient.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
}