
import React from 'react';
import { Category } from '../types';

interface SidebarProps {
  categories: Category[];
  activeCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  onAddCategory: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ categories, activeCategoryId, onSelectCategory, onAddCategory }) => {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 font-outfit">DocVault</h1>
      </div>

      <div className="mb-8">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Storage</h2>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-600">Google Drive</span>
            <span className="text-xs font-bold text-indigo-600">84%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '84%' }}></div>
          </div>
          <p className="text-[10px] text-slate-400">12.6 GB of 15 GB used</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Categories</h2>
        <ul className="space-y-1">
          <li>
            <button 
              onClick={() => onSelectCategory(null)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                activeCategoryId === null ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-lg">📂</span>
              <span className="text-sm">All Documents</span>
            </button>
          </li>
          {categories.map(cat => (
            <li key={cat.id}>
              <button 
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                  activeCategoryId === cat.id ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="text-sm">{cat.name}</span>
              </button>
            </li>
          ))}
          <li className="pt-2">
            <button 
              onClick={onAddCategory}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-all font-medium italic border border-dashed border-indigo-200"
            >
              <span className="text-lg">+</span>
              <span className="text-sm">New Category</span>
            </button>
          </li>
        </ul>
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-100">
        <button className="flex items-center gap-3 w-full px-3 py-2 text-slate-600 hover:text-indigo-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
