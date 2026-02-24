
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Layout from './components/Layout';
import Sidebar from './components/Sidebar';
import DocumentCard from './components/DocumentCard';
import { Category, Document, AppState, User } from './types';
import { loadState, saveState, simulateFileUpload } from './services/mockDriveService';
import { analyzeDocument } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(loadState());
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state to local storage (simulating Google Drive background sync)
  useEffect(() => {
    saveState(state);
  }, [state]);

  const handleLogin = () => {
    setIsSyncing(true);
    // Simulate OAuth & Initial Sync
    setTimeout(() => {
      const mockUser: User = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        avatar: 'https://picsum.photos/100/100',
        isLoggedIn: true
      };
      setState(prev => ({ ...prev, user: mockUser }));
      setIsSyncing(false);
      setShowWelcome(false);
    }, 2000);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // 1. Convert to base64 for Gemini
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      const base64Data = await base64Promise;

      // 2. Analyze with Gemini
      const aiResult = await analyzeDocument(file, base64Data);

      // 3. Simulate upload to Drive
      const driveId = await simulateFileUpload(file);

      // 4. Map AI category to our category list
      const matchedCategory = state.categories.find(c => 
        c.name.toLowerCase().includes(aiResult.category.toLowerCase()) || 
        aiResult.category.toLowerCase().includes(c.name.toLowerCase())
      ) || state.categories[state.categories.length - 1]; // Default to 'Other'

      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        title: aiResult.title,
        categoryId: matchedCategory.id,
        uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        fileType: file.type || 'application/octet-stream',
        fileSize: (file.size / 1024).toFixed(1) + ' KB',
        summary: aiResult.summary,
        driveFileId: driveId
      };

      setState(prev => ({
        ...prev,
        documents: [newDoc, ...prev.documents]
      }));

    } catch (error) {
      console.error("Upload process failed:", error);
      alert("Failed to process document. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteDocument = (id: string) => {
    if (confirm("Move this document to trash? It will be removed from your Drive folder.")) {
      setState(prev => ({
        ...prev,
        documents: prev.documents.filter(d => d.id !== id)
      }));
    }
  };

  const handleAddCategory = () => {
    const name = prompt("Enter category name:");
    if (name) {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name,
        icon: '📁',
        color: 'bg-indigo-500'
      };
      setState(prev => ({
        ...prev,
        categories: [...prev.categories, newCat]
      }));
    }
  };

  const filteredDocuments = activeCategoryId 
    ? state.documents.filter(d => d.categoryId === activeCategoryId)
    : state.documents;

  const activeCategory = state.categories.find(c => c.id === activeCategoryId);

  if (!state.user || showWelcome) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 opacity-10 blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 opacity-10 blur-[100px] translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-md w-full text-center z-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl mx-auto mb-8 animate-bounce">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 font-outfit">DocVault AI</h1>
          <p className="text-slate-400 mb-10 leading-relaxed text-lg">
            Intelligent document organization. Powered by Gemini, stored in your own Google Drive.
          </p>
          
          <button 
            onClick={handleLogin}
            disabled={isSyncing}
            className="w-full bg-white text-slate-900 font-bold py-4 rounded-xl shadow-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 disabled:opacity-70 group"
          >
            {isSyncing ? (
              <>
                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting Drive...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="group-hover:translate-x-1 transition-transform">Continue with Google</span>
              </>
            )}
          </button>
          
          <div className="mt-8 text-slate-500 text-sm">
            <p>We only request access to a dedicated <code>/DocVaultAI</code> folder in your Drive. Your data stays yours.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      sidebar={
        <Sidebar 
          categories={state.categories} 
          activeCategoryId={activeCategoryId}
          onSelectCategory={setActiveCategoryId}
          onAddCategory={handleAddCategory}
        />
      }
    >
      <div className="flex flex-col h-full">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 font-outfit">
              {activeCategory ? activeCategory.name : 'Your Vault'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {filteredDocuments.length} documents stored securely in Google Drive
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept="image/*,.pdf,.doc,.docx"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Upload Document</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Processing Overlay (Subtle) */}
        {isUploading && (
          <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-4 animate-pulse">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">
              ✨
            </div>
            <div>
              <p className="text-indigo-900 font-semibold">Gemini is analyzing your document...</p>
              <p className="text-indigo-600 text-xs">Extracting metadata and suggesting best category.</p>
            </div>
          </div>
        )}

        {/* Documents Grid */}
        {filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map(doc => (
              <DocumentCard 
                key={doc.id} 
                doc={doc} 
                category={state.categories.find(c => c.id === doc.categoryId)}
                onDelete={handleDeleteDocument}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Your vault is empty</h3>
            <p className="text-slate-500 max-w-sm mb-8">
              Start by uploading a document. Gemini will automatically categorize it for you!
            </p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-indigo-600 font-bold hover:underline"
            >
              Upload your first file
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
