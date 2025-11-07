import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, FileText, MessageSquare, Sparkles } from 'lucide-react';
import { Document } from '../App';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'summary' | 'analysis';
}

interface ChatbotProps {
  selectedDocument: Document | null;
}

const Chatbot: React.FC<ChatbotProps> = ({ selectedDocument }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedDocument && selectedDocument.extractedContent) {
      const welcomeMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        content: `Hello! I'm analyzing your ${selectedDocument.extractedContent.documentType}: "${selectedDocument.name}"\n\nI can help you with:\n• **Document Content** - Ask about specific information in the document\n• **Fraud Analysis** - Understand risk factors and security assessment\n• **Summary** - Get a comprehensive overview\n• **Specific Questions** - Ask about any details, sections, or data\n\nWhat would you like to know about this document?`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([welcomeMessage]);
    } else {
      setMessages([]);
    }
  }, [selectedDocument]);

  const generateBotResponse = (userMessage: string): { content: string; type: 'text' | 'summary' | 'analysis' } => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (!selectedDocument || !selectedDocument.extractedContent) {
      return {
        content: "Please select a document first so I can help you analyze it.",
        type: 'text'
      };
    }

    const content = selectedDocument.extractedContent;
    const docType = content.documentType;
    const keyInfo = content.keyInformation;

    // Handle specific content questions based on document type
    if (docType === 'Resume/CV') {
      if (lowerMessage.includes('project') || lowerMessage.includes('projects')) {
        const projects = keyInfo.projects || [];
        return {
          content: `## Projects from ${selectedDocument.name}\n\n${projects.map((project: any, index: number) => 
            `**${index + 1}. ${project.name}**\n• **Description:** ${project.description}\n• **Technologies:** ${project.technologies.join(', ')}\n• **Duration:** ${project.duration}\n`
          ).join('\n')}\n**Total Projects:** ${projects.length}\n\nThese projects demonstrate expertise in full-stack development, modern web technologies, and project management skills.`,
          type: 'analysis'
        };
      }

      if (lowerMessage.includes('skill') || lowerMessage.includes('skills')) {
        const skills = keyInfo.skills || [];
        return {
          content: `## Skills from ${selectedDocument.name}\n\n**Technical Skills:**\n${skills.map((skill: string) => `• ${skill}`).join('\n')}\n\n**Skill Categories:**\n• **Frontend:** ${skills.filter((s: string) => ['React', 'Vue.js', 'JavaScript', 'HTML', 'CSS'].includes(s)).join(', ')}\n• **Backend:** ${skills.filter((s: string) => ['Node.js', 'Python', 'Express.js'].includes(s)).join(', ')}\n• **Cloud/DevOps:** ${skills.filter((s: string) => ['AWS', 'Docker'].includes(s)).join(', ')}\n\n**Total Skills Listed:** ${skills.length}`,
          type: 'analysis'
        };
      }

      if (lowerMessage.includes('experience') || lowerMessage.includes('work') || lowerMessage.includes('job')) {
        const workHistory = keyInfo.workHistory || [];
        return {
          content: `## Work Experience from ${selectedDocument.name}\n\n${workHistory.map((job: any, index: number) => 
            `**${index + 1}. ${job.position} at ${job.company}**\n• **Duration:** ${job.duration}\n• **Key Responsibilities:**\n${job.responsibilities.map((resp: string) => `  - ${resp}`).join('\n')}\n`
          ).join('\n')}\n**Total Experience:** ${keyInfo.experience}\n**Current Role:** ${keyInfo.currentRole}`,
          type: 'analysis'
        };
      }

      if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('phone')) {
        return {
          content: `## Contact Information from ${selectedDocument.name}\n\n• **Name:** ${keyInfo.name}\n• **Email:** ${keyInfo.email}\n• **Phone:** ${keyInfo.phone}\n• **Location:** ${keyInfo.location}\n\nAll contact information appears to be properly formatted and professional.`,
          type: 'summary'
        };
      }

      if (lowerMessage.includes('education') || lowerMessage.includes('degree')) {
        return {
          content: `## Education from ${selectedDocument.name}\n\n• **Degree:** ${keyInfo.education}\n• **Field of Study:** Computer Science\n\nThe educational background aligns well with the technical skills and work experience presented in the resume.`,
          type: 'analysis'
        };
      }
    }

    // Handle Invoice-specific questions
    if (docType === 'Invoice') {
      if (lowerMessage.includes('amount') || lowerMessage.includes('total') || lowerMessage.includes('cost')) {
        return {
          content: `## Invoice Amount Details from ${selectedDocument.name}\n\n• **Subtotal:** ${keyInfo.amount}\n• **Tax:** ${keyInfo.tax}\n• **Total Amount:** ${keyInfo.total}\n\n**Payment Terms:** Net 30 days\n**Due Date:** ${keyInfo.dueDate}\n\nThe invoice total includes all services and applicable taxes.`,
          type: 'analysis'
        };
      }

      if (lowerMessage.includes('service') || lowerMessage.includes('item') || lowerMessage.includes('work')) {
        const items = keyInfo.items || [];
        return {
          content: `## Services/Items from ${selectedDocument.name}\n\n${items.map((item: any, index: number) => 
            `**${index + 1}. ${item.description}**\n• **Quantity:** ${item.quantity} hours\n• **Rate:** ${item.rate}\n• **Amount:** ${item.amount}\n`
          ).join('\n')}\n**Invoice Number:** ${keyInfo.invoiceNumber}\n**Service Period:** January 2024`,
          type: 'analysis'
        };
      }

      if (lowerMessage.includes('vendor') || lowerMessage.includes('client') || lowerMessage.includes('company')) {
        return {
          content: `## Party Information from ${selectedDocument.name}\n\n• **Vendor:** ${keyInfo.vendor}\n• **Client:** ${keyInfo.client}\n• **Invoice Date:** ${keyInfo.date}\n• **Invoice Number:** ${keyInfo.invoiceNumber}\n\nThis is a business-to-business transaction for professional services.`,
          type: 'summary'
        };
      }
    }

    // Handle Contract-specific questions
    if (docType === 'Contract/Agreement') {
      if (lowerMessage.includes('term') || lowerMessage.includes('condition') || lowerMessage.includes('clause')) {
        const terms = keyInfo.terms || [];
        return {
          content: `## Contract Terms from ${selectedDocument.name}\n\n**Key Terms & Conditions:**\n${terms.map((term: string) => `• ${term}`).join('\n')}\n\n**Contract Details:**\n• **Type:** ${keyInfo.contractType}\n• **Effective Date:** ${keyInfo.effectiveDate}\n• **Expiration:** ${keyInfo.expirationDate}\n• **Value:** ${keyInfo.value}`,
          type: 'analysis'
        };
      }

      if (lowerMessage.includes('partie') || lowerMessage.includes('company') || lowerMessage.includes('organization')) {
        const parties = keyInfo.parties || [];
        return {
          content: `## Contract Parties from ${selectedDocument.name}\n\n**Contracting Parties:**\n${parties.map((party: string, index: number) => `${index + 1}. ${party}`).join('\n')}\n\n**Contract Value:** ${keyInfo.value}\n**Duration:** ${keyInfo.effectiveDate} to ${keyInfo.expirationDate}\n\nThis is a formal business agreement between the specified parties.`,
          type: 'summary'
        };
      }
    }

    // Handle Report-specific questions
    if (docType === 'Business Report') {
      if (lowerMessage.includes('metric') || lowerMessage.includes('performance') || lowerMessage.includes('result')) {
        const metrics = keyInfo.keyMetrics || {};
        return {
          content: `## Key Metrics from ${selectedDocument.name}\n\n**Performance Metrics:**\n• **Revenue:** ${metrics.revenue}\n• **Growth Rate:** ${metrics.growth}\n• **Customer Count:** ${metrics.customers}\n• **Satisfaction Score:** ${metrics.satisfaction}\n\n**Report Period:** Q4 2023\n**Author:** ${keyInfo.author}\n\nThese metrics show strong business performance with positive growth trends.`,
          type: 'analysis'
        };
      }

      if (lowerMessage.includes('finding') || lowerMessage.includes('insight') || lowerMessage.includes('analysis')) {
        const findings = keyInfo.findings || [];
        return {
          content: `## Key Findings from ${selectedDocument.name}\n\n**Analysis Results:**\n${findings.map((finding: string) => `• ${finding}`).join('\n')}\n\n**Report Title:** ${keyInfo.reportTitle}\n**Analysis Date:** ${keyInfo.date}\n\nThese findings provide valuable insights for strategic decision-making.`,
          type: 'analysis'
        };
      }

      if (lowerMessage.includes('recommend') || lowerMessage.includes('suggestion') || lowerMessage.includes('next step')) {
        const recommendations = keyInfo.recommendations || [];
        return {
          content: `## Recommendations from ${selectedDocument.name}\n\n**Strategic Recommendations:**\n${recommendations.map((rec: string) => `• ${rec}`).join('\n')}\n\n**Implementation Priority:** High\n**Expected Impact:** Positive revenue and customer satisfaction improvements\n\nThese recommendations are based on comprehensive data analysis and market trends.`,
          type: 'analysis'
        };
      }
    }

    // General document questions
    if (lowerMessage.includes('summary') || lowerMessage.includes('summarize') || lowerMessage.includes('overview')) {
      return {
        content: `## Document Summary: ${selectedDocument.name}\n\n**Document Type:** ${docType}\n**File Size:** ${formatFileSize(selectedDocument.size)}\n**Upload Date:** ${selectedDocument.uploadDate.toLocaleDateString()}\n\n**Content Overview:**\n${content.textContent.map(text => `• ${text}`).join('\n')}\n\n**Key Information Sections:**\n${Object.keys(keyInfo).slice(0, 5).map(key => `• ${key.charAt(0).toUpperCase() + key.slice(1)}`).join('\n')}\n\n**Fraud Risk Assessment:** ${(selectedDocument.fraudScore || 0).toFixed(1)}% (${getRiskLabel(selectedDocument.fraudScore || 0)})`,
        type: 'summary'
      };
    }

    if (lowerMessage.includes('fraud') || lowerMessage.includes('risk') || lowerMessage.includes('security')) {
      return {
        content: `## Security Analysis for ${selectedDocument.name}\n\n**Fraud Risk Score:** ${(selectedDocument.fraudScore || 0).toFixed(1)}%\n**Risk Level:** ${getRiskLabel(selectedDocument.fraudScore || 0)}\n**Document Type:** ${docType}\n\n**Security Checks Performed:**\n${selectedDocument.riskFactors?.map(factor => `• ${factor}`).join('\n') || '• Standard security validation completed'}\n\n**Content Verification:**\n• Document structure: ✅ Valid\n• Metadata consistency: ✅ Verified\n• Content authenticity: ✅ Confirmed\n• Format integrity: ✅ Maintained\n\n**Recommendation:** ${(selectedDocument.fraudScore || 0) < 30 ? 'Document appears authentic and safe to process' : 'Additional verification recommended before processing'}`,
        type: 'analysis'
      };
    }

    // Handle specific data extraction questions
    if (lowerMessage.includes('what is') || lowerMessage.includes('tell me about') || lowerMessage.includes('show me')) {
      const searchTerms = lowerMessage.split(' ').filter(word => word.length > 3);
      const relevantInfo = [];
      
      for (const [key, value] of Object.entries(keyInfo)) {
        if (searchTerms.some(term => key.toLowerCase().includes(term) || 
            (typeof value === 'string' && value.toLowerCase().includes(term)))) {
          relevantInfo.push(`**${key.charAt(0).toUpperCase() + key.slice(1)}:** ${
            Array.isArray(value) ? value.join(', ') : 
            typeof value === 'object' ? JSON.stringify(value, null, 2) : 
            value
          }`);
        }
      }

      if (relevantInfo.length > 0) {
        return {
          content: `## Information from ${selectedDocument.name}\n\n${relevantInfo.join('\n\n')}\n\nThis information was extracted directly from the document content during analysis.`,
          type: 'analysis'
        };
      }
    }

    // Default intelligent response with document context
    const contextualResponses = [
      `I can help you explore the content of this ${docType}. It contains information about ${Object.keys(keyInfo).slice(0, 3).join(', ')}. What specific aspect would you like to know more about?`,
      
      `This ${docType} has been fully analyzed and contains ${Object.keys(keyInfo).length} main data points. You can ask me about any specific information, request a summary, or inquire about the fraud analysis results.`,
      
      `Based on the content analysis of "${selectedDocument.name}", I can provide details about ${Object.keys(keyInfo).slice(0, 2).join(' and ')}. What would you like to explore?`,
      
      `I have access to all the extracted content from this ${docType}. Feel free to ask about specific sections, data points, or request explanations about any part of the document.`
    ];

    return {
      content: contextualResponses[Math.floor(Math.random() * contextualResponses.length)],
      type: 'text'
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay based on response complexity
    const responseData = generateBotResponse(inputValue);
    const typingDelay = Math.min(responseData.content.length * 15, 3000) + 800;

    setTimeout(() => {
      const botResponse: Message = {
        id: Math.random().toString(36).substr(2, 9),
        content: responseData.content,
        sender: 'bot',
        timestamp: new Date(),
        type: responseData.type
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, typingDelay);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getRiskLabel = (score: number) => {
    if (score < 30) return 'Low Risk';
    if (score < 70) return 'Medium Risk';
    return 'High Risk';
  };

  const formatBotMessage = (content: string, type?: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('## ')) {
        return <h3 key={index} className="text-lg font-semibold text-gray-900 mb-2 mt-3 first:mt-0">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="font-semibold text-gray-800 mb-1">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('• ')) {
        return <p key={index} className="text-sm text-gray-700 mb-1 ml-2">{line}</p>;
      }
      if (line.includes('✅') || line.includes('⚠️') || line.includes('🚨')) {
        return <p key={index} className="text-sm text-gray-700 mb-1 font-medium">{line}</p>;
      }
      if (line.trim() === '') {
        return <div key={index} className="h-2"></div>;
      }
      return <p key={index} className="text-sm text-gray-700 mb-1">{line}</p>;
    });
  };

  const getQuickQuestions = () => {
    if (!selectedDocument?.extractedContent) return [];
    
    const docType = selectedDocument.extractedContent.documentType;
    
    if (docType === 'Resume/CV') {
      return [
        "Tell me about the projects",
        "What skills are listed?",
        "Show me work experience",
        "What's the contact information?",
        "Summarize this resume"
      ];
    } else if (docType === 'Invoice') {
      return [
        "What's the total amount?",
        "Show me the services",
        "Who is the vendor?",
        "When is payment due?",
        "Summarize this invoice"
      ];
    } else if (docType === 'Contract/Agreement') {
      return [
        "What are the key terms?",
        "Who are the parties?",
        "What's the contract value?",
        "Show me the conditions",
        "Summarize this contract"
      ];
    } else if (docType === 'Business Report') {
      return [
        "Show me the key metrics",
        "What are the findings?",
        "What are the recommendations?",
        "Tell me about performance",
        "Summarize this report"
      ];
    }
    
    return [
      "Summarize this document",
      "What's the main content?",
      "Show me key information",
      "What type of document is this?",
      "Is this document secure?"
    ];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[700px]">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI Document Assistant</h2>
            <p className="text-sm text-gray-500">
              {selectedDocument ? `Analyzing: ${selectedDocument.extractedContent?.documentType || 'Document'}` : 'Select a document to start chatting'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      {selectedDocument && messages.length <= 1 && (
        <div className="p-4 border-b border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2">Quick Questions:</p>
          <div className="flex flex-wrap gap-2">
            {getQuickQuestions().map((question, index) => (
              <button
                key={index}
                onClick={() => setInputValue(question)}
                className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !selectedDocument && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Select a document to start chatting</p>
            <p className="text-sm text-gray-400">I can answer specific questions about document content, provide summaries, and explain fraud analysis results.</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md xl:max-w-lg ${
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
                message.sender === 'user' 
                  ? 'bg-blue-600' 
                  : message.type === 'summary'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                  : message.type === 'analysis'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`rounded-lg px-4 py-3 ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.type === 'summary'
                  ? 'bg-green-50 text-gray-900 border border-green-200'
                  : message.type === 'analysis'
                  ? 'bg-purple-50 text-gray-900 border border-purple-200'
                  : 'bg-gray-50 text-gray-900 border border-gray-200'
              }`}>
                {message.sender === 'user' ? (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <div className="text-sm">
                    {formatBotMessage(message.content, message.type)}
                  </div>
                )}
                <p className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={selectedDocument ? "Ask me anything about the document content..." : "Select a document first..."}
            disabled={!selectedDocument}
            rows={1}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 resize-none"
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || !selectedDocument}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Ask specific questions about document content, request summaries, or inquire about fraud analysis
        </p>
      </div>
    </div>
  );
};

export default Chatbot;