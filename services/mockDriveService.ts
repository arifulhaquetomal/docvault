
import { AppState, Category, Document } from '../types';
import { STORAGE_KEY, DEFAULT_CATEGORIES } from '../constants';

/**
 * In a real-world scenario, this service would use the Google Drive API.
 * For this demo, we simulate the logic of storing a 'metadata.json' file 
 * and document blobs within a specific folder on the user's drive.
 */

export const loadState = (): AppState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    categories: DEFAULT_CATEGORIES,
    documents: [],
    user: null,
  };
};

export const saveState = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const simulateFileUpload = async (file: File): Promise<string> => {
  // Simulates uploading to Google Drive and receiving a File ID
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`drive-file-${Math.random().toString(36).substr(2, 9)}`);
    }, 1500);
  });
};
