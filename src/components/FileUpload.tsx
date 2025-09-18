import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useParserWorker } from '../hooks/useParserWorker';

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, className }) => {
  const [dragActive, setDragActive] = useState(false);
  const { parseFile, isLoading, progress, error } = useParserWorker();

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.sarif') && !file.name.toLowerCase().endsWith('.json')) {
      alert('Please select a .sarif or .json file');
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert('File is too large. Maximum size is 50MB.');
      return;
    }

    try {
      onFileSelect?.(file);
      await parseFile(file);
    } catch (err) {
      console.error('Error parsing file:', err);
    }
  }, [parseFile, onFileSelect]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleFiles(e.target.files);
  }, [handleFiles]);

  const getStatusIcon = () => {
    if (error) return <AlertCircle className="h-8 w-8 text-red-500" />;
    if (progress === 100) return <CheckCircle className="h-8 w-8 text-green-500" />;
    if (isLoading) return <Upload className="h-8 w-8 text-blue-500 animate-pulse" />;
    return <Upload className="h-8 w-8 text-gray-400" />;
  };

  const getStatusText = () => {
    if (error) return `Error: ${error}`;
    if (progress === 100) return 'File uploaded and parsed successfully!';
    if (isLoading) return `Parsing... ${progress}%`;
    return 'Drop your SARIF file here or click to browse';
  };

  return (
    <div className={`relative ${className || ''}`}>
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isLoading ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:bg-gray-50'}
          ${error ? 'border-red-300 bg-red-50' : ''}
          ${progress === 100 ? 'border-green-300 bg-green-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isLoading && document.getElementById('file-upload')?.click()}
      >
        <input
          id="file-upload"
          type="file"
          accept=".sarif,.json"
          onChange={handleChange}
          disabled={isLoading}
          className="hidden"
          aria-label="Upload SARIF file"
          title="Upload SARIF file"
        />
        
        <div className="flex flex-col items-center space-y-4">
          {getStatusIcon()}
          
          <div className="text-lg font-medium text-gray-900">
            {getStatusText()}
          </div>
          
          {!isLoading && !error && progress !== 100 && (
            <div className="text-sm text-gray-500">
              <p>Supports .sarif and .json files up to 50MB</p>
              <p className="mt-1">SARIF 2.1.0 format recommended</p>
            </div>
          )}
          
          {isLoading && (
            <div className="w-full max-w-md">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This may take a few moments for large files...
              </p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {progress === 100 && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded max-w-md">
              <p className="text-sm">
                ✓ SARIF file successfully parsed and ready for analysis
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* File info display */}
      {!isLoading && !error && progress !== 100 && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
            <FileText className="h-4 w-4" />
            <span>Supported formats: SARIF 2.1.0, JSON</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
