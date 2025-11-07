import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DocumentUpload from './components/DocumentUpload';
import AnalysisResults from './components/AnalysisResults';
import Chatbot from './components/Chatbot';

export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  status: 'processing' | 'completed' | 'error';
  fraudScore?: number;
  summary?: string;
  riskFactors?: string[];
  extractedContent?: {
    documentType: string;
    keyInformation: Record<string, any>;
    textContent: string[];
    metadata: Record<string, any>;
  };
}

function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'upload' | 'analysis'>('dashboard');

  const extractDocumentContent = (file: File) => {
    const fileName = file.name.toLowerCase();
    
    // Simulate content extraction based on file type and name
    if (fileName.includes('resume') || fileName.includes('cv')) {
      return {
        documentType: 'Resume/CV',
        keyInformation: {
          name: 'John Smith',
          email: 'john.smith@email.com',
          phone: '+1 (555) 123-4567',
          location: 'New York, NY',
          experience: '5 years',
          currentRole: 'Senior Software Engineer',
          education: 'Bachelor of Computer Science',
          skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
          projects: [
            {
              name: 'E-commerce Platform',
              description: 'Built a full-stack e-commerce platform using React and Node.js',
              technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
              duration: '6 months'
            },
            {
              name: 'Task Management App',
              description: 'Developed a collaborative task management application',
              technologies: ['Vue.js', 'Express.js', 'PostgreSQL', 'Socket.io'],
              duration: '4 months'
            },
            {
              name: 'Data Analytics Dashboard',
              description: 'Created a real-time analytics dashboard for business metrics',
              technologies: ['React', 'D3.js', 'Python', 'FastAPI'],
              duration: '3 months'
            }
          ],
          workHistory: [
            {
              company: 'Tech Solutions Inc.',
              position: 'Senior Software Engineer',
              duration: '2021 - Present',
              responsibilities: ['Led development team of 5 engineers', 'Architected microservices infrastructure', 'Implemented CI/CD pipelines']
            },
            {
              company: 'StartupXYZ',
              position: 'Full Stack Developer',
              duration: '2019 - 2021',
              responsibilities: ['Developed customer-facing web applications', 'Optimized database performance', 'Collaborated with design team']
            }
          ]
        },
        textContent: [
          'Experienced software engineer with 5+ years in full-stack development',
          'Proficient in modern web technologies including React, Node.js, and cloud platforms',
          'Led multiple successful projects from conception to deployment',
          'Strong background in agile development and team leadership'
        ],
        metadata: {
          createdDate: '2024-01-15',
          lastModified: '2024-01-20',
          wordCount: 450,
          sections: ['Contact Info', 'Summary', 'Experience', 'Education', 'Skills', 'Projects']
        }
      };
    } else if (fileName.includes('invoice') || fileName.includes('bill')) {
      return {
        documentType: 'Invoice',
        keyInformation: {
          invoiceNumber: 'INV-2024-001',
          date: '2024-01-15',
          dueDate: '2024-02-15',
          vendor: 'ABC Services Ltd.',
          client: 'XYZ Corporation',
          amount: '$2,450.00',
          tax: '$245.00',
          total: '$2,695.00',
          items: [
            { description: 'Web Development Services', quantity: 40, rate: '$50/hr', amount: '$2,000' },
            { description: 'Consulting Services', quantity: 10, rate: '$45/hr', amount: '$450' }
          ]
        },
        textContent: [
          'Professional services invoice for web development and consulting',
          'Payment terms: Net 30 days',
          'Services provided during January 2024'
        ],
        metadata: {
          currency: 'USD',
          paymentStatus: 'Pending',
          category: 'Professional Services'
        }
      };
    } else if (fileName.includes('contract') || fileName.includes('agreement')) {
      return {
        documentType: 'Contract/Agreement',
        keyInformation: {
          contractType: 'Service Agreement',
          parties: ['Company A', 'Company B'],
          effectiveDate: '2024-01-01',
          expirationDate: '2024-12-31',
          value: '$50,000',
          terms: [
            'Monthly service delivery',
            '24/7 support included',
            'Quarterly performance reviews',
            '30-day termination notice required'
          ]
        },
        textContent: [
          'This agreement outlines the terms and conditions for professional services',
          'Both parties agree to the specified deliverables and timelines',
          'Payment schedule: Monthly invoicing with Net 30 terms'
        ],
        metadata: {
          jurisdiction: 'New York',
          signatureStatus: 'Pending',
          version: '1.2'
        }
      };
    } else if (fileName.includes('report') || fileName.includes('analysis')) {
      return {
        documentType: 'Business Report',
        keyInformation: {
          reportTitle: 'Q4 2023 Performance Analysis',
          author: 'Analytics Team',
          date: '2024-01-10',
          keyMetrics: {
            revenue: '$1.2M',
            growth: '+15%',
            customers: '2,500',
            satisfaction: '4.2/5'
          },
          findings: [
            'Revenue increased by 15% compared to Q3',
            'Customer acquisition cost decreased by 8%',
            'Product satisfaction scores improved significantly',
            'Market expansion opportunities identified'
          ],
          recommendations: [
            'Increase marketing budget for Q1 2024',
            'Expand customer support team',
            'Launch new product features based on feedback'
          ]
        },
        textContent: [
          'Comprehensive analysis of business performance metrics',
          'Data-driven insights and strategic recommendations',
          'Quarterly comparison and trend analysis included'
        ],
        metadata: {
          confidentiality: 'Internal Use Only',
          department: 'Analytics',
          reviewStatus: 'Approved'
        }
      };
    } else {
      // Generic document content
      return {
        documentType: 'General Document',
        keyInformation: {
          title: file.name.replace(/\.[^/.]+$/, ""),
          size: file.size,
          type: file.type,
          sections: Math.floor(Math.random() * 5) + 2,
          estimatedReadTime: Math.floor(file.size / 1000) + ' minutes'
        },
        textContent: [
          'Document contains structured information and data',
          'Multiple sections with detailed content',
          'Professional formatting and layout maintained'
        ],
        metadata: {
          pageCount: Math.floor(file.size / 50000) + 1,
          language: 'English',
          encoding: 'UTF-8'
        }
      };
    }
  };

  const handleDocumentUpload = (files: FileList) => {
    const newDocuments = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date(),
      status: 'processing' as const,
      extractedContent: extractDocumentContent(file)
    }));

    setDocuments(prev => [...prev, ...newDocuments]);
    
    // Simulate processing
    newDocuments.forEach(doc => {
      setTimeout(() => {
        setDocuments(prev => prev.map(d => 
          d.id === doc.id 
            ? {
                ...d,
                status: 'completed' as const,
                fraudScore: Math.random() * 100,
                summary: `This ${doc.extractedContent?.documentType || 'document'} has been analyzed for potential fraud indicators. The document contains ${doc.extractedContent?.textContent.length || 0} key sections with structured information including ${Object.keys(doc.extractedContent?.keyInformation || {}).slice(0, 3).join(', ')}.`,
                riskFactors: [
                  'Document metadata consistency verified',
                  'Content structure analysis completed',
                  'Digital signature validation performed',
                  'Text pattern recognition applied'
                ]
              }
            : d
        ));
      }, 2000 + Math.random() * 3000);
    });

    setActiveView('analysis');
  };

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document);
    setActiveView('analysis');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        activeView={activeView} 
        onViewChange={setActiveView}
        documentsCount={documents.length}
      />
      
      <main className="container mx-auto px-4 py-8">
        {activeView === 'dashboard' && (
          <Dashboard 
            documents={documents}
            onDocumentSelect={handleDocumentSelect}
            onUploadClick={() => setActiveView('upload')}
          />
        )}
        
        {activeView === 'upload' && (
          <DocumentUpload 
            onDocumentUpload={handleDocumentUpload}
            onBackToDashboard={() => setActiveView('dashboard')}
          />
        )}
        
        {activeView === 'analysis' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <AnalysisResults 
                documents={documents}
                selectedDocument={selectedDocument}
                onDocumentSelect={setSelectedDocument}
              />
            </div>
            <div>
              <Chatbot selectedDocument={selectedDocument} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;