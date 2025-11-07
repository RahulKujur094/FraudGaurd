import React from 'react';
import { Shield, BarChart3, Upload, MessageSquare } from 'lucide-react';

interface HeaderProps {
  activeView: 'dashboard' | 'upload' | 'analysis';
  onViewChange: (view: 'dashboard' | 'upload' | 'analysis') => void;
  documentsCount: number;
}

const Header: React.FC<HeaderProps> = ({ activeView, onViewChange, documentsCount }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FraudGuard</h1>
              <p className="text-sm text-gray-500">Document Analysis Platform</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onViewChange('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'dashboard'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
              {documentsCount > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {documentsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onViewChange('upload')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'upload'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>

            <button
              onClick={() => onViewChange('analysis')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'analysis'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Analysis</span>
            </button>
          </nav>

          <div className="flex items-center space-x-3 md:hidden">
            <button
              onClick={() => onViewChange(activeView === 'dashboard' ? 'upload' : 'dashboard')}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
            >
              {activeView === 'dashboard' ? <Upload className="w-5 h-5" /> : <BarChart3 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;