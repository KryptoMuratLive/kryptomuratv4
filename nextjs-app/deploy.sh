#!/bin/bash

# KryptoMurat - Next.js Deployment Script for Vercel

echo "🚀 KryptoMurat - Next.js Deployment Setup"
echo "=========================================="

# Check if we're in the correct directory
if [ ! -f "next.config.ts" ]; then
    echo "❌ Error: Please run this script from the nextjs-app directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Test the build
echo "🧪 Testing production build..."
npm run start &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Test API endpoints
echo "🔍 Testing API endpoints..."
curl -s "http://localhost:3000/api/wallet/balance/0x1234567890123456789012345678901234567890" > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ API endpoints working"
else
    echo "❌ API endpoints failed"
    kill $SERVER_PID
    exit 1
fi

# Test frontend
curl -s "http://localhost:3000/" > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Frontend working"
else
    echo "❌ Frontend failed"
    kill $SERVER_PID
    exit 1
fi

# Stop test server
kill $SERVER_PID

echo "✅ All tests passed!"
echo ""
echo "🔧 Deployment checklist:"
echo "----------------------"
echo "1. ✅ Next.js app built successfully"
echo "2. ✅ API routes working"
echo "3. ✅ Frontend rendering"
echo "4. ⚠️  Set up MongoDB Atlas cluster"
echo "5. ⚠️  Configure environment variables in Vercel"
echo "6. ⚠️  Push to GitHub repository"
echo "7. ⚠️  Connect to Vercel and deploy"
echo ""
echo "📋 Required Environment Variables for Vercel:"
echo "--------------------------------------------"
echo "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kryptomurat"
echo "DB_NAME=kryptomurat"
echo "OPENAI_API_KEY=your_openai_key"
echo "LIVEPEER_API_KEY=your_livepeer_key"
echo "TELEGRAM_TOKEN=your_telegram_bot_token"
echo "POLYGON_RPC_URL=https://polygon-rpc.com"
echo "MURAT_TOKEN_ADDRESS=0x04296ee51cd6fdfEE0CB1016A818F17b8ae7a1dD"
echo "NEXT_PUBLIC_BACKEND_URL=https://your-vercel-app.vercel.app"
echo "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=4d6552f8a5d85b900455fb644bab328e"
echo "NEXT_PUBLIC_POLYGON_CHAIN_ID=137"
echo ""
echo "🎉 Ready for Vercel deployment!"
echo "Visit: https://vercel.com/import"