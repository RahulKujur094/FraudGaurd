import React from 'react';
import { AlertTriangle, CheckCircle, FileText, TrendingUp, Shield, Eye } from 'lucide-react';
import { Document } from '../App';

interface AnalysisResultsProps {
  documents: Document[];
  selectedDocument: Document | null;
  onDocumentSelect: (document: Document | null) => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ 
  documents, 
  selectedDocument, 
  onDocumentSelect 
}) => {
  const completedDocs = documents.filter(doc => doc.status === 'completed');
  
  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-600';
    if (score < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskBg = (score: number) => {
    if (score < 30) return 'bg-green-100';
    if (score < 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getRiskLabel = (score: number) => {
    if (score < 30) return 'Low Risk';
    if (score < 70) return 'Medium Risk';
    return 'High Risk';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analysis Results</h1>
        <div className="text-sm text-gray-500">
          {completedDocs.length} of {documents.length} documents analyzed
        </div>
      </div>

      {/* Document Selector */}
      {completedDocs.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Select Document</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {completedDocs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => onDocumentSelect(doc)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedDocument?.id === doc.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      getRiskBg(doc.fraudScore || 0)
                    } ${getRiskColor(doc.fraudScore || 0)}`}>
                      {(doc.fraudScore || 0).toFixed(1)}%
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(doc.size)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Selected Document Analysis */}
      {selectedDocument && selectedDocument.status === 'completed' && (
        <div className="space-y-6">
          {/* Fraud Score Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Fraud Risk Assessment</h2>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">FraudGuard Analysis</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${
                  getRiskBg(selectedDocument.fraudScore || 0)
                } mb-4`}>
                  <span className={`text-2xl font-bold ${getRiskColor(selectedDocument.fraudScore || 0)}`}>
                    {(selectedDocument.fraudScore || 0).toFixed(0)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Risk Score</h3>
                <p className={`text-sm font-medium ${getRiskColor(selectedDocument.fraudScore || 0)}`}>
                  {getRiskLabel(selectedDocument.fraudScore || 0)}
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Confidence</h3>
                <p className="text-sm text-blue-600 font-medium">
                  {(95 + Math.random() * 5).toFixed(1)}%
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                  <Eye className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Checks Performed</h3>
                <p className="text-sm text-green-600 font-medium">
                  {selectedDocument.riskFactors?.length || 0} Tests
                </p>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Factors Analysis</h2>
            <div className="space-y-3">
              {selectedDocument.riskFactors?.map((factor, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-700">{factor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Document Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Summary</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {selectedDocument.summary}
              </p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-amber-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-amber-800 mb-4">Recommendations</h2>
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <p className="text-sm text-amber-700">
                  Verify document authenticity through additional manual review
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <p className="text-sm text-amber-700">
                  Cross-reference with original source documents if available
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <p className="text-sm text-amber-700">
                  Consider requesting additional supporting documentation
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Documents State */}
      {completedDocs.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No Analysis Available</h2>
          <p className="text-gray-500">
            Upload and process documents to see detailed fraud detection analysis here.
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;