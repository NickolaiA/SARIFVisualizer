import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, FileText, AlertCircle } from 'lucide-react';
import { useSarifParser } from '../hooks/useSarifParser';
import { useSarifStore } from '../store/sarifStore';

export default function Upload() {
  const navigate = useNavigate();
  const { parseFile } = useSarifParser();
  const { isLoading, error } = useSarifStore();
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.sarif') && !file.name.endsWith('.json')) {
      alert('Please select a SARIF file (.sarif or .json)');
      return;
    }

    try {
      await parseFile(file);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error parsing file:', err);
    }
  }, [parseFile, navigate]);

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const loadSampleFile = useCallback(async () => {
    try {
      const response = await fetch('/sample.sarif');
      const text = await response.text();
      const blob = new Blob([text], { type: 'application/json' });
      const file = new File([blob], 'sample.sarif', { type: 'application/json' });
      await handleFile(file);
    } catch (err) {
      console.error('Error loading sample file:', err);
    }
  }, [handleFile]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
          <div className="relative w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
            <UploadIcon className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
          Upload SARIF File
        </h1>
        <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Upload a SARIF file to visualize security analysis results and explore vulnerabilities with 
          <span className="font-semibold text-blue-600"> interactive dashboards</span>
        </p>
      </div>

      {error && (
        <div className="mb-10 p-8 border-2 border-red-200 rounded-3xl bg-gradient-to-r from-red-50 via-pink-50 to-red-50 shadow-xl">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <AlertCircle className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="ml-6">
              <h3 className="text-lg font-bold text-red-900">Upload Error</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-10 mb-16">
        {/* File Upload Area */}
        <div
          className={`group relative border-3 border-dashed rounded-3xl p-16 text-center transition-all duration-500 overflow-hidden ${
            dragActive
              ? 'border-blue-500 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 scale-105 shadow-2xl shadow-blue-500/25'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:via-purple-50 hover:to-indigo-50 hover:scale-105 hover:shadow-xl'
          } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {/* Animated background circles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-1000"></div>
          </div>
          
          <div className="relative z-10">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 transition-all duration-500 shadow-2xl ${
              dragActive 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white scale-110' 
                : 'bg-gradient-to-r from-gray-100 to-blue-100 text-blue-600 group-hover:from-blue-500 group-hover:to-purple-600 group-hover:text-white group-hover:scale-110'
            }`}>
              <UploadIcon className="w-12 h-12" />
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-3">
                  Drop your SARIF file here
                </p>
                <p className="text-lg text-gray-600">or click to browse files</p>
              </div>
              <label className="inline-flex items-center px-10 py-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 cursor-pointer transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-blue-500/50 transform-gpu">
                <UploadIcon className="w-6 h-6 mr-3" />
                Choose File
                <input
                  type="file"
                  className="hidden"
                  accept=".sarif,.json"
                  onChange={handleFileInput}
                  disabled={isLoading}
                />
              </label>
            </div>
            <div className="mt-8 flex items-center justify-center space-x-3 text-sm text-gray-600">
              <span className="font-medium">Supports</span>
              <span className="px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg text-xs font-mono shadow-md border border-gray-200">.sarif</span>
              <span className="text-gray-400">and</span>
              <span className="px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg text-xs font-mono shadow-md border border-gray-200">.json</span>
              <span>files</span>
            </div>
          </div>
        </div>

        {/* Sample File */}
        <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-16 text-center shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 opacity-50"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full -mr-16 -mt-16 opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-100 rounded-full -ml-12 -mb-12 opacity-60"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-8 shadow-2xl">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Try a Sample File
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Load a sample SARIF file to explore the features and see how the visualizer works with real security data
                </p>
              </div>
              <button
                onClick={loadSampleFile}
                disabled={isLoading}
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-2xl text-emerald-700 bg-gradient-to-r from-emerald-100 to-green-100 hover:from-emerald-200 hover:to-green-200 disabled:opacity-50 transition-all duration-300 hover:scale-110 shadow-xl hover:shadow-emerald-500/25"
              >
                <FileText className="w-6 h-6 mr-3" />
                Load Sample
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-12 py-6 rounded-3xl bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 text-blue-700 shadow-2xl border border-blue-200">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mr-4"></div>
            <span className="text-lg font-bold">Parsing SARIF file...</span>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-gray-200 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-full -ml-24 -mb-24 opacity-50"></div>
        
        <div className="relative z-10 flex items-start space-x-8">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <FileText className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              What is SARIF?
            </h3>
            <div className="prose text-gray-700 max-w-none">
              <p className="text-xl leading-relaxed mb-8 text-gray-600">
                <span className="font-bold text-indigo-600">SARIF</span> (Static Analysis Results Interchange Format) is a standard JSON-based 
                format for the output of static analysis tools. It provides a consistent way 
                to represent security vulnerabilities, code quality issues, and other findings 
                from various analysis tools.
              </p>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-6">
                  🚀 This visualizer helps you explore SARIF files by providing:
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="font-medium text-gray-700">Overview dashboard with statistics and charts</span>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="font-medium text-gray-700">Detailed findings explorer with filtering and search</span>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="font-medium text-gray-700">Rule directory with links to external documentation</span>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="font-medium text-gray-700">Individual finding details with code locations and remediation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
