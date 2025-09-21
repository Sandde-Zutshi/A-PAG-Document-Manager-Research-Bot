'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Download, 
  FileText, 
  Brain, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Sparkles,
  Globe,
  Database,
  Zap
} from 'lucide-react'
import axios from 'axios'

interface Document {
  filename: string
  source: string
  pages: number
  text_length: number
}

interface QueryResponse {
  answer: string
  sources: Document[]
  query: string
  model_used: string
  demo_mode?: boolean
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [domain, setDomain] = useState('https://a-pag.org')
  const [isLoading, setIsLoading] = useState(false)
  const [isCrawling, setIsCrawling] = useState(false)
  const [response, setResponse] = useState<QueryResponse | null>(null)
  const [error, setError] = useState('')
  const [documents, setDocuments] = useState<Document[]>([])
  const [totalDocuments, setTotalDocuments] = useState(0)
  const [crawlStatus, setCrawlStatus] = useState('')
  const [openaiConfigured, setOpenaiConfigured] = useState(true)
  const [setupInstructions, setSetupInstructions] = useState<any>(null)

  // Load document status on component mount
  useEffect(() => {
    loadDocumentStatus()
  }, [])

  const loadDocumentStatus = async () => {
    try {
      const response = await axios.get('/api/query')
      if (response.data.status === 'success') {
        setDocuments(response.data.documents)
        setTotalDocuments(response.data.total_documents)
        setOpenaiConfigured(response.data.openai_configured)
        setSetupInstructions(response.data.setup_instructions)
      }
    } catch (error) {
      console.error('Error loading document status:', error)
    }
  }

  const handleCrawl = async () => {
    if (!domain.trim()) {
      setError('Please enter a valid domain URL')
      return
    }
    
    setIsCrawling(true)
    setCrawlStatus('')
    setError('')
    
    try {
      const response = await axios.post('/api/crawl', { domain: domain.trim() })
      if (response.data.status === 'success') {
        setCrawlStatus(response.data.message)
        setTotalDocuments(response.data.total_files)
        // Reload document status
        await loadDocumentStatus()
      } else {
        setError(response.data.message || 'Crawling failed')
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error during crawling')
    } finally {
      setIsCrawling(false)
    }
  }

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError('')
    setResponse(null)

    try {
      const response = await axios.post('/api/query', { query })
      if (response.data.status === 'success') {
        setResponse(response.data)
      } else {
        setError(response.data.message || 'Query failed')
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error processing query')
    } finally {
      setIsLoading(false)
    }
  }

  const exampleQueries = [
    "What are the main air quality standards mentioned in the documents?",
    "How do the documents address water pollution prevention?",
    "What environmental regulations are discussed?",
    "What are the key findings about climate change impacts?"
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg">
                <img 
                  src="https://a-pag.org/wp-content/uploads/2024/01/A-PAG-Logo-White-BG-300x300.png" 
                  alt="A-PAG Logo" 
                  className="h-8 w-8 object-contain"
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                />
                <div className="h-8 w-8 flex items-center justify-center text-white font-bold text-sm" style={{display: 'none'}}>
                  A-PAG
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">A-PAG Research Bot</h1>
                <p className="text-sm text-gray-600">Pollution Research Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Documents</p>
                <p className="text-lg font-semibold text-primary-600">{totalDocuments}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            A-PAG AI Powered
            <span className="gradient-text block">Pollution Researcher</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Crawl environmental documents, extract insights, and get intelligent answers 
            powered by advanced AI technology.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div 
              className="card text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Database className="h-12 w-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">{totalDocuments}</h3>
              <p className="text-gray-600">Documents Indexed</p>
            </motion.div>
            
            <motion.div 
              className="card text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Globe className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">Custom</h3>
              <p className="text-gray-600">Data Sources</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Domain Input and Action Buttons */}
        <motion.div 
          className="max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="card mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Globe className="h-5 w-5 text-primary-500" />
              <span>Configure Data Source</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter website domain to crawl for documents:
                </label>
                <input
                  id="domain"
                  type="url"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="https://example.com"
                  className="input-field w-full"
                  disabled={isCrawling}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Default: <span className="font-mono">https://a-pag.org</span> - Enter any website URL to crawl for documents
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleCrawl}
                  disabled={isCrawling || !domain.trim()}
                  className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCrawling ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Download className="h-5 w-5" />
                  )}
                  <span>{isCrawling ? 'Crawling...' : 'Crawl Documents'}</span>
                </button>
                
                <button
                  onClick={loadDocumentStatus}
                  className="btn-secondary flex items-center justify-center space-x-2"
                >
                  <FileText className="h-5 w-5" />
                  <span>Refresh Status</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status Messages */}
        <AnimatePresence>
          {crawlStatus && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2"
            >
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-700">{crawlStatus}</span>
            </motion.div>
          )}
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
            >
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </motion.div>
          )}

          {!openaiConfigured && setupInstructions && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    🎉 App is Working in Demo Mode!
                  </h3>
                  <p className="text-green-700 mb-4">
                    You can crawl documents and get demo responses right now! For full AI-powered analysis, add your OpenAI API key (optional).
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">✓</span>
                      <span className="text-green-800">Document crawling works perfectly</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">✓</span>
                      <span className="text-green-800">Demo AI responses available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">✓</span>
                      <span className="text-green-800">Full UI and features working</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-100 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Want full AI responses?</strong> Add your OpenAI API key in Vercel dashboard → Settings → Environment Variables → Add OPENAI_API_KEY
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Query Section */}
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="card mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Search className="h-6 w-6 text-primary-500" />
              <span>Ask Questions</span>
            </h3>
            
            <form onSubmit={handleQuery} className="space-y-4">
              <div>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a question about the environmental documents..."
                  className="input-field min-h-[120px] resize-none"
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Sparkles className="h-5 w-5" />
                  )}
                  <span>
                    {isLoading ? 'Analyzing...' : 
                     !openaiConfigured ? 'Try Demo Mode' : 
                     'Get AI Answer'}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Example Queries */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Example Questions:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exampleQueries.map((example, index) => (
                <motion.button
                  key={index}
                  onClick={() => setQuery(example)}
                  className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all duration-200 hover:border-primary-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <p className="text-sm text-gray-700">{example}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Response */}
          <AnimatePresence>
            {response && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary-500" />
                  <span>{response.demo_mode ? 'Demo Response' : 'AI Response'}</span>
                  {response.demo_mode && (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                      Demo Mode
                    </span>
                  )}
                </h3>
                
                <div className="prose max-w-none">
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{response.answer}</p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Sources:</h4>
                    <div className="space-y-2">
                      {response.sources.map((source, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <FileText className="h-4 w-4" />
                          <span>{source.filename}</span>
                          <span className="text-gray-400">({source.pages} pages)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Documents List */}
          {documents.length > 0 && (
            <motion.div 
              className="card mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Database className="h-5 w-5 text-primary-500" />
                <span>Available Documents</span>
              </h3>
              
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.filename}</p>
                        <p className="text-sm text-gray-600">{doc.pages} pages • {doc.text_length.toLocaleString()} characters</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {doc.source.split('/').pop()}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>A-PAG Research Bot • Built with Next.js • Deployed on Vercel</p>
            <p className="text-sm mt-2">
              Powered by <a href="https://a-pag.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">A-PAG</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
