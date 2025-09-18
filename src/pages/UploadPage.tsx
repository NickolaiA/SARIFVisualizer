import React from 'react';
import { FileUpload } from '../components/FileUpload';
import { AlertTriangle, BarChart3, FileText, Shield } from 'lucide-react';

const UploadPage: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary-100 rounded-full">
              <AlertTriangle className="h-12 w-12 text-primary-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SARIF Visualizer
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Upload and visualize Static Analysis Results Interchange Format (SARIF) files
          </p>
        </div>

        {/* File Upload */}
        <FileUpload className="mb-8" />

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <BarChart3 className="h-8 w-8 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Dashboard Analytics</h3>
            <p className="text-sm text-gray-600">
              Comprehensive overview with charts and statistics of your security findings
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <FileText className="h-8 w-8 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Rules Directory</h3>
            <p className="text-sm text-gray-600">
              Browse and understand security rules with external documentation links
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <Shield className="h-8 w-8 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Vulnerability Enrichment</h3>
            <p className="text-sm text-gray-600">
              Enhanced details from CVE, CWE, and NVD databases for comprehensive analysis
            </p>
          </div>
        </div>

        {/* Support info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Supported Tools</h4>
          <p className="text-sm text-blue-700">
            Compatible with SARIF output from Snyk, CodeQL, ESLint, Semgrep, Bandit, and other static analysis tools.
            Supports SARIF 2.1.0 specification.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
