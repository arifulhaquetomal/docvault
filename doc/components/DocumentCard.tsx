
import React from 'react';
import { Document, Category } from '../types';

interface DocumentCardProps {
  doc: Document;
  category?: Category;
  onDelete: (id: string) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ doc, category, onDelete }) => {
  // Construct a simulated Google Drive link. 
  // In a real application, this would be the 'webViewLink' from the Google Drive API.
  const driveLink = `https://drive.google.com/file/d/${doc.driveFileId}/view`;

  const handleView = () => {
    window.open(driveLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${category?.color || 'bg-slate-200'} flex items-center justify-center text-xl`}>
          {category?.icon || '📄'}
        </div>
        <button 
          onClick={() => onDelete(doc.id)}
          className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
          aria-label="Delete document"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold text-slate-900 truncate mb-1" title={doc.title}>
          {doc.title}
        </h3>
        <p className="text-xs text-slate-500 mb-2">
          {category?.name} • {doc.uploadDate}
        </p>
        <div className="bg-slate-50 rounded-lg p-2 min-h-[60px]">
           <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
             {doc.summary}
           </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
          {doc.fileType.split('/')[1] || doc.fileType} • {doc.fileSize}
        </span>
        <button 
          onClick={handleView}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors focus:outline-none focus:underline"
        >
          View File
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
