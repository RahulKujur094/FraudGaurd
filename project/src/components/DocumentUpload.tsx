import React, { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';

interface DocumentUploadProps {
  onDocumentUpload: (files: FileList) => void;
  onBackToDashboard: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onDocumentUpload, onBackToDashboard }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    setSelectedFiles(prev => [...prev, ...fileArray]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      const dataTransfer = new DataTransfer();
      selectedFiles.forEach(file => dataTransfer.items.add(file));
      onDocumentUpload(dataTransfer.files);
      setSelectedFiles([]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSupportedFormats = () => [
    'PDF documents (.pdf)',
    'Word documents (.doc, .docx)',
    'Text files (.txt)',
    'Images (.jpg, .jpeg, .png)',
    'Spreadsheets (.xls, .xlsx, .csv)'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Documents</h1>
        <p className="text-lg text-gray-600">
          Upload your documents for comprehensive fraud detection and analysis
        </p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div
          className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.xls,.xlsx,.csv"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <Upload className={`w-12 h-12 mx-auto mb-4 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Drop files here or click to upload
          </h3>
          <p className="text-gray-500 mb-4">
            Support for multiple file formats and batch uploads
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose Files
          </button>
        </div>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Selected Files ({selectedFiles.length})</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {selectedFiles.map((file, index) => (
              <div key={index} className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{file.name}</h3>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="p-6 border-t border-gray-200 flex justify-between">
            <button
              onClick={onBackToDashboard}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleUpload}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start Analysis ({selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''})
            </button>
          </div>
        </div>
      )}

      {/* Supported Formats */}
      <div className="bg-blue-50 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-2">Supported File Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {getSupportedFormats().map((format, index) => (
                <p key={index} className="text-sm text-blue-700">• {format}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;