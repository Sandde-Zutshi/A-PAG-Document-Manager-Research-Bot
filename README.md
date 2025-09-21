# Document Manager Research Bot

An AI-powered document research bot that crawls environmental documents, extracts insights, and provides intelligent answers using OpenAI's GPT-4. Built with Next.js and deployed on Vercel.

## 🚀 Features

- **Document Crawling**: Automatically crawls EPA and environmental websites for PDF documents
- **AI-Powered Analysis**: Uses OpenAI GPT-4 to analyze and answer questions about documents
- **Modern UI/UX**: Beautiful, responsive interface with animations and smooth interactions
- **Real-time Status**: Live updates on document processing and crawling status
- **Source Citation**: Provides detailed source information for all answers
- **Vercel Ready**: Optimized for serverless deployment on Vercel

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Python serverless functions
- **AI**: OpenAI GPT-4 Turbo
- **Deployment**: Vercel
- **Document Processing**: PyPDF, BeautifulSoup, Pandas

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- OpenAI API key
- Vercel account (for deployment)

## 🚀 One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/A-PAG-Document-Manager-Research-Bot)

**That's it!** The app will work immediately in demo mode. No environment variables needed for basic functionality.

### 🎯 What Works Out of the Box:
- ✅ Document crawling from EPA sources
- ✅ Beautiful UI and animations
- ✅ Demo AI responses (no API key needed)
- ✅ Document management and display
- ✅ Real-time status updates

### 🔑 Optional: Add OpenAI API Key
For full AI-powered responses, add your OpenAI API key:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your project → **Settings** → **Environment Variables**
3. Add `OPENAI_API_KEY` with your key
4. Redeploy automatically

---

## 🛠️ Local Development

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd A-PAG-Document-Manager-Research-Bot
npm install
```

### 2. Environment Setup (Optional)

```bash
# Copy environment template
cp env.example .env.local

# Add your OpenAI API key (optional for demo mode)
echo "OPENAI_API_KEY=your_actual_api_key_here" >> .env.local
```

### 3. Start Development Server

```bash
npm run dev
# Open http://localhost:3000
```

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
npm run deploy
```

## 🎯 Demo Instructions

### For Impressive Demo:

1. **Start with Crawling**: Click "Crawl Documents" to fetch environmental documents
2. **Show Real-time Updates**: Watch the document count increase and status updates
3. **Ask Intelligent Questions**: Try these demo questions:
   - "What are the main air quality standards mentioned in the documents?"
   - "How do the documents address water pollution prevention?"
   - "What environmental regulations are discussed?"
   - "What are the key findings about climate change impacts?"

4. **Highlight Features**:
   - Beautiful, modern UI with smooth animations
   - Real-time document processing
   - AI-powered intelligent responses
   - Source citation and transparency
   - Responsive design

## 📁 Project Structure

```
├── api/                    # Python serverless functions
│   ├── hello.py           # Health check endpoint
│   ├── crawl.py           # Document crawling logic
│   └── query.py           # AI query processing
├── app/                   # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application page
├── vercel.json            # Vercel configuration
├── package.json           # Node.js dependencies
├── requirements.txt       # Python dependencies
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 🔧 API Endpoints

### GET /api/hello
Health check endpoint

### POST /api/crawl
Crawls environmental websites for PDF documents
- **Response**: List of downloaded files and status

### POST /api/query
Processes AI queries against crawled documents
- **Body**: `{ "query": "your question here" }`
- **Response**: AI-generated answer with sources

### GET /api/query
Returns information about available documents

## 🎨 UI/UX Features

- **Gradient Design**: Modern gradient backgrounds and text effects
- **Smooth Animations**: Framer Motion animations for interactions
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Loading States**: Beautiful loading animations and progress indicators
- **Error Handling**: User-friendly error messages and recovery
- **Glass Morphism**: Modern glass-like effects for cards and components

## 🔒 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | OpenAI API key for GPT-4 access | No* | Demo mode |
| `NEXT_PUBLIC_APP_NAME` | Application name | No | "Document Manager Research Bot" |
| `NEXT_PUBLIC_APP_VERSION` | Application version | No | "1.0.0" |

*Required only for full AI-powered responses. App works in demo mode without it.

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push

### Manual Deployment

```bash
# Build the application
npm run build

# Deploy to Vercel
vercel --prod
```

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 📊 Performance Optimizations

- **Serverless Functions**: Optimized for Vercel's serverless environment
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting for faster loads
- **Caching**: Intelligent caching for API responses
- **Bundle Optimization**: Minimal bundle size with tree shaking

## 🔍 Troubleshooting

### Common Issues:

1. **OpenAI API Key Not Working**
   - Ensure the key is set correctly in environment variables
   - Check API key permissions and billing

2. **Documents Not Crawling**
   - Check network connectivity
   - Verify EPA website accessibility
   - Check serverless function logs

3. **Build Errors**
   - Ensure all dependencies are installed
   - Check TypeScript configuration
   - Verify environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Vercel for hosting platform
- EPA for environmental data sources
- Next.js and React communities

---

**Ready for Demo!** 🎉

This application is optimized for impressive demonstrations with its modern UI, smooth animations, and intelligent AI capabilities. Perfect for showcasing AI-powered document research and analysis.
