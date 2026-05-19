'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

interface MediaFile {
  name: string;
  path: string;
  size: string;
  type: 'image' | 'pdf' | 'other';
}

export default function AdminMedia() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    fetch('/api/media')
      .then(r => r.json())
      .then(setFiles)
      .catch(() => setFiles([]))
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadStatus('Юкланмоқда...');
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const { adminFetch } = await import('@/lib/admin-api');
        const res = await adminFetch('/api/media', {
          method: 'POST',
          body: JSON.stringify({ name: file.name, data: reader.result, type: file.type }),
        });
        if (res.ok) {
          setUploadStatus('✓ Юкланди!');
          const updated = await fetch('/api/media').then(r => r.json());
          setFiles(updated);
          setTimeout(() => setUploadStatus(''), 2000);
        }
      } catch { setUploadStatus('Хатолик!'); }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (path: string) => {
    if (!confirm('Ушбу файлни ўчиришни хоҳлайсизми?')) return;
    try {
      const { adminFetch } = await import('@/lib/admin-api');
      await adminFetch(`/api/media?path=${encodeURIComponent(path)}`, { method: 'DELETE' });
      setFiles(files.filter(f => f.path !== path));
      setSelectedFile(null);
    } catch { alert('Ўчиришда хатолик'); }
  };

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setUploadStatus('✓ Йўл нусхаланди!');
    setTimeout(() => setUploadStatus(''), 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#1e293b] font-serif">Медиа кутубхонаси</h1>
            <p className="text-[#64748b] mt-1">Юкланган расм ва файлларни бошқариш</p>
          </div>
          <div className="flex items-center gap-3">
            {uploadStatus && <span className="text-green-600 text-sm bg-green-50 px-3 py-1.5 rounded-lg">{uploadStatus}</span>}
            <div className="flex border border-[#e5e7eb] rounded-lg overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-[#1e3a8a] text-white' : 'bg-white text-[#64748b]'}`}>▦</button>
              <button onClick={() => setViewMode('list')} className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-[#1e3a8a] text-white' : 'bg-white text-[#64748b]'}`}>☰</button>
            </div>
            <label className="px-6 py-3 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors font-medium cursor-pointer">
              📤 Юклаш
              <input type="file" accept="image/*,.pdf" onChange={handleUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-6">
          {loading ? (
            <p className="text-center py-12 text-[#64748b]">Юкланмоқда...</p>
          ) : files.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">🖼️</p>
              <p className="text-[#64748b] text-lg">Ҳали файл юкланмаган</p>
              <label className="mt-4 inline-block px-6 py-3 bg-[#1e3a8a] text-white rounded-lg cursor-pointer hover:bg-[#1e40af]">
                Расм юклаш
                <input type="file" accept="image/*,.pdf" onChange={handleUpload} className="hidden" />
              </label>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {files.map(file => (
                <div
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`group relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedFile?.path === file.path ? 'border-[#1e3a8a] shadow-lg' : 'border-transparent hover:border-[#e5e7eb]'
                  }`}
                >
                  {file.type === 'image' ? (
                    <img src={file.path} alt={file.name} className="w-full aspect-square object-cover" />
                  ) : (
                    <div className="w-full aspect-square bg-[#f8fafc] flex items-center justify-center text-3xl">📄</div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-xs truncate">{file.name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left py-3 text-sm text-[#64748b]">Файл</th>
                  <th className="text-left py-3 text-sm text-[#64748b]">Ҳажм</th>
                  <th className="text-right py-3 text-sm text-[#64748b]">Амаллар</th>
                </tr>
              </thead>
              <tbody>
                {files.map(file => (
                  <tr key={file.path} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
                    <td className="py-3 flex items-center gap-3">
                      {file.type === 'image' ? <img src={file.path} className="w-10 h-10 object-cover rounded" /> : <span className="text-xl">📄</span>}
                      <span className="text-sm text-[#1e293b]">{file.name}</span>
                    </td>
                    <td className="py-3 text-sm text-[#64748b]">{file.size}</td>
                    <td className="py-3 text-right">
                      <button onClick={() => copyPath(file.path)} className="text-xs px-3 py-1 rounded bg-blue-50 text-blue-700 mr-2">📋 Нусхалаш</button>
                      <button onClick={() => handleDelete(file.path)} className="text-xs px-3 py-1 rounded bg-red-50 text-red-700">🗑️ Ўчириш</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Selected file info */}
        {selectedFile && (
          <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-6 flex items-start gap-6">
            {selectedFile.type === 'image' && <img src={selectedFile.path} alt="" className="w-48 h-48 object-cover rounded-lg" />}
            <div className="flex-1">
              <h3 className="font-bold text-[#1e293b] text-lg">{selectedFile.name}</h3>
              <p className="text-sm text-[#64748b] mt-1">Ҳажм: {selectedFile.size}</p>
              <p className="text-sm text-[#64748b] mt-1">Йўл: <code className="bg-[#f8fafc] px-2 py-0.5 rounded text-xs">{selectedFile.path}</code></p>
              <div className="flex gap-3 mt-4">
                <button onClick={() => copyPath(selectedFile.path)} className="px-4 py-2 bg-[#1e3a8a] text-white rounded-lg text-sm">📋 Йўлни нусхалаш</button>
                <button onClick={() => handleDelete(selectedFile.path)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm">🗑️ Ўчириш</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
