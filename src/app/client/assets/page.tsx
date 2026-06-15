'use client';

import React, { useState, useMemo } from 'react';
import { 
  FolderOpen, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  FileText, 
  Award, 
  Plus, 
  Download,
  Trash2,
  UploadCloud,
  File
} from 'lucide-react';
import { format } from 'date-fns';
import ReusableTable, { TableColumn } from '@/components/ui/ReusableTable';
import InputWithButtons, { Field, ActionButton } from '@/components/ui/InputWithButtons';
import { toast } from 'react-toastify';

interface FileAsset {
  id: string;
  name: string;
  fileUrl: string;
  fileType: 'IMAGE' | 'VIDEO' | 'LOGO' | 'DOCUMENT';
  fileSize: string;
  uploadedBy: 'CLIENT' | 'AGENCY';
  createdAt: string;
}

const INITIAL_ASSETS: FileAsset[] = [
  {
    id: 'AST-201',
    name: 'brand_logo_main_transparent.png',
    fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=120&auto=format&fit=crop',
    fileType: 'LOGO',
    fileSize: '1.2 MB',
    uploadedBy: 'CLIENT',
    createdAt: '2026-06-08T09:00:00.000Z'
  },
  {
    id: 'AST-202',
    name: 'product_catalog_june2026.pdf',
    fileUrl: '#',
    fileType: 'DOCUMENT',
    fileSize: '4.8 MB',
    uploadedBy: 'CLIENT',
    createdAt: '2026-06-09T14:15:00.000Z'
  },
  {
    id: 'AST-203',
    name: 'hero_homepage_mockup_v2.png',
    fileUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=120&auto=format&fit=crop',
    fileType: 'IMAGE',
    fileSize: '2.5 MB',
    uploadedBy: 'AGENCY',
    createdAt: '2026-06-11T16:20:00.000Z'
  },
  {
    id: 'AST-204',
    name: 'social_promo_animation.mp4',
    fileUrl: '#',
    fileType: 'VIDEO',
    fileSize: '18.4 MB',
    uploadedBy: 'AGENCY',
    createdAt: '2026-06-12T10:00:00.000Z'
  }
];

export default function ClientAssetsPage() {
  const [assets, setAssets] = useState<FileAsset[]>(INITIAL_ASSETS);
  const [filterType, setFilterType] = useState<string>('ALL');

  // Local Form state for assets upload
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState<'IMAGE' | 'VIDEO' | 'LOGO' | 'DOCUMENT'>('IMAGE');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Client side type filtering
  const filteredAssets = useMemo(() => {
    if (filterType === 'ALL') return assets;
    return assets.filter(a => a.fileType === filterType);
  }, [assets, filterType]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName.trim()) {
      toast.error('Please specify an asset name.');
      return;
    }

    const newAsset: FileAsset = {
      id: `AST-20${assets.length + 1}`,
      name: assetName.includes('.') ? assetName.trim() : `${assetName.trim()}.${assetType.toLowerCase() === 'document' ? 'pdf' : assetType.toLowerCase() === 'video' ? 'mp4' : 'png'}`,
      fileUrl: assetType === 'IMAGE' || assetType === 'LOGO' 
        ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=120&auto=format&fit=crop' 
        : '#',
      fileType: assetType,
      fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.5 MB',
      uploadedBy: 'CLIENT',
      createdAt: new Date().toISOString()
    };

    setAssets([newAsset, ...assets]);
    setAssetName('');
    setSelectedFile(null);
    toast.success('Asset uploaded successfully!');
  };

  const handleDeleteAsset = (id: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      setAssets(prev => prev.filter(a => a.id !== id));
      toast.success('Asset deleted successfully.');
    }
  };

  const columns: TableColumn<FileAsset>[] = [
    {
      header: 'Preview / Icon',
      accessor: (item) => {
        if (item.fileType === 'IMAGE' || item.fileType === 'LOGO') {
          return (
            <img 
              src={item.fileUrl} 
              alt="Asset thumbnail" 
              className="w-10 h-10 rounded-lg object-cover mx-auto shadow-sm border border-gray-100 dark:border-white/5"
            />
          );
        }
        return (
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto text-slate-500">
            {item.fileType === 'VIDEO' && <VideoIcon size={16} />}
            {item.fileType === 'DOCUMENT' && <FileText size={16} />}
          </div>
        );
      },
      align: 'center' as const,
    },
    {
      header: 'File Name',
      accessor: (item) => <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 line-clamp-1">{item.name}</span>,
      align: 'left' as const,
    },
    {
      header: 'Category',
      accessor: (item) => {
        const colors: Record<string, string> = {
          IMAGE: 'bg-blue-100/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/30',
          VIDEO: 'bg-pink-100/80 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border border-pink-200/50 dark:border-pink-800/30',
          LOGO: 'bg-indigo-100/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/30',
          DOCUMENT: 'bg-amber-100/80 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/30',
        };
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${colors[item.fileType]}`}>
            {item.fileType}
          </span>
        );
      },
      align: 'center' as const,
    },
    {
      header: 'Size',
      accessor: 'fileSize',
      align: 'center' as const,
    },
    {
      header: 'Uploaded By',
      accessor: (item) => (
        <span className={`text-[10px] font-bold ${item.uploadedBy === 'CLIENT' ? 'text-pink-600 dark:text-pink-400' : 'text-slate-500'}`}>
          {item.uploadedBy === 'CLIENT' ? 'You (Client)' : 'Agency'}
        </span>
      ),
      align: 'center' as const,
    },
    {
      header: 'Upload Date',
      accessor: (item) => {
        try {
          return format(new Date(item.createdAt), 'dd MMM yyyy, hh:mm a');
        } catch {
          return item.createdAt;
        }
      },
      align: 'center' as const,
    },
    {
      header: 'Actions',
      accessor: (item) => (
        <div className="flex items-center justify-center gap-1.5">
          <a
            href={item.fileUrl}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
            title="Download Asset"
            onClick={(e) => item.fileUrl === '#' && e.preventDefault()}
          >
            <Download size={14} />
          </a>
          {item.uploadedBy === 'CLIENT' && (
            <button
              onClick={() => handleDeleteAsset(item.id)}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
              title="Delete Asset"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ),
      align: 'center' as const,
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black">Files & Assets Drive</h2>
          <p className="text-xs text-slate-500 mt-0.5">Central drive for uploading, storing, and exchanging project design assets</p>
        </div>
      </div>

      <div className="space-y-6 animate-fade-in text-slate-900 dark:text-slate-100">
        
        {/* Upload File and Type selectors */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Form Box */}
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <UploadCloud size={16} className="text-pink-500" />
              Upload New Brand Asset
            </h3>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label htmlFor="asset-name-input" className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Asset Label Name</label>
                <input
                  id="asset-name-input"
                  type="text"
                  required
                  placeholder="e.g. brand_guide_cover, product_image..."
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className="w-full h-10 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label htmlFor="asset-type-select" className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Asset Type Category</label>
                <select
                  id="asset-type-select"
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value as any)}
                  className="w-full h-10 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
                >
                  <option value="IMAGE">Image</option>
                  <option value="LOGO">Logo</option>
                  <option value="VIDEO">Video</option>
                  <option value="DOCUMENT">Document</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Select File Upload</label>
                <div className="p-4 rounded-xl border border-dashed border-gray-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/2 text-center relative hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setSelectedFile(file);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <File size={16} className="text-slate-400 mx-auto mb-1.5" />
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block truncate px-2">
                    {selectedFile ? selectedFile.name : 'Pick a local file…'}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-pink-700 hover:bg-pink-800 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 mt-4 cursor-pointer"
              >
                <Plus size={14} />
                Upload Brand Asset
              </button>
            </form>
          </div>

          {/* Directory listings */}
          <div className="lg:col-span-2 p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex sm:items-center justify-between gap-4 flex-wrap border-b border-gray-100 dark:border-white/5 pb-2">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <FolderOpen size={16} className="text-pink-500" />
                  Asset Directory
                </h3>

                {/* Filter chip tabs */}
                <div className="flex flex-wrap gap-1">
                  {['ALL', 'IMAGE', 'LOGO', 'VIDEO', 'DOCUMENT'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setFilterType(t)}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase transition-colors cursor-pointer ${filterType === t ? 'bg-pink-700 text-white shadow-sm' : 'bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300'}`}
                    >
                      {t === 'ALL' ? 'All Drive' : t}
                    </button>
                  ))}
                </div>
              </div>

              <ReusableTable
                data={filteredAssets}
                columns={columns}
                keyExtractor={(item) => item.id}
                loading={false}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
