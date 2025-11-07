import React from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Document } from '../App';

interface DashboardProps {
  documents: Document[];
  onDocumentSelect: (document: Document) => void;
  onUploadClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ documents, onDocumentSelect, onUploadClick }) => {
  const completedDocs = documents.filter(doc => doc.status === 'completed');
  const highRiskDocs = completedDocs.filter(doc => (doc.fraudScore || 0) > 70);
  const avgFraudScore = completedDocs.length > 0 
    ? completedDocs.reduce((sum, doc) => sum + (doc.fraudScore || 0), 0) / completedDocs.length 
    : 0;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getRiskBadge = (score: number) => {
    if (score < 30) return { color: 'bg-green-100 text-green-800', label: 'Low Risk' };
    if (score < 70) return { color: 'bg-yellow-100 text-yellow-800', label: 'Medium Risk' };
    return { color: 'bg-red-100 text-red-800', label: 'High Risk' };
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Analyzed</p>
              <p className="text-2xl font-bold text-gray-900">{completedDocs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">High Risk</p>
              <p className="text-2xl font-bold text-gray-900">{highRiskDocs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Risk Score</p>
              <p className="text-2xl font-bold text-gray-900">{avgFraudScore.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onUploadClick}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload New Document
          </button>
          <button className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            <FileText className="w-5 h-5 mr-2" />
            View All Analysis
          </button>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Documents</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {documents.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
              <p className="text-gray-500 mb-6">Upload your first document to get started with fraud detection analysis.</p>
              <button
                onClick={onUploadClick}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </button>
            </div>
          ) : (
            documents.slice().reverse().map((doc) => (
              <div
                key={doc.id}
                onClick={() => onDocumentSelect(doc)}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{doc.name}</h3>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(doc.size)} • {doc.uploadDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {doc.status === 'completed' && doc.fraudScore !== undefined && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskBadge(doc.fraudScore).color}`}>
                        {getRiskBadge(doc.fraudScore).label}
                      </span>
                    )}
                    {doc.status === 'processing' && (
                      <div className="flex items-center text-yellow-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-xs">Processing</span>
                      </div>
                    )}
                    {doc.status === 'completed' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;