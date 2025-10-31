
import React, { useState, useCallback } from 'react';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  acceptedTypes: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// A reusable file upload component with drag-and-drop functionality.
// مكون رفع ملفات قابل لإعادة الاستخدام مع وظيفة السحب والإفلات.
const FileUpload: React.FC<FileUploadProps> = ({ file, onFileChange, acceptedTypes }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = useCallback((selectedFile: File | null) => {
    setError('');
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError('حجم الملف يتجاوز الحد المسموح به (10 ميجابايت).');
        onFileChange(null);
        return;
      }
      onFileChange(selectedFile);
    } else {
      onFileChange(null);
    }
  }, [onFileChange]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    handleFileSelect(null);
  };

  return (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">أو ارفع ملفًا</label>
        {!file ? (
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`w-full flex flex-col justify-center items-center px-4 py-6 bg-gray-800 text-gray-300 rounded-lg border-2 border-dashed border-gray-600 cursor-pointer hover:bg-gray-700 hover:border-purple-500 transition-all duration-300 ${isDragOver ? 'border-purple-500 bg-gray-700 scale-105' : ''}`}
            >
                <input id="file-upload" type="file" className="hidden" onChange={handleInputChange} accept={acceptedTypes} />
                <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer">
                    <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                    <span className="font-semibold">اختر ملفًا أو اسحبه هنا</span>
                    <span className="text-xs text-gray-500">يدعم الصور, PDF, Word, TXT</span>
                </label>
            </div>
        ) : (
            <div className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 text-gray-300 rounded-lg border border-purple-500/50">
                <div className="flex items-center space-x-3 overflow-hidden">
                    <FileIcon className="w-6 h-6 text-purple-400 flex-shrink-0" />
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold truncate">{file.name}</span>
                        <span className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                </div>
                <button onClick={removeFile} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>
        )}
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default FileUpload;
