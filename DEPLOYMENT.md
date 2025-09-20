# Deployment Guide

## 🚀 Vercel Deployment (Recommended)

### Step 1: Prepare Your Repository

1. Push your code to GitHub
2. Ensure all files are committed and pushed

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your repository
5. Vercel will automatically detect Next.js

### Step 3: Configure Environment Variables

In the Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

```
OPENAI_API_KEY=your_actual_openai_api_key_here
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be live at `https://your-project.vercel.app`

## 🔧 Local Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Python 3.8+ (for API functions)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd A-PAG-Document-Manager-Research-Bot

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local and add your OpenAI API key
```

### Running Locally

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

## 🐍 Python Dependencies

The Python API functions will be automatically handled by Vercel, but for local testing:

```bash
# Install Python dependencies
pip install -r requirements.txt
```

## 🔑 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | OpenAI API key for GPT-4 | Yes | `sk-...` |
| `NEXT_PUBLIC_APP_NAME` | App name | No | `Document Manager` |
| `NEXT_PUBLIC_APP_VERSION` | App version | No | `1.0.0` |

## 🚨 Troubleshooting

### Build Failures

1. **TypeScript Errors**: Run `npx tsc --noEmit` to check
2. **Missing Dependencies**: Ensure `package.json` is correct
3. **Environment Variables**: Check all required vars are set

### Runtime Issues

1. **API Key Issues**: Verify OpenAI API key is valid and has credits
2. **CORS Issues**: Check API endpoints have proper CORS headers
3. **Function Timeouts**: Vercel has 10s timeout for hobby plans

### Performance Issues

1. **Slow Loading**: Check bundle size with `npm run build`
2. **API Timeouts**: Optimize Python functions for faster execution
3. **Memory Issues**: Monitor Vercel function logs

## 📊 Monitoring

### Vercel Analytics

1. Enable Vercel Analytics in dashboard
2. Monitor performance metrics
3. Check function execution times

### Logs

```bash
# View Vercel logs
vercel logs

# View function logs
vercel logs --function=api/query
```

## 🔄 Updates and Maintenance

### Automatic Deployments

- Push to `main` branch triggers automatic deployment
- Preview deployments for pull requests

### Manual Deployments

```bash
# Deploy specific branch
vercel --prod

# Deploy with specific environment
vercel --env=production
```

## 🎯 Demo Preparation

### Pre-Demo Checklist

- [ ] OpenAI API key is configured
- [ ] All environment variables are set
- [ ] Application is deployed and accessible
- [ ] Test crawling functionality
- [ ] Test query functionality
- [ ] Verify responsive design on mobile
- [ ] Check loading states and animations

### Demo Flow

1. **Show Landing Page**: Highlight modern UI and features
2. **Crawl Documents**: Demonstrate real-time document processing
3. **Ask Questions**: Show AI-powered responses with citations
4. **Highlight Features**: Responsive design, animations, error handling

## 🚀 Production Optimizations

### Performance

- Enable Vercel Analytics
- Use Vercel Edge Functions for global performance
- Optimize images with Next.js Image component
- Implement proper caching strategies

### Security

- Use environment variables for sensitive data
- Implement rate limiting for API endpoints
- Add input validation and sanitization
- Use HTTPS (automatic with Vercel)

### Monitoring

- Set up error tracking (Sentry, LogRocket)
- Monitor API usage and costs
- Track user engagement metrics
- Set up alerts for failures

---

**Your app is now ready for an impressive demo!** 🎉
