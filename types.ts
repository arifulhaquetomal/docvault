
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Document {
  id: string;
  title: string;
  categoryId: string;
  uploadDate: string;
  fileType: string;
  fileSize: string;
  summary: string;
  thumbnail?: string;
  driveFileId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
}

export interface AppState {
  categories: Category[];
  documents: Document[];
  user: User | null;
}
