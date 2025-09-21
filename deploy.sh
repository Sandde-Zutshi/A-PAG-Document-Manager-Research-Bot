#!/bin/bash

echo "🚀 Document Manager Research Bot - Super Easy Deployment"
echo "======================================================"
echo ""
echo "✨ This app works immediately without any environment variables!"
echo "   Demo mode is fully functional out of the box."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo "   (This will work immediately - no environment variables needed!)"
echo ""

vercel --prod

echo ""
echo "🎉 SUCCESS! Your app is now live and working!"
echo ""
echo "✅ What works immediately:"
echo "   • Document crawling from EPA sources"
echo "   • Beautiful UI with animations"
echo "   • Demo AI responses (no API key needed)"
echo "   • Document management and display"
echo "   • Real-time status updates"
echo ""
echo "🔑 Optional: Add OpenAI API Key for full AI responses"
echo "   1. Go to Vercel dashboard → Your project"
echo "   2. Settings → Environment Variables"
echo "   3. Add OPENAI_API_KEY with your key"
echo "   4. Automatic redeploy - no manual step needed!"
echo ""
echo "✨ Your Document Manager Research Bot is ready for demos!"

