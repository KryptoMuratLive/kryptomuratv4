# KryptoMurat - Next.js Web3 Platform

🚀 **Vollständig auf Vercel optimierte Web3-Plattform für das Bitcoin Hunt Adventure**

## 📁 Projekt-Struktur

```
/
├── nextjs-app/              # Next.js 14 Application
│   ├── src/app/             # App Router + API Routes
│   ├── src/components/      # React Components
│   ├── src/lib/             # Utilities & Database
│   ├── src/types/           # TypeScript Types
│   └── src/providers/       # Web3 Providers
├── vercel.json              # Vercel Deployment Config
└── README.md                # This file
```

## 🚀 Vercel Deployment

### 1. **Repository Setup**
```bash
git init
git add .
git commit -m "Initial commit - Next.js migration complete"
git remote add origin https://github.com/yourusername/kryptomurat.git
git push -u origin main
```

### 2. **Vercel Import**
1. Gehe zu [vercel.com](https://vercel.com)
2. Klicke auf "New Project"
3. Importiere dein GitHub Repository
4. Vercel erkennt automatisch Next.js

### 3. **Environment Variables in Vercel**
Füge diese Variables in den Vercel Project Settings hinzu:

**Database:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kryptomurat
DB_NAME=kryptomurat
```

**API Keys:**
```env
OPENAI_API_KEY=sk-proj-...
LIVEPEER_API_KEY=...
TELEGRAM_TOKEN=...
```

**Web3 Configuration:**
```env
POLYGON_RPC_URL=https://polygon-rpc.com
MURAT_TOKEN_ADDRESS=0x04296ee51cd6fdfEE0CB1016A818F17b8ae7a1dD
LIVEPEER_BASE_URL=https://livepeer.com/api
WEBHOOK_SECRET=kryptomurat_webhook_secret_2024
```

**Frontend (automatisch gesetzt):**
```env
NEXT_PUBLIC_BACKEND_URL=https://your-app.vercel.app
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=4d6552f8a5d85b900455fb644bab328e
NEXT_PUBLIC_POLYGON_CHAIN_ID=137
```

### 4. **MongoDB Atlas Setup**
1. Erstelle einen [MongoDB Atlas](https://cloud.mongodb.com) Account
2. Erstelle einen neuen Cluster
3. Erstelle einen Database User
4. Whitelist Vercel IP-Bereiche (oder 0.0.0.0/0 für alle)
5. Kopiere die Connection String zu `MONGODB_URI`

### 5. **Deploy**
- Vercel deployt automatisch nach dem Push
- Jeder Push auf `main` triggert eine neue Deployment
- Preview-Deployments für Pull Requests

## 🛠 Lokale Entwicklung

```bash
# In das Next.js Verzeichnis wechseln
cd nextjs-app

# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Production Build testen
npm run build
npm run start
```

## 📊 Features

### 🔗 **Web3 Integration**
- MetaMask/WalletConnect Support
- Polygon Network (MATIC)
- MURAT Token Integration
- Automatische Netzwerk-Erkennung

### 🏦 **Staking System**
- Flexible Laufzeiten (30-360 Tage)
- Variable APY-Raten (2%-8%)
- Automatische Reward-Berechnung
- Position-Management

### 🎮 **Bitcoin Hunt Story**
- Interaktives Adventure-Game
- Entscheidungsbasierte Progression
- Reputation-System
- NFT-gated Content

### 🎥 **Live Streaming**
- Creator-Plattform
- Livepeer Integration
- NFT-Zugriffskontrolle
- Viewer-Tracking

### 🤖 **AI Content Generator**
- OpenAI GPT Integration
- Multiple Content-Typen
- Fallback Mock-System
- User-Generated Content

### 🎭 **NFT Access Control**
- Dynamic Access Levels
- Premium Feature-Gating
- Collection-Based Permissions
- Status Dashboard

## 🔧 API Endpoints

Alle Endpoints sind als Next.js API Routes implementiert:

- `POST /api/wallet/connect` - Wallet verbinden
- `GET /api/wallet/balance/[address]` - Token-Balance abrufen
- `POST /api/staking/create` - Staking-Position erstellen
- `GET /api/staking/positions/[address]` - User-Positionen abrufen
- `GET /api/nft/access/[address]` - NFT-Access prüfen
- `POST /api/ai/generate` - AI-Content generieren
- `GET /api/streams` - Aktive Streams listen
- `POST /api/streams` - Neuen Stream erstellen
- `POST /api/story/initialize` - Story-Game starten
- `GET /api/story/chapters` - Alle Kapitel abrufen
- `POST /api/telegram/subscribe` - Telegram-Notifications

## 📱 Mobile-First Design

- Vollständig responsive
- Touch-optimierte Navigation
- Swipe-Gesten für Tabs
- Mobile-optimierte Wallet-Integration

## 🔒 Sicherheit

- Secure Headers via Next.js
- Environment Variable Scoping
- API Route Protection
- Wallet-Address Validation
- Rate Limiting (über Vercel)

## 🚀 Performance

- **SSR:** Server-side Rendering
- **Code Splitting:** Automatische Route-basierte Aufteilung
- **Image Optimization:** Next.js Image Component
- **API Caching:** Vercel Edge Cache
- **CDN:** Globale Vercel-Distribution

## 📈 Monitoring

- Vercel Analytics (automatisch)
- Web Vitals Tracking
- Error Monitoring
- Performance Insights

## 🎯 Production-Ready

✅ **Build Success:** Erfolgreich kompiliert  
✅ **TypeScript:** Vollständig typisiert  
✅ **ESLint:** Code-Qualität geprüft  
✅ **Responsive:** Mobile + Desktop getestet  
✅ **API Routes:** Alle Endpoints funktional  
✅ **Database:** MongoDB-Integration aktiv  
✅ **Web3:** Wallet-Integration funktioniert  

---

## 💡 Nächste Schritte

1. **Domain:** Custom Domain in Vercel konfigurieren
2. **SSL:** Automatisch via Vercel
3. **Analytics:** Vercel Analytics aktivieren
4. **Monitoring:** Error Tracking einrichten
5. **Testing:** E2E Tests implementieren

**🎉 Ready for Production Deployment!**
